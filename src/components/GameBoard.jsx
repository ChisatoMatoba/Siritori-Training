import { useState, useRef, useEffect } from 'react';
import WordBubble from './WordBubble.jsx';
import styles from './GameBoard.module.css';

export default function GameBoard({ words, lastChar, error, gameOver, onSubmit, onGiveUp }) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [words]);

  useEffect(() => {
    if (!gameOver) {
      inputRef.current?.focus();
    }
  }, [words, gameOver]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput('');
  };

  return (
    <div className={styles.board}>
      <div className={styles.chat}>
        <div className={styles.hint}>
          「{lastChar}」から始まる単語を入力してね！
        </div>
        {words.map((w, i) => (
          <WordBubble key={i} text={w.text} speaker={w.speaker} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {!gameOver && (
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`「${lastChar}」から始まる単語…`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button className={styles.sendButton} type="submit">送信</button>
          </div>
          <button
            className={styles.giveUpButton}
            type="button"
            onClick={onGiveUp}
          >
            🏳️ 参りました
          </button>
        </form>
      )}
    </div>
  );
}
