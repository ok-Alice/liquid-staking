#!/usr/bin/env bash

# launch offchain scripts

. /tmp/functions.sh

cd
cd src

TARGET=liquid-staking/artefacts/bin/astar-collator

while [ ! -f $TARGET ]; do
    sleep 5
done

echo
echo "Found $TARGET, launching zombienet"

cp $TARGET ${HOME}/bin

zombienet-linux-x64 -p native spawn /tmp/single_parachain.toml


