#!/usr/bin/env bash

set -e

# launch offchain scripts

. /tmp/functions.sh

cd
cd src

echo "Waiting for binaries"

TARGET1=liquid-staking/artefacts/bin/astar-collator
TARGET2=liquid-staking/artefacts/bin/polkadot

while [ ! -f $TARGET1 -o ! -f $TARGET2 ]; do
    sleep 5
done

echo
echo "Found:"
echo "   $TARGET1"
echo "   $TARGET2"
echo "... launching zombienet"

ls $(dirname $TARGET1)


cp $TARGET1 ${TARGET2}* ${HOME}/bin

ARCH=$(uname -m)

if [ "$ARCH" = "x86_64" ]; then
    zombienet-linux-x64 -p native spawn /tmp/single_parachain.toml
elif [ "$ARCH" = "aarch64" ]; then
    zombienet-linux-arm64 -p native spawn /tmp/single_parachain.toml
else
    echo "ERROR: Unexpected architecture!"
fi



