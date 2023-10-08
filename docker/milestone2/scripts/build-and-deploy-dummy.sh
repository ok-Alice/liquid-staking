#!/usr/bin/env bash

set -e

ASSET_ID=100
LIQ_ASSET_ID=101



# build and deploy the liquid staking dummy contracts

. /tmp/functions.sh

cd
cd src/liquid-staking

TARGET=artefacts/script/dummy-config.cfg
rm -f $TARGET


CDEST=artefacts/contract
mkdir -p $CDEST



contract=dummy_issuer_staker


CTARGET=${CDEST}/${contract}.json
if [ -f $CTARGET ]; then
    echo "Found $CTARGET, not compiling"

    #copy back to target for 'cargo contract instantiate' further on
    mkdir -p target/ink/${contract}
    cp ${CDEST}/${contract}.json ${CDEST}/${contract}.contract target/ink/${contract}
else
    echo "Compiling contract $contract"
    cargo +nightly --quiet contract build --quiet --manifest-path contracts/${contract}/Cargo.toml --release
    cp -f target/ink/${contract}/${contract}.contract target/ink/${contract}/${contract}.json artefacts/contract
fi

echo
echo "All contracts available: waiting for zombienet:9944 to become available"
while ! nc -w5 zombienet 9944; do
    sleep 5
done
sleep 5
echo "Zombienet:9944 available, deploying contracts..."


CONTRACT_ADDRESS_DUMMY=$(cargo contract instantiate --manifest-path=contracts/${contract}/Cargo.toml --url ws://zombienet:9944 --args 10000000000000 $ASSET_ID $LIQ_ASSET_ID   --suri //Alice  --skip-confirm -x |  grep 'Contract ' | cut -f6 -d\  ) 

if [ -z $CONTRACT_ADDRESS_DUMMY ]; then
    echo "Error getting contract address"
    exit 1
fi

mkdir -p $(dirname $TARGET)
cat > $TARGET <<EOF
ASSET_ID=$ASSET_ID
LIQ_ASSET_ID=$LIQ_ASSET_ID
CONTRACT=$CONTRACT_ADDRESS_DUMMY
EOF
