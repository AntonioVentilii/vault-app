#!/usr/bin/env bash
set -euo pipefail

WASM_FILE="$(jq -re .canisters.directory.wasm dfx.json)"
mkdir -p "$(dirname "$WASM_FILE")"
if test -e "${WASM_FILE}"; then
  echo "Using existing directory Wasm at: '$WASM_FILE'"
else
  ./scripts/download.vault.core.sh
fi
