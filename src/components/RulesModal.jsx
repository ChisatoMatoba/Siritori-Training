import styles from './RulesModal.module.css';

const RULES = [
  {
    icon: '🔤',
    title: 'ひらがなで入力',
    body: '入力できるのはひらがなだけです。漢字やカタカナは使えません。',
  },
  {
    icon: '🔗',
    title: 'しりとりのルール',
    body: '前の単語の最後の文字で始まる単語を答えてください。',
  },
  {
    icon: '🚫',
    title: '「ん」で終わったら負け',
    body: '「ん」で終わる単語を言ったらゲームオーバーです。',
  },
  {
    icon: '🔄',
    title: '同じ単語は使えない',
    body: '一度使った単語はもう使えません。',
  },
  {
    icon: '🔡',
    title: '小さい文字の扱い',
    body: '「ゃ」「ゅ」「ょ」「っ」で終わる場合、大きい文字に変換されます。\n例: おちゃ → 次は「や」から',
  },
  {
    icon: '〰️',
    title: '伸ばし棒（ー）の扱い',
    body: '「ー」で終わる場合、前の文字の母音で続けます。\n例: コーヒー → 前の「ひ」の母音 →「い」から',
  },
  {
    icon: '🎯',
    title: '濁点・半濁点の扱い',
    body: '「が」「ぱ」などの濁点・半濁点はそのまま使います。\n例: かばん → 次は（「ん」なので負け！）\n例: とんぼ → 次は「ぼ」から',
  },
];

export default function RulesModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>📖 ルール</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        <div className={styles.content}>
          {RULES.map((rule, i) => (
            <div key={i} className={styles.rule}>
              <span className={styles.ruleIcon}>{rule.icon}</span>
              <div className={styles.ruleBody}>
                <h3 className={styles.ruleTitle}>{rule.title}</h3>
                <p className={styles.ruleText}>{rule.body}</p>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.okButton} onClick={onClose}>わかった！</button>
      </div>
    </div>
  );
}
