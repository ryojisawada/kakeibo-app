# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

レシート画像をアップロードすると Claude API(Haiku)が内容を読み取り、商品名・金額・日付を
自動でカテゴリ分類して集計する家計簿 Web アプリ。データは登録した端末の localStorage に
保存され、リロードしても消えない。

## Architecture

- `server/` — Node.js (Express) バックエンド。Claude API を呼び出すのはこのサーバーのみで、
  ブラウザから直接 API キーを使うことはない。
  - `src/index.js` — Express アプリのエントリーポイント。
  - `src/routes/receipts.js` — `POST /api/receipts/analyze` (multipart画像アップロード受付)。
  - `src/services/claudeService.js` — Claude API 呼び出し・構造化出力(JSON Schema)によるレシート解析。
- `client/` — React (Vite) フロントエンド。
  - `src/hooks/useReceipts.js` — 明細データの localStorage 永続化。
  - `src/api/receiptApi.js` — バックエンドの解析エンドポイント呼び出し。
  - `src/components/` — アップロードUI・明細一覧・カテゴリ別円グラフ・月別棒グラフ(Chart.js)。
  - `src/utils/categories.js` — カテゴリと表示色の対応(`server/src/services/claudeService.js` の
    `CATEGORIES` と一致させること)。
  - Vite の dev サーバーは `/api` を `http://localhost:3001` にプロキシする(`vite.config.js`)。

## Development commands

```sh
# バックエンド(初回は server/.env.example を server/.env にコピーし ANTHROPIC_API_KEY を設定)
cd server && npm install && npm run dev

# フロントエンド(別ターミナル)
cd client && npm install && npm run dev
```

- クライアント: http://localhost:5173
- サーバー: http://localhost:3001 (ヘルスチェック: `GET /api/health`)

## Conventions

- コードのコメントは日本語で記載する。
- Claude API のモデルは Haiku の最新版(`claude-haiku-4-5`)を使用する。モデルIDは
  `server/src/services/claudeService.js` の `MODEL` 定数で管理する。
- APIキーは `server/.env` で管理し、`.gitignore` で除外している。絶対にコミットしないこと。

## Git operation rules

- This project must always be under git version control and linked to a GitHub
  remote repository.
- **Every time code is changed, commit the change and push it to GitHub.** Do not
  leave changes only committed locally — push after each commit unless the user
  explicitly says not to.
- Use clear, descriptive commit messages that explain why the change was made.
- Do not use destructive git operations (`push --force`, `reset --hard`, etc.)
  without explicit user confirmation.
