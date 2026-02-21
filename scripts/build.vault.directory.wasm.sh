#!/usr/bin/env bash
set -euo pipefail

WASM_FILE="$(jq -re .canisters.directory.wasm dfx.json)"

mkdir -p "$(dirname "$WASM_FILE")"

./scripts/download.vault.directory.sh
