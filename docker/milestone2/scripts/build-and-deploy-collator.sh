#!/usr/bin/env bash

# build and deploy the liquid staking Astar Collator

set -e

. /tmp/functions.sh

cd
cd src

TARGET=liquid-staking/artefacts/bin/astar-collator

echo
if [ -f $TARGET ]; then
    echo "$TARGET already exists"
    echo "Not rebuilding, exiting..."
    exit
else
    echo "building $TARGET"
fi

cd Astar
cargo build --package astar-collator --release


mkdir -p $(dirname ../${TARGET})
cp target/release/astar-collator ../${TARGET}

echo "Build complete: $TARGET"
