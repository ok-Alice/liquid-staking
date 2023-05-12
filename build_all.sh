#!/usr/bin/env bash

set -eu

cargo +stable contract build --manifest-path contracts/staker/Cargo.toml
cargo +stable contract build --manifest-path contracts/issuer/Cargo.toml
cargo +stable contract build
