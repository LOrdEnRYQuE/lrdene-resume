# LOrdEnRYQuE Portfolio

Next.js + Convex production portfolio platform with multilingual pages, admin panel, inbox, and SEO surfaces.

## Getting Started

Install dependencies and run the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Production Deployment

See the full guide in [DEPLOYMENT.md](./DEPLOYMENT.md).

Production frontend target: **Cloudflare Pages only**.

```bash
npm run preflight:prod
npm run deploy:convex
npm run pages:build
npm run pages:deploy
```

The Cloudflare Pages adapter generates an internal compatibility bundle consumed by Wrangler. Keep the configured generated-output path unchanged until a verified migration to the newer Cloudflare Workers deployment path is completed.

Use `.env.production.example` as the variable checklist.
