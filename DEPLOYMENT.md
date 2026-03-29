# Production Deployment Guide

## 1) Prerequisites

- Node.js 20+
- npm 10+
- Convex project configured
- Production environment variables configured (see `.env.production.example`)

## 2) Required Environment Variables

Set these in your hosting provider (not in git):

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Optional integration keys:

- `NEXT_PUBLIC_GA_ID` (GA4 Measurement ID, format `G-XXXXXXXXXX`)
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `RESEND_WEBHOOK_SECRET`
- `SLACK_WEBHOOK_URL`
- `DISCORD_WEBHOOK_URL`

## 3) Local Production Preflight

```bash
npm ci
source .env.local
npm run preflight:prod
```

This runs:

- env validation
- lint + typecheck
- clean production build

## 4) Deploy Convex Backend

```bash
npm run deploy:convex
```

## 5) Deploy Frontend

### Option A: Vercel (recommended for Next.js)

- Import repository in Vercel
- Add env vars from step 2
- Build command: `npm run build`
- Output: default Next.js output

### Option B: Cloudflare Pages (already wired)

```bash
npm run pages:build
npm run pages:deploy
```

## 6) Post-Deploy Validation

- Check homepage, `/services`, `/projects`, `/contact`
- Check admin login flow (`/admin/login`)
- Submit a contact lead and verify Convex write
- Verify `robots.txt` and `sitemap.xml` return 200
- Verify GA4:
  - Ensure `NEXT_PUBLIC_GA_ID` is set in hosting env, or configure GA ID in `/admin/settings`.
  - Accept analytics consent in the cookie banner on the live site.
  - Open GA4 DebugView and confirm `page_view` and custom events appear.
  - Confirm no analytics events fire before consent is granted.

## 7) Rollback Strategy

- Frontend: rollback to previous deployment in host dashboard
- Convex: redeploy previous backend revision if needed
