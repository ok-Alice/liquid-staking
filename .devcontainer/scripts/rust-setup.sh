#!/bin/bash

# Fix memory leakage from aarm64 mac
echo "[net]" > $CARGO_HOME/config.toml
echo "git-fetch-with-cli = true" >> $CARGO_HOME/config.toml

rustup install stable-x86_64-unknown-linux-gnu

rustup default stable
rustup update
rustup update nightly
rustup component add rust-src
rustup component add rust-src --toolchain nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
rustup default nightly

cargo install cargo-dylint dylint-link
cargo install cargo-contract --force --locked

rustup component add rust-src --toolchain stable-x86_64-unknown-linux-gnu

brew install jq