import styles from './TimerBar.module.css';

export default function TimerBar({ timeLeft, timeLimit, started }) {
  const ratio = timeLeft / timeLimit;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className={styles.container}>
      <div className={styles.barBg}>
        <div
          className={`${styles.barFill} ${isCritical ? styles.critical : isLow ? styles.low : ''}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <div className={`${styles.time} ${isCritical ? styles.criticalText : isLow ? styles.lowText : ''}`}>
        {!started ? '最初の単語を入力でスタート！' : `${timeLeft}秒`}
      </div>
    </div>
  );
}
