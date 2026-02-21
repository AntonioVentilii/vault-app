#!/usr/bin/env bash
set -euxo pipefail

ARGS_FILE="$(jq -re .canisters.bucket.init_arg_file dfx.json)"
mkdir -p "$(dirname "$ARGS_FILE")"

mkdir -p target/vault
cat <<EOF >"$ARGS_FILE"
  (
    variant {
      Init = record {
        admins = vec {};
        shared_secret = blob "1234567890";
      }
    },
  )
EOF
