#!/bin/bash

dfx deploy

dfx canister call directory provision_bucket "(principal \"$(dfx canister id bucket)\")"
