import { describe, it, expect } from 'vitest';
import {
  getLastChar,
  isValidWord,
  isValidMove,
  endsWithN,
  isHiraganaOnly,
  isAlreadyUsed,
  findComputerWord,
  findMeanComputerWord,
  validateInput,
  generateConstraint,
  meetsConstraint,
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

  it('「ん」で終わる単語は選ばない', () => {
    const dictWithN = { 'ご': ['ごはん', 'ごま'] };
    const used = new Set();
    const word = findComputerWord('ご', used, dictWithN);
    expect(word).toBe('ごま');
  });

  it('「ん」で終わる単語しかない場合 → null（CPUの負け）', () => {
    const dictOnlyN = { 'ご': ['ごはん', 'ごぜん'] };
    const used = new Set();
    const word = findComputerWord('ご', used, dictOnlyN);
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

// --- findMeanComputerWord ---
describe('findMeanComputerWord', () => {
  it('攻め文字（ず・ぬ・る・ぷ）で終わる単語を優先する', () => {
    const dict = {
      'り': ['りず', 'りあ', 'りか'],   // りず→「ず」(攻め文字)
      'ず': ['ずこう'],
      'あ': ['あめ'],
      'か': ['かさ'],
    };
    const used = new Set();
    // 20回試行して、すべて「りず」を選ぶはず（攻め文字が優先）
    for (let i = 0; i < 20; i++) {
      const word = findMeanComputerWord('り', used, dict);
      expect(word).toBe('りず');
    }
  });

  it('攻め文字の候補がなければ通常ランダム', () => {
    const dict = { 'り': ['りか', 'りさ'], 'か': ['かめ'], 'さ': ['さけ'] };
    const used = new Set();
    const word = findMeanComputerWord('り', used, dict);
    expect(['りか', 'りさ']).toContain(word);
  });

  it('未使用の単語のみから選ぶ', () => {
    const dict = { 'り': ['りす', 'りか'] };
    const used = new Set(['りす']);
    const word = findMeanComputerWord('り', used, dict);
    expect(word).toBe('りか');
  });

  it('全て使用済み → null', () => {
    const dict = { 'り': ['りす', 'りか'] };
    const used = new Set(['りす', 'りか']);
    const word = findMeanComputerWord('り', used, dict);
    expect(word).toBeNull();
  });

  it('「ん」で終わる単語は選ばない', () => {
    const dict = { 'ご': ['ごはん', 'ごま'], 'ま': ['まど'] };
    const used = new Set();
    const word = findMeanComputerWord('ご', used, dict);
    expect(word).toBe('ごま');
  });

  it('該当文字のキーがない → null', () => {
    const dict = { 'あ': ['あめ'] };
    const used = new Set();
    const word = findMeanComputerWord('ぬ', used, dict);
    expect(word).toBeNull();
  });
});

// --- generateConstraint ---
describe('generateConstraint', () => {
  it('条件を生成できる（endsWith / length / contains のいずれか）', () => {
    const dict = {
      'り': ['りんご', 'りか', 'りす', 'りこう', 'りゅう', 'りゅうがく'],
    };
    const used = new Set();
    const constraint = generateConstraint('り', used, dict);
    expect(constraint).not.toBeNull();
    expect(constraint).toHaveProperty('type');
    expect(constraint).toHaveProperty('label');
    expect(['endsWith', 'length', 'contains']).toContain(constraint.type);
  });

  it('辞書にキーがない → null', () => {
    const dict = { 'あ': ['あめ'] };
    const used = new Set();
    expect(generateConstraint('ぬ', used, dict)).toBeNull();
  });

  it('全て使用済み → null', () => {
    const dict = { 'り': ['りす', 'りか'] };
    const used = new Set(['りす', 'りか']);
    expect(generateConstraint('り', used, dict)).toBeNull();
  });

  it('「ん」で終わる単語しかない場合 → null', () => {
    const dict = { 'り': ['りん', 'りんかん'] };
    const used = new Set();
    expect(generateConstraint('り', used, dict)).toBeNull();
  });
});

// --- meetsConstraint ---
describe('meetsConstraint', () => {
  it('endsWith: 語尾が一致 → true', () => {
    expect(meetsConstraint('りす', { type: 'endsWith', char: 'す' })).toBe(true);
  });

  it('endsWith: 語尾が不一致 → false', () => {
    expect(meetsConstraint('りか', { type: 'endsWith', char: 'す' })).toBe(false);
  });

  it('length: 文字数一致 → true', () => {
    expect(meetsConstraint('りんご', { type: 'length', value: 3 })).toBe(true);
  });

  it('length: 文字数不一致 → false', () => {
    expect(meetsConstraint('りす', { type: 'length', value: 3 })).toBe(false);
  });

  it('contains: 含む → true', () => {
    expect(meetsConstraint('りんご', { type: 'contains', char: 'ん' })).toBe(true);
  });

  it('contains: 含まない → false', () => {
    expect(meetsConstraint('りす', { type: 'contains', char: 'ん' })).toBe(false);
  });

  it('constraint が null → true', () => {
    expect(meetsConstraint('りす', null)).toBe(true);
  });
});
