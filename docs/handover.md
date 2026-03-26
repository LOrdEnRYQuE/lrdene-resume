# Portfolio OS: Architecture & Handover Guide

## 1. System Overview
Portfolio OS is a high-performance, agentic digital command center designed for modern creatives and developers. It provides a seamless transition from lead capture to client collaboration.

## 2. Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Framer Motion.
- **Styling**: Tailwind CSS 4, CSS Modules for component isolated logic.
- **Backend**: Convex (Real-time DB, Edge Functions, Schema validation).
- **Authentication**: Clerk (Admin & Client Portal sessions).
- **Deployment**: Cloudflare Pages (Edge Runtime).

## 3. Core Modules
### A. Agentic CMS
- **Visual Block Editor**: Allows drag-and-drop orchestration of site sections.
- **Neural Analytics Integration**: Every page is automatically tracked for events and conversions.

### B. AI Content Strategist
- AI-powered suggestions for headlines, copy, and CTAs.
- Automated SEO metadata generation (Alt-text, Meta descriptions).

### C. Neural Analytics
- **Conversion Tracking**: Tracks lead origin, value, and pipeline status.
- **Funnel Visualization**: Real-time insights into user drop-off.

### D. Client Portals
- Secure environments for project management, file sharing, and billing.

## 4. Operation & Maintenance
### Adding Features
1. Update `convex/schema.ts` for new data models.
2. Implement mutations/queries in `convex/`.
3. Create UI components in `src/components/`.

### AI Configuration
Add your `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` to `.env.local` to enable real-time content generation. The system will automatically switch from mock to live mode.

## 5. Deployment
The project is optimized for Cloudflare Pages.
`npm run build` generates a performant edge-compatible bundle.

---
*Developed by Antigravity AI*
