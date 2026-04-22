import styles from './WordBubble.module.css';

export default function WordBubble({ text, speaker }) {
  const isUser = speaker === 'user';
  return (
    <div className={`${styles.row} ${isUser ? styles.userRow : styles.cpuRow}`}>
      <div className={styles.label}>{isUser ? 'あなた' : 'CPU'}</div>
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.cpuBubble}`}>
        <span className={styles.text}>{text}</span>
        <span className={styles.lastChar}>→ 「{text[text.length - 1]}」</span>
      </div>
    </div>
  );
}
