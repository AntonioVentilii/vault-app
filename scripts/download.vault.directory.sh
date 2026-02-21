#!/bin/bash

source "$(dirname "$0")/download.vault.common.sh"

rm -f "$DIR"/directory.*

scripts/download-immutable.sh "https://github.com/AntonioVentilii/vault-core/releases/download/$VAULT_CORE_VERSION/directory.wasm.gz" "$DIR"/directory.wasm.gz
gunzip -f "$DIR"/directory.wasm.gz

scripts/download-immutable.sh  "https://github.com/AntonioVentilii/vault-core/releases/download/$VAULT_CORE_VERSION/directory.did" "$DIR"/directory.did
