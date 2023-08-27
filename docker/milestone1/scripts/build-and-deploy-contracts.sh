#!/usr/bin/env bash

# build and deploy the liquid staking contracts

. /tmp/functions.sh

cd
cd src/liquid-staking

TARGET=artefacts/script/config.ts
rm -f $TARGET

CDEST=artefacts/contract
mkdir -p $CDEST

for contract in $(ls contracts); do
    echo

    CTARGET=${CDEST}/${contract}.json
    if [ -f $CTARGET ]; then
	echo "Found $CTARGET, not compiling"

	#copy back to target for 'cargo contract instantiate' further on
	mkdir -p target/ink/${contract}
	cp ${CDEST}/${contract}.json ${CDEST}/${contract}.contract target/ink/${contract}
    else
	echo "Compiling contract $contract"
	cargo +nightly-2023-03-21 --quiet contract build --quiet --manifest-path contracts/${contract}/Cargo.toml --release
	cp -f target/ink/${contract}/${contract}.contract target/ink/${contract}/${contract}.json artefacts/contract
    fi
done

echo
echo "All contracts available: waiting for zombienet:9944 to become available"
while ! nc -w5 zombienet 9944; do
    sleep 5
done
sleep 5
echo "Zombienet:9944 available, deploying contracts..."


CONTRACT_ADDRESS_ORACLE=$(cargo contract instantiate --manifest-path=contracts/oracle_validators/Cargo.toml --url ws://zombienet:9944 --suri //Alice  --skip-confirm -x |  grep 'Contract ' | cut -f6 -d\  )
echo 
echo "Oracle deployed at $CONTRACT_ADDRESS_ORACLE"

CONTRACT_ADDRESS_VALIDATORSELECTOR=$(cargo contract instantiate --manifest-path=contracts/validator_selector/Cargo.toml --url ws://zombienet:9944 --suri //Alice  --constructor new --args $CONTRACT_ADDRESS_ORACLE --skip-confirm -x |  grep 'Contract ' | cut -f6 -d\  )
echo
echo "Validator selector deployed at: $CONTRACT_ADDRESS_VALIDATORSELECTOR"


echo
echo "-------------------------------------------"
echo "Deploy complete!"
echo "Oracle_validators contract:   $CONTRACT_ADDRESS_ORACLE"
echo "    + added 150 entries"
echo "Validator_selectors contract: $CONTRACT_ADDRESS_VALIDATORSELECTOR"

# create file for offchain container

mkdir -p $(dirname $TARGET)
cat > $TARGET <<EOF
import { ChainInfo, OracleInfo } from './types';

const config: {
  chains: Record<string, ChainInfo>;
  maxCommission: number;
  maxEras: number;
  maxValidators: number;
  oracle: OracleInfo;
} = {
  chains: {
    polkadot: {
      decimals: 10,
      token: 'DOT',
      websocket: 'wss://rpc.polkadot.io',
    },
    kusama: {
      decimals: 12,
      token: 'KSM',
      websocket: 'wss://kusama-rpc.polkadot.io',
    },
    westend: {
      decimals: 12,
      token: 'WND',
      websocket: 'wss://westend-rpc.polkadot.io',
    },
  },
  maxCommission: 5,
  maxEras: 25,
  maxValidators: 250,
  oracle: {
    websocket: 'ws://zombienet:9944',
    contractAddress: '$CONTRACT_ADDRESS_ORACLE',
    contractAbi: '../../artefacts/contract/oracle_validators.json',
    callerAddress: '//Alice',
  },
};

export default config;
EOF
