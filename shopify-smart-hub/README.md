# LOrdEnRYQuE Smart Hub — Shopify Customer Account extension

This directory contains the first real Smart Business vertical slice:

Shopify paid order → Smart entitlement → Shopify Customer Account → Smart Contact Card editor → permanent Smart Link → public contact card → downloadable vCard.

## Shopify extension

Target: `customer-account.page.render`

The merchant adds the full-page extension to New Customer Accounts. The customer stays inside the same Shopify account and authenticates with a short-lived Shopify session token.

The app requests `read_orders` for paid-order fulfillment and `read_customers` so Shopify includes the signed-in Customer GID in the session-token `sub` claim. Protected Customer Data approval remains a deployment gate.

The extension calls the Smart Hub backend with `Authorization: Bearer <session token>`. The backend verifies signature, expiry, audience, and the Shopify Customer GID before returning or mutating customer data.

## Backend

Current production-compatible backend: Convex HTTP actions in `convex/http.ts`.

Required environment variables:

- `SHOPIFY_API_KEY` — Shopify app client ID
- `SHOPIFY_API_SECRET` — Shopify app client secret
- `SHOPIFY_SHOP_DOMAIN` — expected `.myshopify.com` tenant (production: `m11xd1-pq.myshopify.com`)
- `SMART_LINK_SECRET` — separate secret used to derive permanent public codes (recommended)

HTTP endpoints:

- `POST /webhooks/shopify/orders-paid`
- `GET /smart-hub/customer`
- `PATCH /smart-hub/contact`

The webhook must be subscribed to Shopify's `orders/paid` topic.

## Smart Contact Card product mapping

- `LRD-SMART-CONTACT-1` → 1 independent contact-card slot/device
- `LRD-SMART-CONTACT-3` → 3 independent contact-card slots/devices
- `LRD-SMART-CONTACT-5` → 5 independent contact-card slots/devices

Each slot receives its own permanent `publicCode`, profile, and device record.

## Permanent URLs

The application exposes:

- `/go/<publicCode>` — permanent redirect entrypoint for NFC and QR
- `/card/<publicCode>` — public contact-card page
- `/card/<publicCode>/contact.vcf` — downloadable vCard

When `go.lordenryque.de` is mapped to this application, production NFC/QR payloads can use:

`https://go.lordenryque.de/go/<publicCode>`

A later routing cleanup can serve `/<publicCode>` directly on the dedicated subdomain without changing the stored device model.

## Deployment gate

Payments for Smart Business remain OFF until all of the following are verified against the real Shopify app/store:

1. Shopify app is registered and installed.
2. Protected customer-data access is approved if required by Shopify.
3. Customer Account extension is deployed and enabled.
4. Network access capability is approved.
5. `orders/paid` webhook is registered.
6. A test paid order creates the correct number of entitlements/profiles/devices exactly once.
7. The same webhook replay creates no duplicates.
8. The customer can edit the contact profile from Shopify Customer Account.
9. Public Smart Link reflects the edited profile.
10. vCard downloads correctly.
11. QR and an actual NFC tag both resolve to the permanent Smart Link.
12. Build, lint, typecheck, and relevant integration tests are green.


## Implemented beyond the initial customer slice

The current feature branch also includes:

- native Shopify QR rendering in Customer Accounts
- permanent Smart Link analytics for taps and vCard downloads
- customer approval gate before production
- admin production queue under `/admin/smart-business`
- controlled production transitions: `approved → programmed → shipped`
- optional NFC UID capture
- provider-neutral production CSV export
- Shopify privacy/uninstall webhook handling
- batched customer/shop data redaction
- CI verification for the production Next.js + Convex stack

## One required Shopify identity handoff

Shopify manages two identifiers that must not be invented or committed manually:

- app `client_id`
- extension `uid`

Create/link the real app with Shopify CLI from the `shopify-smart-hub` directory:

```bash
npm install
npx shopify app config link
npx shopify app generate extension
```

For the generated extension choose **Customer account UI** and retain the generated `uid`. Then reconcile the generated extension directory with `extensions/customer-account-smart-business` rather than creating a second customer-facing page.

The app should use **custom distribution** for the connected LOrdEnRYQuE store. The current architecture is an extension-only Shopify app whose UI is hosted by Shopify while its network calls use the existing Convex Smart Hub backend.

After linking:

1. copy the real Shopify client ID into `SHOPIFY_API_KEY` in the Convex production environment
2. copy the app client secret into `SHOPIFY_API_SECRET`
3. set `SHOPIFY_SHOP_DOMAIN=m11xd1-pq.myshopify.com`
4. set a strong independent `SMART_LINK_SECRET`
5. set `SMART_LINK_BASE_URL=https://lordenryque.com/go` until the dedicated `go.lordenryque.de` routing is activated
6. configure the Customer Account extension setting `backend_url=https://spotted-tapir-517.eu-west-1.convex.site`
7. deploy the Convex backend before deploying the Shopify app version

Do not enable Smart Business payments merely because the app links successfully. The real paid-order walkthrough remains the final activation gate.
