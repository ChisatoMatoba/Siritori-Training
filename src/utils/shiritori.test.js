import { describe, it, expect } from 'vitest';
import {
  getLastChar,
  isValidWord,
  isValidMove,
  endsWithN,
  isHiraganaOnly,
  isAlreadyUsed,
  findComputerWord,
  validateInput,
} from './shiritori.js';

// --- getLastChar ---
describe('getLastChar', () => {
  it('通常の文字をそのまま返す', () => {
    expect(getLastChar('りんご')).toBe('ご');
  });

  it('小文字「ゃ」→「や」に変換', () => {
    expect(getLastChar('おちゃ')).toBe('や');
  });

  it('小文字「ゅ」→「ゆ」に変換', () => {
    expect(getLastChar('きゅ')).toBe('ゆ');
  });

  it('小文字「ょ」→「よ」に変換', () => {
    expect(getLastChar('しょ')).toBe('よ');
  });

  it('小文字「っ」→「つ」に変換', () => {
    expect(getLastChar('きっ')).toBe('つ');
  });

  it('長音「ー」→ 直前文字の母音に変換（カ行→あ）', () => {
    expect(getLastChar('すきー')).toBe('い');
  });

  it('長音「ー」→ 直前文字の母音に変換（コ行→お）', () => {
    expect(getLastChar('こーひー')).toBe('い');
  });

  it('空文字列', () => {
    expect(getLastChar('')).toBe('');
  });

  it('null', () => {
    expect(getLastChar(null)).toBe('');
  });
});

// --- isValidWord ---
describe('isValidWord', () => {
  const dict = { 'り': ['りんご', 'りす'], 'か': ['かさ'] };

  it('辞書に存在する単語 → true', () => {
    expect(isValidWord('りんご', dict)).toBe(true);
  });

  it('辞書に存在しない単語 → false', () => {
    expect(isValidWord('りんく', dict)).toBe(false);
  });

  it('先頭文字のキーが辞書にない → false', () => {
    expect(isValidWord('ぬま', dict)).toBe(false);
  });
});

// --- isValidMove ---
describe('isValidMove', () => {
  it('正しいしりとり → true', () => {
    expect(isValidMove('ごりら', 'ご')).toBe(true);
  });

  it('間違ったしりとり → false', () => {
    expect(isValidMove('ごりら', 'か')).toBe(false);
  });
});

// --- endsWithN ---
describe('endsWithN', () => {
  it('「ん」で終わる → true', () => {
    expect(endsWithN('みかん')).toBe(true);
  });

  it('「ん」で終わらない → false', () => {
    expect(endsWithN('りんご')).toBe(false);
  });
});

// --- isHiraganaOnly ---
describe('isHiraganaOnly', () => {
  it('ひらがなのみ → true', () => {
    expect(isHiraganaOnly('りんご')).toBe(true);
  });

  it('長音符も許可 → true', () => {
    expect(isHiraganaOnly('こーひー')).toBe(true);
  });

  it('カタカナ混在 → false', () => {
    expect(isHiraganaOnly('リンゴ')).toBe(false);
  });

  it('漢字混在 → false', () => {
    expect(isHiraganaOnly('林檎')).toBe(false);
  });

  it('英数字混在 → false', () => {
    expect(isHiraganaOnly('abc123')).toBe(false);
  });
});

// --- isAlreadyUsed ---
describe('isAlreadyUsed', () => {
  const used = new Set(['りんご', 'ごりら']);

  it('既出 → true', () => {
    expect(isAlreadyUsed('りんご', used)).toBe(true);
  });

  it('未出 → false', () => {
    expect(isAlreadyUsed('らっぱ', used)).toBe(false);
  });
});

// --- findComputerWord ---
describe('findComputerWord', () => {
  const dict = { 'り': ['りんご', 'りす', 'りか'], 'あ': ['あめ'] };

  it('未使用の単語を返す', () => {
    const used = new Set();
    const word = findComputerWord('り', used, dict);
    expect(dict['り']).toContain(word);
  });

  it('一部使用済みでも残りから選ぶ', () => {
    const used = new Set(['りんご', 'りす']);
    const word = findComputerWord('り', used, dict);
    expect(word).toBe('りか');
  });

  it('全て使用済み → null', () => {
    const used = new Set(['りんご', 'りす', 'りか']);
    const word = findComputerWord('り', used, dict);
    expect(word).toBeNull();
  });

  it('該当文字のキーがない → null', () => {
    const used = new Set();
    const word = findComputerWord('ぬ', used, dict);
    expect(word).toBeNull();
  });
});

// --- validateInput ---
describe('validateInput', () => {
  const dict = { 'り': ['りんご', 'りす'], 'ご': ['ごりら'], 'す': ['すいか'] };
  const lastChar = 'り';

  it('正しい入力 → null（エラーなし）', () => {
    const used = new Set();
    expect(validateInput('りんご', lastChar, used, dict)).toBeNull();
  });

  it('空入力 → エラーメッセージ', () => {
    const used = new Set();
    expect(validateInput('', lastChar, used, dict)).toBe('単語を入力してください');
  });

  it('ひらがな以外 → エラーメッセージ', () => {
    const used = new Set();
    expect(validateInput('リンゴ', lastChar, used, dict)).toBe('ひらがなで入力してください');
  });

  it('先頭文字不一致 → エラーメッセージ', () => {
    const used = new Set();
    expect(validateInput('ごりら', lastChar, used, dict)).toBe('「り」から始まる単語を入力してください');
  });

  it('既出単語 → エラーメッセージ', () => {
    const used = new Set(['りんご']);
    expect(validateInput('りんご', lastChar, used, dict)).toBe('その単語はもう使われています');
  });

  it('辞書にない → エラーメッセージ', () => {
    const used = new Set();
    expect(validateInput('りもこん', lastChar, used, dict)).toBe('その単語は辞書にありません');
  });

  it('「ん」で終わる → 特殊エラー「ん」', () => {
    const dict2 = { ...dict, 'り': [...dict['り'], 'りんりん'] };
    const used = new Set();
    expect(validateInput('りんりん', lastChar, used, dict2)).toBe('ん');
  });
});
