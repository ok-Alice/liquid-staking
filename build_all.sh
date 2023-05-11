#!/usr/bin/env bash

set -eu

cargo +stable contract build --manifest-path contracts/staker/Cargo.toml
cargo +stable contract build --manifest-path contracts/accumulator/Cargo.toml
cargo +stable contract build --manifest-path contracts/adder/Cargo.toml
cargo +stable contract build --manifest-path contracts/subber/Cargo.toml
cargo +stable contract build
