#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

required_env=(
  "NEXT_PUBLIC_CONVEX_URL"
  "CONVEX_DEPLOYMENT"
)

admin_env=(
  "ADMIN_USERNAME"
  "ADMIN_PASSWORD"
  "ADMIN_SESSION_SECRET"
)

optional_env=(
  "NEXT_PUBLIC_GA_ID"
  "OPENAI_API_KEY"
  "RESEND_API_KEY"
  "EMAIL_FROM"
  "RESEND_WEBHOOK_SECRET"
  "SLACK_WEBHOOK_URL"
  "DISCORD_WEBHOOK_URL"
)

missing=()
for key in "${required_env[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    missing+=("$key")
  fi
done

for key in "${admin_env[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    missing+=("$key")
  fi
done

if (( ${#missing[@]} > 0 )); then
  echo "Missing required production environment variables:"
  for key in "${missing[@]}"; do
    echo "  - $key"
  done
  echo
  echo "Create a production env file in your hosting provider, then rerun preflight."
  exit 1
fi

echo "Required environment variables: OK"

echo "Checking optional integrations..."
for key in "${optional_env[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "  - $key: not set (optional)"
  else
    echo "  - $key: set"
  fi
done

echo
echo "Running quality gate (lint + typecheck)..."
npm run check

echo
echo "Running clean production build..."
npm run build:safe

echo
echo "Production preflight completed successfully."
