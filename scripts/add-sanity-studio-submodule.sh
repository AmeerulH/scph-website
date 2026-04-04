#!/usr/bin/env bash
# Add the SCPH Sanity Studio as a git submodule at sanity-studio/.
# Usage: ./scripts/add-sanity-studio-submodule.sh git@github.com:ORG/scph-sanity-studio.git
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <studio-repository-git-url>"
  echo "Example: $0 git@github.com:AmeerulH/scph-sanity-studio.git"
  exit 1
fi

URL="$1"
NAME="sanity-studio"

if [[ -e "$NAME" ]]; then
  echo "Error: $ROOT/$NAME already exists. Remove it or choose another layout."
  exit 1
fi

if [[ -f .gitmodules ]] && grep -q "path = $NAME" .gitmodules 2>/dev/null; then
  echo "Error: submodule $NAME is already registered in .gitmodules."
  exit 1
fi

git submodule add "$URL" "$NAME"
echo ""
echo "Submodule added at $NAME/. Commit from repo root:"
echo "  git add .gitmodules $NAME"
echo "  git commit -m \"chore: add Sanity Studio as submodule\""
echo ""
echo "See docs/sanity-studio-submodule.md for clone and update workflows."
