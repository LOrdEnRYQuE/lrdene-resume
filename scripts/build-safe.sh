#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if pgrep -f "next dev" >/dev/null 2>&1; then
  echo "Refusing to run build while 'next dev' is active."
  echo "Run: npm run dev:clean  (or stop dev manually), then run build."
  exit 1
fi

echo "Running clean production build..."
npm run build
