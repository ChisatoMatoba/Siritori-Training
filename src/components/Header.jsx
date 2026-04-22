import styles from './Header.module.css';

export default function Header({ onBack, onShowRules, hideTitle }) {
  return (
    <>
    <header className={styles.header}>
      {onBack ? (
        <button className={styles.backButton} onClick={onBack}>
          ‹ 戻る
        </button>
      ) : (
        <div className={styles.spacer} />
      )}
      {!hideTitle && <h1 className={styles.title}>🌈 しりとり特訓 🌈</h1>}
      {onShowRules ? (
        <button className={styles.rulesButton} onClick={onShowRules}>
          ?
        </button>
      ) : (
        <div className={styles.spacer} />
      )}
    </header>
    </>
  );
}
