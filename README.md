# keyboard-micro-joy

AIの長考時間を有効活用するための軽量キーボードアプリ。  
Bongo Cat がキー入力に反応するオーバーレイモードと、タイピング練習モードの2機能を持つ。

**Web版デモ:** [Vercel にてデプロイ済み](https://github.com/agcelerain-glitch/keyboard-micro-joy)

---

## 機能

### Keyboard Overlay Mode
- キー入力に合わせて Bongo Cat の爪がリアルタイムに動く
- 左右の爪が独立して反応（左キー→右爪、右キー→左爪）
- スペースキーは両爪同時

### Typing Mode
- 2400語以上のランダム出題（プログラミング / TOEIC / TOEFL / Claude Code）
- 文字単位の正解判定。ミスキーは無視して進めない仕様
- Enter でスキップ、単語完了後 300ms で次問題へ
- プログレスバー表示

### 共通
- US / JIS キーボードレイアウト切り替え
- `Ctrl + Alt + M` でモード切り替え
- ダークテーマ固定

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| フロントエンド | React 19 + TypeScript + Vite |
| スタイル | CSS Modules |
| ホスティング | Vercel（GitHub 連携自動デプロイ） |
| デスクトップ（予定） | Tauri v2 |

---

## ローカル開発

```bash
cd front
npm install
npm run dev
# → http://localhost:5173
```

ビルド確認:

```bash
cd front
npm run build
```

---

## デプロイ（Web版）

`main` ブランチへ push すると Vercel が自動デプロイ（約1分）。  
Vercel の Root Directory は `front/` に設定済み。

---

## Tauri デスクトップ版のビルド

> **前提: Rust が必要です。** 未インストールの場合は先にインストールしてください。

### Step 1 — Rust をインストール（手動）

1. https://rustup.rs/ にアクセス
2. `rustup-init.exe` をダウンロード・実行
3. インストール完了後、ターミナルを再起動して確認:

```powershell
rustc --version   # rustc 1.xx.x が表示されればOK
cargo --version
```

> **Windows の場合:** Visual Studio C++ ビルドツールが必要です。  
> Rust インストーラーが自動案内しますが、未導入の場合は  
> [Visual Studio Build Tools 2022](https://visualstudio.microsoft.com/visual-cpp-build-tools/) から  
> 「C++ によるデスクトップ開発」をインストールしてください。

### Step 2 — 依存パッケージのインストール

```bash
cd front
npm install       # @tauri-apps/cli が追加される
```

### Step 3 — アイコン生成（初回のみ）

```bash
cd front
npx tauri icon public/cat.png
# → src-tauri/icons/ に各サイズの PNG / ICO / ICNS が生成される
```

### Step 4 — 開発サーバー起動（Tauri）

```bash
cd front
npm run tauri dev
# 初回は Rust コンパイル（5〜15分）。2回目以降は速い。
```

### Step 5 — リリースビルド

```bash
cd front
npm run tauri build
# → src-tauri/target/release/bundle/ に MSI / EXE が生成される
```

---

## フォルダ構成

```
keyboard_app_01/
├── front/                    # Web アプリ本体
│   ├── src/
│   │   ├── components/       # React コンポーネント
│   │   ├── data/layouts/     # US / JIS キーレイアウト定義
│   │   └── hooks/            # useKeyboard
│   ├── public/data/
│   │   └── questions.txt     # タイピング問題（2400語以上）
│   └── src-tauri/            # Tauri バックエンド（Rust）
│       ├── src/
│       ├── icons/
│       ├── Cargo.toml
│       └── tauri.conf.json
├── docs/
│   └── requirements.md
├── other/                    # .gitignore 対象（参考リポジトリ等）
└── CLAUDE.md
```

---

## questions.txt の追記方法

`front/public/data/questions.txt` に1行1単語で追記。  
`#` で始まる行はコメント。スペースを含む行は無視される。

```
# --- My Words ---
typescript
refactor
/help
SessionStart
```

追記後に push するだけで Vercel に自動反映。

---

## ライセンス

Bongo Cat の画像は [bongo.cat](https://bongo.cat/) (nyan-cat-style, MIT 相当) を参考に使用。
