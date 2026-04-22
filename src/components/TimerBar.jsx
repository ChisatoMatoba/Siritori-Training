import styles from './TimerBar.module.css';

export default function TimerBar({ timeLeft, timeLimit, started }) {
  const ratio = timeLeft / timeLimit;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  if (!started) {
    return (
      <div className={styles.readyContainer}>
        <div className={styles.readyTime}>⏱️ 制限時間 <strong>{timeLimit}秒</strong></div>
        <div className={styles.readyHint}>最初の単語を送信するとカウントダウン開始！</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.barBg}>
        <div
          className={`${styles.barFill} ${isCritical ? styles.critical : isLow ? styles.low : ''}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <div className={`${styles.time} ${isCritical ? styles.criticalText : isLow ? styles.lowText : ''}`}>
        {timeLeft}秒
      </div>
    </div>
  );
}
