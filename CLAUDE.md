# CLAUDE.md — キーボードアプリ プロジェクト文脈

このファイルはClaude Code がプロジェクトを理解するための文脈情報です。

## プロジェクト概要

AIの長考時間を有効活用するための、単機能・軽量Webアプリ。
詳細な仕様は `docs/requirements.md` を参照。

## フォルダ構成

```
keyboard_app_01/
├── front/          # Webアプリ本体（Vite + React + TypeScript）
├── docs/
│   └── requirements.md   # 要件定義書（仕様の正とすべきファイル）
├── other/          # .gitignore対象。claudelog.md・参考リポジトリ等を格納
│   ├── claudelog.md              # 設計・会話ログ
│   ├── BongoCat-master/          # Tauri + Vue3版 Bongo Cat（参考）
│   ├── bongo.cat-master/         # オリジナルWeb版 Bongo Cat（参考）
│   ├── MonkeyType-main/          # MonkeyType（タイピングモード参考）
│   └── monkeytype-bot-master/
└── CLAUDE.md       # このファイル
```

## 技術スタック

- **フレームワーク:** React + TypeScript
- **ビルドツール:** Vite
- **ホスティング:** Vercel（GitHub連携）
- **将来:** Tauri によるデスクトップアプリ化

## 開発方針

- `other/` 配下の参考リポジトリは**変更しない**。`front/` のみを触る。
- 参考コードをかいつまんでコピーし、自作実装に落とし込む方針。
- `other/` は `.gitignore` に含めること（プッシュしない）。
- シンプル・軽量最優先。複雑なCSSアニメーション・多機能化は避ける。

## キーボードアニメーションの実装方針

- CSS クラス切り替えによる画像スワップ方式（canvas 不使用）
- 参考: `other/bongo.cat-master` の `background-position-x` 方式をシンプル化
- 左腕/右腕の切り替えが大本命。堅牢さとサクサク感を最優先。

## キーレイアウト設計

- 問題文字列（文字データ）とキーレイアウト（物理キー位置）は疎結合に保つ
- `src/data/layouts/types.ts` に共通型定義
- `src/data/layouts/us.ts` / `src/data/layouts/jis.ts` でレイアウトを定義

## ショートカット

- `Ctrl + Alt + M`: モード切り替え（キーボード反応モード ↔ タイピングモード）

## MVPの制約（既知の仕様）

- ブラウザタブがフォーカスされている時のみキーイベントを取得（バックグラウンド反応なし）
- ウィンドウサイズはユーザーが手動調整。固定ボックスとViewportインジケーターで補助。
- これらはTauri化で解消予定。MVP は開発者動作確認用デモとして割り切る。
