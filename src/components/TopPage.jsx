import styles from './TopPage.module.css';

const MODES = [
  {
    id: 'normal',
    emoji: '🎯',
    title: '通常モード',
    description: 'CPUとしりとり対決！何ターン続けられるかな？',
    available: true,
  },
  {
    id: 'time-attack',
    emoji: '⏱️',
    title: 'タイムアタック',
    description: '60秒でどれだけ続けられるか挑戦！',
    available: true,
  },
  {
    id: 'constraint',
    emoji: '🔒',
    title: 'しばりモード',
    description: '「語尾がす」「4文字で」など毎ターン縛り付き！',
    available: true,
  },
  {
    id: 'mean',
    emoji: '🐍',
    title: 'いじわるCPU',
    description: 'CPUが「ず」「ぬ」「る」「ぷ」攻めで迫りくる！耐えられるか？',
    available: true,
  },
];

export default function TopPage({ onStartGame, onShowRules }) {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.logo}>しりとり</div>
        <div className={styles.subtitle}>特訓</div>
      </div>

      <div className={styles.modes}>
        <h2 className={styles.sectionTitle}>モードを選ぶ</h2>
        {MODES.map((mode) => (
          <button
            key={mode.id}
            className={`${styles.modeCard} ${!mode.available ? styles.disabled : ''}`}
            onClick={() => mode.available && onStartGame(mode.id)}
            disabled={!mode.available}
          >
            <span className={styles.modeEmoji}>{mode.emoji}</span>
            <div className={styles.modeInfo}>
              <span className={styles.modeTitle}>
                {mode.title}
                {!mode.available && <span className={styles.comingSoon}>Coming Soon</span>}
              </span>
              <span className={styles.modeDesc}>{mode.description}</span>
            </div>
            {mode.available && <span className={styles.arrow}>›</span>}
          </button>
        ))}
      </div>

      <button className={styles.rulesButton} onClick={onShowRules}>
        📖 ルールを見る
      </button>
    </div>
  );
}
