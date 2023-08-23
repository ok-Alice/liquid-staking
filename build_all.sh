#!/usr/bin/env bash

set -eu

for contract in $(ls contracts); do
    cargo +nightly-2023-03-21 contract build --manifest-path contracts/${contract}/Cargo.toml --release

    cp -f target/ink/${contract}/${contract}.contract target/ink/${contract}/${contract}.json artefacts
done

