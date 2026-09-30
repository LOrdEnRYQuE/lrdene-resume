# Production Deployment Guide

## 1) Prerequisites

- Node.js 20+
- npm 10+
- Convex project configured
- Production environment variables configured (see `.env.production.example`)
- Cloudflare Pages project connected to this GitHub repository and the `main` branch

## 2) Required Environment Variables

Set these in the production hosting environment (not in git):

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

- environment validation
- lint + typecheck
- clean production build

## 4) Deploy Convex Backend

```bash
npm run deploy:convex
```

## 5) Deploy Frontend to Cloudflare Pages

Cloudflare Pages is the single production frontend target for this repository.

```bash
npm run pages:build
npm run pages:deploy
```

The project currently uses `@cloudflare/next-on-pages`. That adapter creates a generated compatibility bundle which Wrangler then deploys to Cloudflare Pages. Do not remove or rename the adapter's generated-output path unless the deployment stack is intentionally migrated and verified end to end.

Do not connect this repository to a second frontend deployment provider. Keeping one production deployment authority avoids duplicate builds, diverging environment variables, and conflicting domain ownership.

## 6) Post-Deploy Validation

- Check homepage, `/services`, `/projects`, `/contact`
- Check admin login flow (`/admin/login`)
- Submit a contact lead and verify Convex write
- Verify `robots.txt` and `sitemap.xml` return 200
- Verify GA4:
  - Ensure `NEXT_PUBLIC_GA_ID` is set in the Cloudflare environment, or configure GA ID in `/admin/settings`.
  - Accept analytics consent in the cookie banner on the live site.
  - Open GA4 DebugView and confirm `page_view` and custom events appear.
  - Confirm no analytics events fire before consent is granted.

## 7) Rollback Strategy

- Frontend: roll back to the previous known-good Cloudflare Pages deployment.
- Convex: redeploy the previous backend revision if needed.
- After rollback, re-run the post-deploy validation checklist before promoting any new revision.
