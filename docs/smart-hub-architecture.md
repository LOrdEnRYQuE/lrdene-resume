# LOrdEnRYQuE Smart Hub — Architecture Decisions

Status: accepted for the Smart Business MVP vertical slice.

## ADR-01 — Shopify owns commerce and customer identity

Shopify remains the system for catalog, checkout, orders, customers, and New Customer Accounts.

The Smart Hub does not introduce a second customer username/password. Customer Account UI extensions authenticate requests to the Smart Hub with Shopify session tokens.

## ADR-02 — Smart Hub owns the Smart Business control plane

The Smart Hub owns entitlements, profiles, devices, permanent Smart Links, approvals, operational state, and Smart Business analytics.

For the current production stack, Convex is used instead of adding Supabase/Postgres. The existing LOrdEnRYQuE platform already deploys and operates Convex, so introducing a second database before a demonstrated need would increase operational complexity.

This decision can be revisited if relational/reporting requirements outgrow Convex.

## ADR-03 — NFC and QR encode LOrdEnRYQuE permanent URLs

Physical products never encode a third-party provider URL as their canonical destination.

A device receives a stable LOrdEnRYQuE public code. The code resolves through the LOrdEnRYQuE Smart Link layer, so the underlying customer profile/destination can change without reprinting or reprogramming the physical product.

## ADR-04 — Entitlements originate from verified paid Shopify orders

Smart Business access is created only after a verified Shopify `orders/paid` webhook.

Webhook processing verifies Shopify HMAC against the raw body and uses Shopify's webhook delivery ID plus order/line-item identity for retry safety and idempotency.

Product mapping is SKU-based rather than title-based.

## ADR-05 — NFC production providers are replaceable

The external NFC/print provider is fulfillment infrastructure, not the customer control plane.

Provider-specific identifiers such as NFC UID may be stored on a Smart Device, but provider domains and accounts never become the permanent customer-facing URL.

## ADR-06 — Smart Business payments remain gated

Smart Business payment activation is blocked until the first real vertical slice passes end to end:

paid Shopify order → entitlement → Shopify Customer Account page → edit Smart Contact Card → permanent Smart Link → public profile → vCard → physical QR/NFC test.

A successful code review or mock-only test is not enough to lift this gate.

## First vertical slice — NFC Smart Contact Card

Shopify SKUs:

- `LRD-SMART-CONTACT-1`
- `LRD-SMART-CONTACT-3`
- `LRD-SMART-CONTACT-5`

Each purchased card slot becomes an independent profile/device pair. A 3-card pack therefore supports three distinct people/profiles rather than forcing three identical physical copies.

## Data model

```text
Shopify Customer
└── Smart Workspace
    ├── Entitlements
    ├── Profiles
    │   └── Contact Card
    ├── Devices
    │   └── NFC / QR permanent publicCode
    ├── Events / Analytics
    └── Webhook Receipts
```

Shopify identifiers are retained on entitlements/devices for reconciliation. Smart Hub operational data remains in the Smart Hub data store.
