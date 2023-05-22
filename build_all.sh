#!/usr/bin/env bash

set -eu

cargo +nightly-2023-02-07 contract build --manifest-path contracts/issuer_staker/Cargo.toml
