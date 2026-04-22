import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getLastChar,
  validateInput,
  findComputerWord,
  generateConstraint,
  meetsConstraint,
} from '../utils/shiritori.js';
import dictionary from '../data/words.json';

const INITIAL_WORD = 'しりとり';

export function useConstraintGame() {
  const [words, setWords] = useState([
    { text: INITIAL_WORD, speaker: 'cpu' },
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [error, setError] = useState(null);
  const [constraint, setConstraint] = useState(null);
  const usedWordsRef = useRef(new Set([INITIAL_WORD]));

  const lastChar = words.length > 0
    ? getLastChar(words[words.length - 1].text)
    : 'り';

  const turnCount = Math.floor(words.filter(w => w.speaker === 'user').length);

  // 初回のしばり条件を生成
  useEffect(() => {
    if (!constraint && !gameOver) {
      const c = generateConstraint(lastChar, usedWordsRef.current, dictionary);
      if (c) setConstraint(c);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitWord = useCallback((input) => {
    if (gameOver) return;

    const trimmed = input.trim();
    const validationError = validateInput(trimmed, lastChar, usedWordsRef.current, dictionary);

    if (validationError === 'ん') {
      usedWordsRef.current.add(trimmed);
      setWords(prev => [...prev, { text: trimmed, speaker: 'user' }]);
      setGameOver(true);
      setGameResult('lose');
      setError(null);
      setConstraint(null);
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    // しばり条件チェック
    if (constraint && !meetsConstraint(trimmed, constraint)) {
      setError(`しばり「${constraint.label}」を満たしていません`);
      return;
    }

    usedWordsRef.current.add(trimmed);
    const userLastChar = getLastChar(trimmed);

    // CPUの返答（通常ロジック）
    const cpuWord = findComputerWord(userLastChar, usedWordsRef.current, dictionary);

    if (!cpuWord) {
      setWords(prev => [...prev, { text: trimmed, speaker: 'user' }]);
      setGameOver(true);
      setGameResult('win');
      setError(null);
      setConstraint(null);
      return;
    }

    usedWordsRef.current.add(cpuWord);
    const cpuLastChar = getLastChar(cpuWord);

    // 次のしばり条件を生成
    const nextConstraint = generateConstraint(cpuLastChar, usedWordsRef.current, dictionary);

    setWords(prev => [
      ...prev,
      { text: trimmed, speaker: 'user' },
      { text: cpuWord, speaker: 'cpu' },
    ]);
    setError(null);
    setConstraint(nextConstraint);
  }, [gameOver, lastChar, constraint]);

  const resetGame = useCallback(() => {
    usedWordsRef.current = new Set([INITIAL_WORD]);
    setWords([{ text: INITIAL_WORD, speaker: 'cpu' }]);
    setGameOver(false);
    setGameResult(null);
    setError(null);
    const firstConstraint = generateConstraint('り', new Set([INITIAL_WORD]), dictionary);
    setConstraint(firstConstraint);
  }, []);

  const giveUp = useCallback(() => {
    if (gameOver) return;
    setGameOver(true);
    setGameResult('lose');
    setError(null);
    setConstraint(null);
  }, [gameOver]);

  return {
    words,
    gameOver,
    gameResult,
    error,
    lastChar,
    turnCount,
    constraint,
    submitWord,
    resetGame,
    giveUp,
  };
}
