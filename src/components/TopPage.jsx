import styles from './TopPage.module.css';

const MODES = [
  {
    id: 'normal',
    emoji: '🎯',
    title: '通常モード',
    description: 'CPUとしりとり対決！何ターン続けられるかな？',
    available: true,
    colors: ['#e04040', '#f08030'],
  },
  {
    id: 'time-attack',
    emoji: '⏱️',
    title: 'タイムアタック',
    description: '60秒でどれだけ続けられるか挑戦！',
    available: true,
    colors: ['#f0d020', '#40b060'],
  },
  {
    id: 'constraint',
    emoji: '🔒',
    title: 'しばりモード',
    description: '「語尾がす」「4文字で」など毎ターン縛り付き！',
    available: true,
    colors: ['#3080e0', '#8050d0'],
  },
  {
    id: 'mean',
    emoji: '🐍',
    title: 'いじわるCPU',
    description: 'CPUが「ず」「ぬ」「る」「ぷ」攻めで迫りくる！耐えられるか？',
    available: true,
    colors: ['#8050d0', '#e04090'],
  },
];

export default function TopPage({ onStartGame, onShowRules }) {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.logo}>しりとり</div>
        <div className={styles.subtitle}>特訓</div>
        <div className={styles.dots}>
          <span style={{ background: '#e04040' }} />
          <span style={{ background: '#f08030' }} />
          <span style={{ background: '#f0d020' }} />
          <span style={{ background: '#40b060' }} />
          <span style={{ background: '#3080e0' }} />
          <span style={{ background: '#8050d0' }} />
          <span style={{ background: '#e04090' }} />
        </div>
      </div>

      <div className={styles.modes}>
        <h2 className={styles.sectionTitle}>モードを選ぶ</h2>
        {MODES.map((mode) => (
          <button
            key={mode.id}
            className={`${styles.modeCard} ${!mode.available ? styles.disabled : ''}`}
            style={{ '--c1': mode.colors[0], '--c2': mode.colors[1] }}
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
