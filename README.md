# Delegator Smart Contract

The delegator smart contract is our showcase for executing other smart contracts on-chain.

It consists in total of 3 different smart contract:

- Delegator (root): Delegates calls either to the Adder or Subber smart contract
- Issuer: Increases a value in the Accumulator smart contract
- Subber: Decreases a value in the Accumulator smart contract

In order to test this bundle of smart contracts you need to execute the
following steps.

You can upload the contracts using our [Contracts UI](https://contracts-ui.substrate.io/).

Before anything, make sure you are running a local node.
I prefer swanky node - `swanky node start`.
If you haven't set up swanky CLI, you can run the `./.devcontainer/scripts/swanky-setup.sh` script.

1. Compile all contracts using the `./build-all.sh` script.
   You will receive the respective `.contract` bundles for all the smart contracts in the `target/ink/` folder:
   - `target/ink/delegator.contract`
   - `target/ink/issuer/issuer.contract`
   - `target/ink/staker/staker.contract`
2. Upload the `.contract` bundle of Issuer, Staker to chain and instantiate the Delegator contract by execution `./deploy.sh`
3. Now you are able to run the operations provided by the Delegator smart contract.
   Namely `delegate` to delegate the call to the Issuer contract.

# Caller-test

The `callers` function from delegator will return a Vec with the following addresses:
- account_id() of staker
- caller() of staker
- caller() of issuer
- caller() of delegator

