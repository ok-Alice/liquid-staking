#!/bin/bash

# Fetch the liquid-staking repo from github

. /tmp/functions.sh

cd
mkdir -p src
cd src

action "Fetching okAlice liquid-staking repo" git clone -q https://github.com/ok-Alice/liquid-staking.git

cd liquid-staking/validator-selector
npm install
