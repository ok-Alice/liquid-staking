#!/usr/bin/env bash

# launch offchain scripts

. /tmp/functions.sh

# we might be here first, sleep to avoid launching on old file
sleep 20


cd
cd src/liquid-staking/ 

TARGET=artefacts/script/config.ts

# waiting for deploy container to drop the file
while [ ! -f $TARGET ]; do
    sleep 5
done

echo
echo "Found artefacts/config.ts"

cp $TARGET validator-selector/src

npx ts-node validator-selector/src/main.ts
