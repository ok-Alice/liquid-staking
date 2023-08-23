#!/usr/bin/env bash

# build and deploy the liquid staking contracts

. /tmp/functions.sh

cd
cd src/liquid-staking

./build_all.sh

cargo contract instantiate --manifest-path=contracts/oracle_validators/Cargo.toml --suri //Alice --skip-confirm -x --url ws://zombienet:9944 --salt 12
