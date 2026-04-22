import styles from './ResultScreen.module.css';

function getMessage(turnCount, result, mode) {
  if (mode === 'time-attack') {
    if (result === 'win') return 'CPUが答えられなくなりました！すごい！🎉';
    if (result === 'lose') return '「ん」で終わっちゃった…💦';
    // timeup
    if (turnCount <= 3) return 'まだまだこれから！💪';
    if (turnCount <= 8) return 'なかなかのペース！👍';
    if (turnCount <= 15) return 'すごい！速い！✨';
    if (turnCount <= 25) return 'お見事！高速しりとり！🌟';
    return 'タイムアタックマスター！！🏆';
  }
  if (result === 'win') {
    return 'CPUが答えられなくなりました！あなたの勝ち！🎉';
  }
  if (turnCount <= 2) return 'まだまだこれから！💪';
  if (turnCount <= 5) return 'なかなかやるね！👍';
  if (turnCount <= 10) return 'すごい！いい調子！✨';
  if (turnCount <= 20) return 'お見事！しりとり上手！🌟';
  return 'しりとりマスター！！🏆';
}

function getTitle(result, mode) {
  if (mode === 'time-attack') {
    if (result === 'win') return '🎉 勝利！';
    if (result === 'lose') return '💀 ゲームオーバー';
    return '⏱️ タイムアップ！';
  }
  return result === 'win' ? '🎉 勝利！' : '終了！';
}

export default function ResultScreen({ turnCount, gameResult, onReset, onBackToTop, mode }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {getTitle(gameResult, mode)}
        </h2>
        <p className={styles.turns}>{turnCount} ターン</p>
        <p className={styles.message}>{getMessage(turnCount, gameResult, mode)}</p>
        <button className={styles.button} onClick={onReset}>
          もう一回
        </button>
        <button className={styles.backButton} onClick={onBackToTop}>
          TOPに戻る
        </button>
      </div>
    </div>
  );
}
