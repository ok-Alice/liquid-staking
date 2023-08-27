#!/bin/bash

# Install zombienet and dependencies in homedir of executing user

. /tmp/functions.sh

# create bin dir 
cd
mkdir -p bin
cd bin

# Download binaries

action "Downloading Zombienet v1.3.65" curl --silent --location --remote-name https://github.com/paritytech/zombienet/releases/download/v1.3.65/zombienet-linux-x64
action "Downloading Polkadot v1.0.0" curl --silent --location --remote-name https://github.com/paritytech/polkadot/releases/download/v1.0.0/polkadot


# We will be building collator ourselfs... no need to fetch it 
#cd /tmp
#action "Downloading Astar v5.17.0" curl --silent --location --remote-name https://github.com/AstarNetwork/Astar/releases/download/v5.17.0/astar-collator-v5.17.0-ubuntu-x86_64.tar.gz && tar xzf /tmp/astar-collator-v5.17.0-ubuntu-x86_64.tar.gz -C ${HOME}/bin

cd ${HOME}/bin
chmod +x *




