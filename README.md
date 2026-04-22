# 🎯 しりとり特訓

日本語のしりとりを CPU 対戦で特訓できる Web アプリです。

**[▶ プレイする](https://chisatomatoba.github.io/Siritori-Training/)**

## 特徴

- CPU とターン制でしりとり対戦
- JMdict 由来の **15 万語超**の辞書を搭載（名詞・固有名詞）
- **4 つのゲームモード**
  - 🎯 **ノーマル** — 基本のしりとり対戦
  - ⏱️ **タイムアタック** — 60 秒でどれだけ続けられるか挑戦
  - 🔒 **しばりモード** — 「語尾が す」「4 文字で」など毎ターン制約付き
  - 🐍 **いじわる CPU** — CPU が「ず」「ぬ」「る」「ぷ」攻めで迫りくる
- ひらがな入力のみ対応
- 小文字かな（ゃゅょっ等）・長音符（ー）の自動変換
- ターン数に応じた結果メッセージ
- PC・スマホ対応のレスポンシブデザイン
- サーバー不要 — GitHub Pages で静的ホスティング

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | React 19 |
| ビルドツール | Vite 5 |
| テスト | Vitest |
| デプロイ | GitHub Pages (gh-pages) |
| 辞書データ | JMdict (EDRDG) |

## セットアップ

```bash
git clone https://github.com/ChisatoMatoba/Siritori-Training.git
cd Siritori-Training
npm install
npm run dev
```

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run preview` | ビルドのプレビュー |
| `npm test` | テスト実行 |
| `npm run test:watch` | テスト（ウォッチモード） |
| `npm run deploy` | GitHub Pages にデプロイ |

## 辞書データの再生成

辞書は [JMdict](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project) から自動抽出しています。更新する場合：

```bash
curl -o scripts/JMdict_e.gz https://www.edrdg.org/pub/Nihongo/JMdict_e.gz
gunzip -k scripts/JMdict_e.gz
node scripts/build-dictionary.js
```

## プロジェクト構造

```
src/
├── components/       # UIコンポーネント
│   ├── GameBoard     # ゲーム画面（入力欄・チャットUI）
│   ├── Header        # ヘッダー
│   ├── ResultScreen  # 結果画面
│   ├── RulesModal    # ルール説明モーダル
│   ├── TimerBar      # タイムアタック用タイマーバー
│   ├── TopPage       # モード選択トップ画面
│   └── WordBubble    # 吹き出し
├── data/
│   └── words.json    # しりとり辞書（JMdict由来）
├── hooks/
│   ├── useShiritoriGame.js      # ノーマル／いじわるCPU用
│   ├── useTimeAttackGame.js     # タイムアタック用
│   └── useConstraintGame.js     # しばりモード用
├── utils/
│   └── shiritori.js  # しりとりコアロジック
├── App.jsx
└── main.jsx
scripts/
└── build-dictionary.js  # JMdict→辞書JSON変換スクリプト
```

## ライセンス

ソースコードは [MIT License](LICENSE) で公開しています。

辞書データ (`src/data/words.json`) は [JMdict](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project) から抽出したもので、[Electronic Dictionary Research and Development Group (EDRDG)](https://www.edrdg.org/) により [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) で提供されています。
