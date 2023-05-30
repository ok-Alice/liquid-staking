# Liquid Staking

The liquid staking project is mostly comprised of smart contracts. At this current time, there is only the `issuer-staker` contract that contains the implementation for issuing liquid tokens based on the users staked Dot and performing operations on our nomination pool through the nomination-pool pallet manually implemented in the Astar node (these methods are exposed through chain extensions). 

The nomination-pool pallet will execute an XCM transaction to the Polkadot relay chain to stake, unstake, nominate, etc.

## Local Development

### Zombienet Setup

Before you do anything, follow the steps to setup a local environment of parachain and relay chain. 
You will need this to test the contracts that rely on chain extensions added to the [Astar](https://github.com/ok-Alice/Astar) node.

1. Download the latest binary from [polkadot](https://github.com/paritytech/polkadot/releases) or clone the repository and build it manually using `cargo build --release`
2. Clone the [astar-frame](https://github.com/ok-Alice/astar-frame) repository from okAlice and build the project using `cargo build --release`
3. Clone the [Astar](https://github.com/ok-Alice/Astar) repository from okAlice and build the project using `cargo build --release`
4. Make sure all paths are pointing to the appropriate binaries in the [zombienet configuration file](https://github.com/ok-Alice/Astar/blob/master/third-party/zombienet/single_parachain.toml)
5. In the `Astar` repository, run your relay chain and astar parachain node using the command `zombienet -p native spawn ./third-party/zombienet/single_parachain.toml`
6. In [Contracts UI](https://contracts-ui.substrate.io) and [PolkadotJs](https://cloudflare-ipfs.com/ipns/dotapps.io/#/explorer) change the `ws` port to the one shown in the `zombienet` output. You should copy the port from the `collator1` node which is normally shown at the end of the output.

### Building & Deploying Contracts

Now you can build and deploy the necessary contracts for liquid staking.

1. Compile all contracts using the `./build-all.sh` script.
   You will receive the respective `.contract` bundles for all the smart contracts in the `target/ink/` folder:
   - `target/ink/issuer_staker/issuer_staker.contract`
2. Upload the `.contract` bundles to the chain and instantiate 
