#!/usr/bin/env bash
set -euo pipefail

WASM_FILE="$(jq -re .canisters.bucket.wasm dfx.json)"
mkdir -p "$(dirname "$WASM_FILE")"
if test -e "${WASM_FILE}"; then
  echo "Using existing bucket Wasm at: '$WASM_FILE'"
else
  ./scripts/download.vault.core.sh
fi
