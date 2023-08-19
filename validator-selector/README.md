# Validator Selector for Substrate Chains
The Validator Selector tool is designed for obtaining comprehensive details about validators and eras from specified Substrate chains. This updated version introduces new enhancements in terms of efficient data fetching, data representation, and additional functionalities.

## Features
- Connect to any specified Substrate chain.
- Retrieve information about validators and eras.
- Enhanced data representation for validators.
- Insight into validators' commissions, era points, bonded tokens, and more.
- Exponential Moving Average (EMA) calculation for validator era points.

## Setup
### Pre-requisites:
1. Ensure you have Node.js and npm installed.

### Installation:
1. Install the required dependencies
```npm install```
2. Install the CLI tool globally
```npm install -g .```
3. Build the script
```tsc```

## Usage
### Running the Script
To connect to a specified chain (e.g., Polkadot):

```bash
validator-selector --chain polkadot
```

The script will fetch and display information about validators and eras from the specified chain.

## Debugging in VSCode
### VSCode Debug Configuration (launch.json)
Inside the .vscode folder in your workspace, create a file named launch.json with the following content:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/lib/main.js",
      "outFiles": ["${workspaceFolder}/lib/**/*.js"],
      "args": ["--chain polkadot"],
      "sourceMaps": true
    }
  ]
}
```

### VSCode Tasks Configuration (tasks.json)
Inside the .vscode folder, create a file named tasks.json with the following content:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "typescript",
      "tsconfig": "tsconfig.json",
      "option": "watch",
      "problemMatcher": ["$tsc-watch"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "label": "tsc: watch - tsconfig.json"
    }
  ]
}
```

If you need to debug the tool using Visual Studio Code, follow these steps:

1. Make sure you've added the launch.json and tasks.json files to the .vscode folder in your workspace.
2. Start the TypeScript file watcher task by pressing **Ctrl + Shift + B** or selecting **Run Build Task...** from the Command Palette. This task will continuously compile the TypeScript code into JavaScript upon changes.
3. Make sure to uncomment the line // const chainInfo = config.chains['polkadot']; in the main.ts script to set the chain to Polkadot for the debugging session.
4. Press **F5** or click on the green play button in the Debugging panel to start the debugger. By default, the script will start with the **--chain polkadot** argument.

## In-depth Look
### Main Script (main.ts)
This script is the main entry point of the tool. Upon execution:

- The script uses the command-line argument to determine which chain to connect to.
- It fetches the validator data, enriching it with key details and representing large numerical values as strings for better readability.

### Validators Script (validators.ts)
This script is responsible for all the data-fetching functionalities:

- Connects to the specified chain.
- Fetches and filters validator and era data.
- Calculates the Exponential Moving Average (EMA) of era points for each validator.
- Retrieves bonded token information for each validator.
- Sorting functionalities based on criteria like commission and EMA.

## Configuration
The tool references a config file to determine its configurations. This includes details like maximum commission, maximum validators, maximum eras, and chain-specific details. Adjust this configuration as per your requirements.