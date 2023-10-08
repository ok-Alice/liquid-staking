#!/usr/bin/env bash

# launch offchain scripts

. /tmp/functions.sh

# we might be here first, sleep to avoid launching on old file
sleep 10

cd
cd src/liquid-staking/ 

TARGET=artefacts/script/dummy-config.cfg

# waiting for deploy container to drop the file
while [ ! -f $TARGET ]; do
    sleep 5
done

echo
echo "Found $TARGET"

. $TARGET

polkadot-js-api --ws ws://zombienet:9944 tx.assets.create $ASSET_ID ajYMsCKsEAhEvHpeA4XqsfiA9v1CdzZPrCfS6pEfeGHW9j8 100 --seed "//Alice" 
polkadot-js-api --ws ws://zombienet:9944 tx.assets.setMetadata $ASSET_ID Token TOK 18   --seed "//Alice" 
polkadot-js-api --ws ws://zombienet:9944 tx.assets.mint $ASSET_ID ajYMsCKsEAhEvHpeA4XqsfiA9v1CdzZPrCfS6pEfeGHW9j8 100000000000 --seed "//Alice" 
polkadot-js-api --ws ws://zombienet:9944 tx.assets.approveTransfer $ASSET_ID $CONTRACT 10000000000000 --seed "//Alice"

polkadot-js-api --ws ws://zombienet:9944 tx.assets.create $LIQ_ASSET_ID ajYMsCKsEAhEvHpeA4XqsfiA9v1CdzZPrCfS6pEfeGHW9j8 100 --seed "//Alice" 
polkadot-js-api --ws ws://zombienet:9944 tx.assets.setMetadata $LIQ_ASSET_ID LiquidToken lTOK 18  --seed "//Alice"
polkadot-js-api --ws ws://zombienet:9944 tx.assets.mint $LIQ_ASSET_ID ajYMsCKsEAhEvHpeA4XqsfiA9v1CdzZPrCfS6pEfeGHW9j8 100000000000 --seed "//Alice" 
polkadot-js-api --ws ws://zombienet:9944 tx.assets.approveTransfer $LIQ_ASSET_ID $CONTRACT 10000000000000 --seed "//Alice"


echo "Dummy contract deployed at: $CONTRACT"
echo 
echo "Assets created:"
echo "  - TOK  $ASSET_ID"
echo "  - lTOK $LIQ_ASSET_ID"
