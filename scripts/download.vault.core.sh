#!/bin/bash

DIR=target/vault

mkdir -p "$DIR"

VAULT_CORE_VERSION="v0.0.1"

scripts/download-immutable.sh "https://github.com/AntonioVentilii/vault-core/releases/download/$VAULT_CORE_VERSION/bucket.wasm.gz" "$DIR"/bucket.wasm.gz
gunzip -f "$DIR"/bucket.wasm.gz

scripts/download-immutable.sh "https://github.com/AntonioVentilii/vault-core/releases/download/$VAULT_CORE_VERSION/directory.wasm.gz" "$DIR"/directory.wasm.gz
gunzip -f "$DIR"/directory.wasm.gz

scripts/download-immutable.sh "https://github.com/AntonioVentilii/vault-core/releases/download/$VAULT_CORE_VERSION/bucket.did" "$DIR"/bucket.did

scripts/download-immutable.sh  "https://github.com/AntonioVentilii/vault-core/releases/download/$VAULT_CORE_VERSION/directory.did" "$DIR"/directory.did
