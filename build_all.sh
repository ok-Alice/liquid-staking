#!/usr/bin/env bash

set -eu

mkdir -p artefacts/contract

for contract in $(ls contracts); do
    cargo +nightly contract build --manifest-path contracts/${contract}/Cargo.toml --release

    cp -f target/ink/${contract}/${contract}.contract target/ink/${contract}/${contract}.json artefacts/contract
done

