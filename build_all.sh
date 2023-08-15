#!/usr/bin/env bash

set -eu

for contract in oracle_validators issuer_staker validator_selector; do
    cargo +nightly-2023-02-07 contract build --manifest-path contracts/${contract}/Cargo.toml --release

    cp -f target/ink/${contract}/${contract}.{contract,json} artefacts
done

