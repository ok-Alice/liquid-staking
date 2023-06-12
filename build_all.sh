#!/usr/bin/env bash

set -eu

cargo +nightly-2023-02-07 contract build --manifest-path contracts/issuer_staker/Cargo.toml
cargo +nightly-2023-02-07 contract build --manifest-path contracts/oracle-validators/Cargo.toml
cargo +nightly-2023-02-07 contract build --manifest-path contracts/validator_selector_standard/Cargo.toml