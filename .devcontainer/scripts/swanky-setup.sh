#!/bin/bash

swanky_folder="/opt/swanky"

if [ ! -d "$swanky_folder" ]; then
  sudo mkdir -p "$swanky_folder"
fi


wget -O /tmp/swanky.tar.gz https://github.com/AstarNetwork/swanky-cli/releases/download/v2.1.2/swanky-v2.1.2-25dc2ae-linux-x64.tar.gz && sudo tar -xf /tmp/swanky.tar.gz -C /opt
#wget -O /tmp/swanky.tar.gz https://github.com/AstarNetwork/swanky-cli/releases/download/v2.1.2/swanky-v2.1.2-25dc2ae-darwin-arm64.tar.gz && sudo tar -xf /tmp/swanky.tar.gz -C /opt

link_path="/usr/local/bin/swanky"
swanky_bin_path="/opt/swanky/bin/swanky"

if [ ! -L "$link_path" ]; then
  sudo ln -s "$swanky_bin_path" "$link_path"
fi

if ! npm list -g | grep -q "serve"; then
  echo "serve is not installed globally, installing..."
  sudo npm install -g serve
else
  echo "serve is already installed globally"
fi
