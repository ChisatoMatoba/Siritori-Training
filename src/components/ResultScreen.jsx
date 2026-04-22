import styles from './ResultScreen.module.css';

function getMessage(turnCount, result) {
  if (result === 'win') {
    return 'CPUが答えられなくなりました！あなたの勝ち！🎉';
  }
  if (turnCount <= 2) return 'まだまだこれから！💪';
  if (turnCount <= 5) return 'なかなかやるね！👍';
  if (turnCount <= 10) return 'すごい！いい調子！✨';
  if (turnCount <= 20) return 'お見事！しりとり上手！🌟';
  return 'しりとりマスター！！🏆';
}

export default function ResultScreen({ turnCount, gameResult, onReset }) {
  const isWin = gameResult === 'win';
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isWin ? '🎉 勝利！' : '終了！'}
        </h2>
        <p className={styles.turns}>{turnCount} ターン</p>
        <p className={styles.message}>{getMessage(turnCount, gameResult)}</p>
        <button className={styles.button} onClick={onReset}>
          もう一回
        </button>
      </div>
    </div>
  );
}
