#!/usr/bin/env bash

set -eu

#cargo +nightly contract build --manifest-path contracts/diamond_caller/Cargo.toml
cargo +nightly contract build --manifest-path contracts/staker_facet_v1/Cargo.toml
#cargo +nightly contract build --manifest-path contracts/issuer_facet_v1/Cargo.toml
#cargo +nightly contract build
