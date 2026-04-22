/**
 * JMdict から しりとり用の名詞（ひらがな読み）を抽出するスクリプト
 *
 * 使い方:
 *   1. JMdict_e.gz をダウンロード:
 *      curl -o scripts/JMdict_e.gz https://www.edrdg.org/pub/Nihongo/JMdict_e.gz
 *   2. 解凍:
 *      gunzip -k scripts/JMdict_e.gz
 *   3. 実行:
 *      node scripts/build-dictionary.js
 *
 * 出力: src/data/words.json
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'JMdict_e');
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'words.json');

// しりとりに使える品詞エンティティ名
const NOUN_ENTITIES = new Set([
  'n',        // noun (common)
  'n-pr',     // proper noun (地名、人名 etc)
  'n-suf',    // noun, used as a suffix
  'n-pref',   // noun, used as a prefix
  'n-t',      // noun (temporal)
  'n-adv',    // adverbial noun
]);

// カタカナ → ひらがな 変換
function katakanaToHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0x60);
  });
}

// ひらがなのみ（長音符ーも許可）かチェック
function isHiraganaOnly(str) {
  return /^[\u3041-\u309f\u30fc]+$/.test(str);
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('JMdict_e が見つかりません。以下のコマンドでダウンロードしてください:');
    console.error('  curl -o scripts/JMdict_e.gz https://www.edrdg.org/pub/Nihongo/JMdict_e.gz');
    console.error('  gunzip -k scripts/JMdict_e.gz');
    process.exit(1);
  }

  console.log('JMdict_e を読み込み中...');
  var xml = fs.readFileSync(INPUT, 'utf8');

  // DTD部分を削除（エンティティ参照はそのまま残す）
  // エントリ部分だけ取得
  var entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  var match;
  var allWords = new Set();
  var entryCount = 0;

  while ((match = entryRegex.exec(xml)) !== null) {
    entryCount++;
    var entryXml = match[1];
    processEntry(entryXml, allWords);
  }

  console.log('処理エントリ数: ' + entryCount);
  console.log('抽出単語数: ' + allWords.size);

  // 先頭文字別にグループ化
  var grouped = {};
  for (var word of allWords) {
    var first = word[0];
    if (!grouped[first]) grouped[first] = [];
    grouped[first].push(word);
  }

  // 各グループをソート
  for (var key of Object.keys(grouped)) {
    grouped[key].sort();
  }

  // キーをソートして出力
  var sorted = {};
  var keys = Object.keys(grouped).sort();
  for (var k of keys) {
    sorted[k] = grouped[k];
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(sorted, null, 2) + '\n');
  console.log('出力: ' + OUTPUT);

  // 統計
  var total = 0;
  for (var k of Object.keys(sorted)) {
    total += sorted[k].length;
  }
  console.log('先頭文字数: ' + Object.keys(sorted).length);
  console.log('総単語数: ' + total);
}

function processEntry(entryXml, allWords) {
  // 品詞チェック: &n; &n-pr; 等のエンティティ参照を検出
  var posRegex = /&([a-z0-9-]+);/g;
  var posMatch;
  var isNoun = false;

  while ((posMatch = posRegex.exec(entryXml)) !== null) {
    if (NOUN_ENTITIES.has(posMatch[1])) {
      isNoun = true;
      break;
    }
  }
  if (!isNoun) return;

  // 読み（reb要素）を抽出
  var rebRegex = /<reb>([^<]+)<\/reb>/g;
  var rebMatch;

  while ((rebMatch = rebRegex.exec(entryXml)) !== null) {
    var reading = rebMatch[1].trim();
    // カタカナ → ひらがな
    var hiragana = katakanaToHiragana(reading);

    // フィルタ条件
    if (!isHiraganaOnly(hiragana)) continue;
    if (hiragana.length < 2) continue;
    if (hiragana[hiragana.length - 1] === '\u3093') continue; // 「ん」終わり除外

    allWords.add(hiragana);
  }
}

main();
