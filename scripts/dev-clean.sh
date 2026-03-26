#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if pgrep -f "next dev" >/dev/null 2>&1; then
  echo "Stopping running Next.js dev server..."
  pkill -f "next dev" || true
  sleep 1
fi

if [ -d ".next" ]; then
  backup=".next_mixed_$(date +%s)"
  echo "Archiving existing .next to $backup"
  mv .next "$backup"
fi

if [ -d "node_modules/.cache/webpack" ]; then
  echo "Removing stale webpack cache"
  rm -rf node_modules/.cache/webpack
fi

for cache_dir in .next_cache_*; do
  if [ -d "$cache_dir" ]; then
    cache_backup="${cache_dir}_bak_$(date +%s)"
    echo "Archiving $cache_dir to $cache_backup"
    mv "$cache_dir" "$cache_backup"
  fi
done

# Keep recent backups only (prevents unbounded disk growth).
shopt -s nullglob
backups=(.next_mixed_* .next_broken_* .next_cache_*_bak_*)
shopt -u nullglob

if [ ${#backups[@]} -gt 0 ]; then
  ls -dt "${backups[@]}" 2>/dev/null | tail -n +8 | while read -r old; do
    echo "Removing old backup $old"
    rm -rf "$old"
  done
fi

echo "Starting clean Next.js dev server..."
exec npm run dev
