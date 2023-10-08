#!/bin/bash

# Fetch the liquid-staking repo from github

. /tmp/functions.sh

cd
mkdir -p src
cd src

action "Fetching okAlice liquid-staking repo" git clone -q https://github.com/ok-Alice/liquid-staking.git
action "Fetching okAlice Astar repo" git clone -q --branch liquid-staking https://github.com/ok-Alice/Astar.git
