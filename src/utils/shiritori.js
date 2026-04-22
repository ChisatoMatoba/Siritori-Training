/**
 * しりとりのコアロジック
 */

/** 小文字かな → 大文字かな 変換マップ */
const SMALL_TO_LARGE = {
  'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ',
  'っ': 'つ',
  'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
};

/** 長音「ー」の直前文字の母音を推定するマップ */
const VOWEL_MAP = {
  'あ': 'あ', 'か': 'あ', 'さ': 'あ', 'た': 'あ', 'な': 'あ',
  'は': 'あ', 'ま': 'あ', 'や': 'あ', 'ら': 'あ', 'わ': 'あ',
  'が': 'あ', 'ざ': 'あ', 'だ': 'あ', 'ば': 'あ', 'ぱ': 'あ',
  'い': 'い', 'き': 'い', 'し': 'い', 'ち': 'い', 'に': 'い',
  'ひ': 'い', 'み': 'い', 'り': 'い', 'ぎ': 'い', 'じ': 'い',
  'ぢ': 'い', 'び': 'い', 'ぴ': 'い',
  'う': 'う', 'く': 'う', 'す': 'う', 'つ': 'う', 'ぬ': 'う',
  'ふ': 'う', 'む': 'う', 'ゆ': 'う', 'る': 'う', 'ぐ': 'う',
  'ず': 'う', 'づ': 'う', 'ぶ': 'う', 'ぷ': 'う',
  'え': 'え', 'け': 'え', 'せ': 'え', 'て': 'え', 'ね': 'え',
  'へ': 'え', 'め': 'え', 'れ': 'え', 'げ': 'え', 'ぜ': 'え',
  'で': 'え', 'べ': 'え', 'ぺ': 'え',
  'お': 'お', 'こ': 'お', 'そ': 'お', 'と': 'お', 'の': 'お',
  'ほ': 'お', 'も': 'お', 'よ': 'お', 'ろ': 'お', 'を': 'お',
  'ご': 'お', 'ぞ': 'お', 'ど': 'お', 'ぼ': 'お', 'ぽ': 'お',
};

/**
 * 単語の最後の有効文字を取得する
 * - 小文字かな → 大文字に変換
 * - 長音「ー」→ 直前文字の母音に変換
 */
export function getLastChar(word) {
  if (!word || word.length === 0) return '';
  const lastChar = word[word.length - 1];

  if (lastChar === 'ー' && word.length >= 2) {
    const prevChar = word[word.length - 2];
    return VOWEL_MAP[prevChar] || prevChar;
  }

  if (SMALL_TO_LARGE[lastChar]) {
    return SMALL_TO_LARGE[lastChar];
  }

  return lastChar;
}

/**
 * 辞書に存在するかチェック
 */
export function isValidWord(word, dictionary) {
  const firstChar = word[0];
  const wordList = dictionary[firstChar];
  if (!wordList) return false;
  return wordList.includes(word);
}

/**
 * 前の単語の末尾文字で始まっているか
 */
export function isValidMove(word, lastChar) {
  return word[0] === lastChar;
}

/**
 * 「ん」で終わるかチェック
 */
export function endsWithN(word) {
  return word[word.length - 1] === 'ん';
}

/**
 * ひらがなのみかチェック
 */
export function isHiraganaOnly(word) {
  return /^[\u3041-\u309f\u30fc]+$/.test(word);
}

/**
 * 既出単語チェック
 */
export function isAlreadyUsed(word, usedWords) {
  return usedWords.has(word);
}

/**
 * CPUが次の単語を選ぶ
 * 該当する先頭文字の単語リストからランダムに未使用の単語を選択
 */
export function findComputerWord(lastChar, usedWords, dictionary) {
  const candidates = dictionary[lastChar];
  if (!candidates || candidates.length === 0) return null;

  // 未使用かつ「ん」で終わらない単語をフィルタ
  const available = candidates.filter(w => !usedWords.has(w) && !endsWithN(w));
  if (available.length === 0) return null;

  // ランダムに1つ選ぶ
  const index = Math.floor(Math.random() * available.length);
  return available[index];
}

/**
 * いじわるCPUが次の単語を選ぶ
 * 末尾が「ず」「ぬ」「る」「ぷ」になる単語を優先して選ぶ（相手を追い詰める）
 */
const MEAN_TARGETS = new Set(['ず', 'ぬ', 'る', 'ぷ']);

export function findMeanComputerWord(lastChar, usedWords, dictionary) {
  const candidates = dictionary[lastChar];
  if (!candidates || candidates.length === 0) return null;

  const available = candidates.filter(w => !usedWords.has(w) && !endsWithN(w));
  if (available.length === 0) return null;

  // 攻め文字で終わる単語を優先
  const meanWords = available.filter(w => MEAN_TARGETS.has(getLastChar(w)));
  if (meanWords.length > 0) {
    const index = Math.floor(Math.random() * meanWords.length);
    return meanWords[index].word ?? meanWords[index];
  }

  // 攻め文字がなければ通常ランダム
  const index = Math.floor(Math.random() * available.length);
  return available[index];
}

/**
 * 入力のバリデーション
 * エラーがあればメッセージを返す。なければnull。
 */
export function validateInput(word, lastChar, usedWords, dictionary) {
  if (!word || word.trim() === '') {
    return '単語を入力してください';
  }

  const trimmed = word.trim();

  if (!isHiraganaOnly(trimmed)) {
    return 'ひらがなで入力してください';
  }

  if (!isValidMove(trimmed, lastChar)) {
    return `「${lastChar}」から始まる単語を入力してください`;
  }

  if (isAlreadyUsed(trimmed, usedWords)) {
    return 'その単語はもう使われています';
  }

  if (!isValidWord(trimmed, dictionary)) {
    return 'その単語は辞書にありません';
  }

  if (endsWithN(trimmed)) {
    return 'ん';  // 特殊: ゲームオーバー
  }

  return null;
}
