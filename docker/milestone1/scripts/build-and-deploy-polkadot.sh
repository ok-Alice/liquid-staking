#!/usr/bin/env bash

set -e

sleep 5 # slow start to avoid docker mac error


. /tmp/functions.sh

TARGET=~/src/liquid-staking/artefacts/bin/polkadot

echo
if [ -f $TARGET ]; then
    echo "$TARGET already exists"
    echo "Not rebuilding, exiting..."
    exit
else
    echo "building $TARGET"
fi


rustup target add wasm32-unknown-unknown

git clone https://github.com/paritytech/polkadot-sdk.git
cd polkadot-sdk
git checkout v1.1.0-rc2
cd polkadot
./scripts/init.sh
cargo build --package polkadot --release

cd ..

mkdir -p $(dirname ${TARGET})
cp target/release/polkadot* $(dirname ${TARGET})

echo $(dirname ${TARGET})
ls -al  $(dirname ${TARGET})
