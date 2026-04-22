import { useState, useCallback, useRef } from 'react';
import { getLastChar, validateInput, findComputerWord } from '../utils/shiritori.js';
import dictionary from '../data/words.json';

const INITIAL_WORD = 'しりとり';
const INITIAL_LAST_CHAR = 'り';

export function useShiritoriGame() {
  const [words, setWords] = useState([
    { text: INITIAL_WORD, speaker: 'cpu' },
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win' | 'lose'
  const [error, setError] = useState(null);
  const usedWordsRef = useRef(new Set([INITIAL_WORD]));

  const lastChar = words.length > 0
    ? getLastChar(words[words.length - 1].text)
    : INITIAL_LAST_CHAR;

  const turnCount = Math.floor(words.filter(w => w.speaker === 'user').length);

  const submitWord = useCallback((input) => {
    if (gameOver) return;

    const trimmed = input.trim();
    const validationError = validateInput(trimmed, lastChar, usedWordsRef.current, dictionary);

    if (validationError === 'ん') {
      // 「ん」で終わる → ゲームオーバー
      usedWordsRef.current.add(trimmed);
      setWords(prev => [...prev, { text: trimmed, speaker: 'user' }]);
      setGameOver(true);
      setGameResult('lose');
      setError(null);
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    // ユーザーの単語を追加
    usedWordsRef.current.add(trimmed);
    const userLastChar = getLastChar(trimmed);

    // CPUの返答
    const cpuWord = findComputerWord(userLastChar, usedWordsRef.current, dictionary);

    if (!cpuWord) {
      // CPUが単語を見つけられない → ユーザーの勝ち
      setWords(prev => [...prev, { text: trimmed, speaker: 'user' }]);
      setGameOver(true);
      setGameResult('win');
      setError(null);
      return;
    }

    usedWordsRef.current.add(cpuWord);
    setWords(prev => [
      ...prev,
      { text: trimmed, speaker: 'user' },
      { text: cpuWord, speaker: 'cpu' },
    ]);
    setError(null);
  }, [gameOver, lastChar]);

  const resetGame = useCallback(() => {
    usedWordsRef.current = new Set([INITIAL_WORD]);
    setWords([{ text: INITIAL_WORD, speaker: 'cpu' }]);
    setGameOver(false);
    setGameResult(null);
    setError(null);
  }, []);

  const giveUp = useCallback(() => {
    if (gameOver) return;
    setGameOver(true);
    setGameResult('lose');
    setError(null);
  }, [gameOver]);

  return {
    words,
    gameOver,
    gameResult,
    error,
    lastChar,
    turnCount,
    submitWord,
    resetGame,
    giveUp,
  };
}
