import { useState, useCallback, useRef, useEffect } from 'react';
import { getLastChar, validateInput, findComputerWord } from '../utils/shiritori.js';
import dictionary from '../data/words.json';

const INITIAL_WORD = 'しりとり';
const TIME_LIMIT = 60; // 秒

export function useTimeAttackGame() {
  const [words, setWords] = useState([
    { text: INITIAL_WORD, speaker: 'cpu' },
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [started, setStarted] = useState(false);
  const usedWordsRef = useRef(new Set([INITIAL_WORD]));
  const timerRef = useRef(null);
  const gameOverRef = useRef(false);

  const lastChar = words.length > 0
    ? getLastChar(words[words.length - 1].text)
    : 'り';

  const turnCount = Math.floor(words.filter(w => w.speaker === 'user').length);

  // タイマー
  useEffect(() => {
    if (!started || gameOverRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          gameOverRef.current = true;
          setGameOver(true);
          setGameResult('timeup');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started]);

  const endGame = useCallback((result) => {
    gameOverRef.current = true;
    clearInterval(timerRef.current);
    setGameOver(true);
    setGameResult(result);
  }, []);

  const submitWord = useCallback((input) => {
    if (gameOverRef.current) return;

    // 最初の入力でタイマー開始
    if (!started) {
      setStarted(true);
    }

    const trimmed = input.trim();
    const currentLastChar = words.length > 0
      ? getLastChar(words[words.length - 1].text)
      : 'り';
    const validationError = validateInput(trimmed, currentLastChar, usedWordsRef.current, dictionary);

    if (validationError === 'ん') {
      usedWordsRef.current.add(trimmed);
      setWords(prev => [...prev, { text: trimmed, speaker: 'user' }]);
      endGame('lose');
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    usedWordsRef.current.add(trimmed);
    const userLastChar = getLastChar(trimmed);

    const cpuWord = findComputerWord(userLastChar, usedWordsRef.current, dictionary);

    if (!cpuWord) {
      setWords(prev => [...prev, { text: trimmed, speaker: 'user' }]);
      endGame('win');
      return;
    }

    usedWordsRef.current.add(cpuWord);
    setWords(prev => [
      ...prev,
      { text: trimmed, speaker: 'user' },
      { text: cpuWord, speaker: 'cpu' },
    ]);
    setError(null);
  }, [words, started, endGame]);

  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    gameOverRef.current = false;
    usedWordsRef.current = new Set([INITIAL_WORD]);
    setWords([{ text: INITIAL_WORD, speaker: 'cpu' }]);
    setGameOver(false);
    setGameResult(null);
    setError(null);
    setTimeLeft(TIME_LIMIT);
    setStarted(false);
  }, []);

  return {
    words,
    gameOver,
    gameResult,
    error,
    lastChar,
    turnCount,
    timeLeft,
    timeLimit: TIME_LIMIT,
    started,
    submitWord,
    resetGame,
  };
}
