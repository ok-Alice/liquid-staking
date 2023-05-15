#!/usr/bin/env bash

set -eu

cargo contract build --manifest-path contracts/diamond_caller/Cargo.toml
cargo contract build --manifest-path contracts/staker_facet_v1/Cargo.toml
cargo contract build --manifest-path contracts/issuer_facet_v1/Cargo.toml
cargo contract build
