#!/bin/bash

folder_path=$1

if [ ! -d "$folder_path" ]; then
  mkdir "$folder_path"
  echo "Folder $folder_path created."
else
  echo "Folder $folder_path already exists."
fi

# Create the ~/swanky directory if it doesn't exist
if [ ! -d "~/swanky" ]; then
  mkdir ~/swanky
fi

# Create the ~/swanky/git_creds file if it doesn't exist
if [ ! -f "~/swanky/git_creds" ]; then
  touch ~/swanky/git_creds
fi

echo "user:$(git config user.name)" > ~/swanky/git_creds
echo "email:$(git config user.email)" >> ~/swanky/git_creds
