#!/bin/bash

# Install ink dependencies 

. /tmp/functions.sh

rustup update nightly

rustup component add rust-src
rustup component add rust-src --toolchain nightly

cargo install --force --locked cargo-contract





