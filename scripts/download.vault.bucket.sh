#!/bin/bash

source "$(dirname "$0")/download.vault.common.sh"

rm -f "$DIR"/bucket.*

scripts/download-immutable.sh "https://github.com/AntonioVentilii/vault-core/releases/download/$VAULT_CORE_VERSION/bucket.wasm.gz" "$DIR"/bucket.wasm.gz
gunzip -f "$DIR"/bucket.wasm.gz

scripts/download-immutable.sh "https://github.com/AntonioVentilii/vault-core/releases/download/$VAULT_CORE_VERSION/bucket.did" "$DIR"/bucket.did
