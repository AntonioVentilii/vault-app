#!/usr/bin/env bash
set -euxo pipefail

ARGS_FILE="$(jq -re .canisters.directory.init_arg_file dfx.json)"
mkdir -p "$(dirname "$ARGS_FILE")"

mkdir -p target/vault
cat <<EOF >"$ARGS_FILE"
  (
    variant {
      Init = record {
        rate_per_gb_per_month = 100_000 : nat64;
        admins = vec {};
        shared_secret = blob "1234567890";
      }
    },
  )
EOF
