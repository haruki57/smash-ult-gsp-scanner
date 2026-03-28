# Vercel → Cloudflare Pages 移行記録

## 背景

Vercel 無料プランの利用制限（デプロイ数上限）に達し、デプロイが不可能になった。
そのため、ホスティング先を **Cloudflare Pages** に移行した。

---

## プロジェクト構成の確認

### 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 15.1.11 (App Router) |
| ランタイム | Node.js |
| デプロイ先 (移行前) | Vercel (無料プラン) |
| デプロイ先 (移行後) | Cloudflare Pages |

### 依存関係とサーバー/クライアント分類

| パッケージ | 使用ファイル | 実行環境 | 備考 |
|---|---|---|---|
| `tesseract.js` | `Ocr.tsx` | クライアントのみ | `'use client'` コンポーネント |
| `image-js` | `processImage.ts` | クライアントのみ | クライアントから呼び出し |
| `html-to-image` | `TierList.tsx` | クライアントのみ | `'use client'` コンポーネント |
| `cheerio` | `api/kumamate/route.ts` | **サーバー** | Edge Runtime で動作 |
| `canvas` (npm) | 未使用 | - | ブラウザ Canvas API とは別物 |

サーバーサイドのコードは `/api/kumamate` ルートのみで、`cheerio` を使って外部サイトをスクレイピングしている。

---

## 移行手順

### 1. `@cloudflare/next-on-pages` のインストール

```bash
npm install -D @cloudflare/next-on-pages wrangler
```

`@cloudflare/next-on-pages` は Next.js App Router のビルド出力を Cloudflare Pages 向けに変換するツール。

### 2. `wrangler.toml` の作成

```toml
name = "nextjs-ocr-gsp"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

- `nodejs_compat`: `cheerio` などの Node.js 互換 API を Edge Runtime で使うために必要
- `pages_build_output_dir`: `@cloudflare/next-on-pages` のビルド出力先

### 3. `next.config.ts` の更新

開発環境で Cloudflare のローカルバインディングを使えるようにする。

```ts
import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
```

またこの時、元のコードに含まれていた不正な `rules` キーを除去した（Next.js の設定として未定義のキー）。

### 4. Edge Runtime の設定

Cloudflare Pages では、すべての動的ルートに Edge Runtime の明示が必要。

**`src/app/page.tsx`**:
```ts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
```

**`src/app/api/kumamate/route.ts`**:
```ts
export const runtime = 'edge';
```

`force-dynamic` は、ページが SSG（静的生成）されないようにするため。
ビルド時に内部 API を呼び出そうとするとサーバーが起動していないためエラーになる。

### 5. Server Component のデータ取得をリファクタ

**移行前の問題**: `page.tsx`（Server Component）が `NEXT_PUBLIC_API_URL + "/api/kumamate"` という HTTP 呼び出しでデータ取得していた。Cloudflare Pages ではこの URL（`http://localhost:3000`）が使えない。

**解決策**: スクレイピングロジックを共有ユーティリティ `src/utils/fetchVipData.ts` に切り出し、`page.tsx` から直接呼び出す構造に変更。

```
移行前:
  page.tsx → HTTP fetch → /api/kumamate → cheerio scrape

移行後:
  page.tsx → fetchVipData() ─┐
  /api/kumamate → fetchVipData() ─┘→ cheerio scrape
```

### 6. `package.json` へのスクリプト追加

```json
{
  "scripts": {
    "build:cf": "npx @cloudflare/next-on-pages",
    "deploy": "npm run build:cf && wrangler pages deploy"
  }
}
```

### 7. Cloudflare Pages プロジェクトの作成とデプロイ

```bash
# プロジェクト作成
wrangler pages project create nextjs-ocr-gsp --production-branch main

# ビルド
npx @cloudflare/next-on-pages

# デプロイ
wrangler pages deploy .vercel/output/static --project-name nextjs-ocr-gsp
```

---

## 発生したエラーと対処

### エラー 1: `next.config.ts` の不正な `rules` キー

```
⚠ Invalid next.config.ts options detected:
⚠     Unrecognized key(s) in object: 'rules'
```

**原因**: ESLint の設定キー `rules` が Next.js の設定として誤って置かれていた。
**対処**: `rules` キーを `next.config.ts` から削除。

---

### エラー 2: プリレンダリング時の JSON パースエラー

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**原因**: `page.tsx` がビルド時に `http://localhost:3000/api/kumamate` を呼び出そうとしたが、
ビルド中はサーバーが起動しておらず、HTML エラーページが返された。
**対処**: `export const dynamic = 'force-dynamic'` を追加してプリレンダリングを無効化。

---

### エラー 3: Edge Runtime 未設定

```
The following routes were not configured to run with the Edge Runtime:
  - /index
```

**原因**: `page.tsx` に `export const runtime = 'edge'` が不足していた。
**対処**: `page.tsx` に `export const runtime = 'edge'` を追加。

---

## 移行後の構成

| 項目 | 内容 |
|------|------|
| デプロイ先 | Cloudflare Pages |
| URL | https://nextjs-ocr-gsp.pages.dev |
| Edge Function Routes | `/` , `/api/kumamate` |
| ビルドコマンド | `npx @cloudflare/next-on-pages` |
| デプロイコマンド | `wrangler pages deploy .vercel/output/static` |

---

## 今後のデプロイ方法

```bash
npm run deploy
```

または手動で:

```bash
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static --project-name nextjs-ocr-gsp
```
