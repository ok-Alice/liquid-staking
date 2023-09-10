# Introduction

Liquid staking is a process that allows users to stake their DOT tokens and receive a liquid token in return. This
liquid token can be used to trade, lend, borrow, etc. while the underlying DOT tokens are staked and earning staking
rewards.

The project
is [funded](https://github.com/use-inkubator/Ecosystem-Grants/blob/master/applications/OkAlice-Liquid-Staking.md) by
the [ink!ubator Ecosystem Grants](https://github.com/use-inkubator/Ecosystem-Grants) and managed by the OkAlice team.
It consists of a set of smart contracts that will be deployed on the Astar parachain. The smart contracts will be able
to manage a nomination pool on the Polkadot Relay Chain with a custom validator selection strategy. You can find the
scripts for populating the oracle contract with validator statistics in the [scripts](/scripts) folder. The contracts
are in the [contracts](/contracts) folder.

# Vision and Motivation

[Staking on Polkadot](https://wiki.polkadot.network/docs/maintain-guides-how-to-nominate-polkadot) is a great way to
provide security to the chain as well as earn passive income. However, staking has some limitations on number of
nominators it can support. [Nomination Pool](https://wiki.polkadot.network/docs/learn-nomination-pools) was introduced
to solve this problem.

While Nomination pool is a great solution, it has some limitations as well. A delegator chooses a pool initially
based on the reputation of the pool. The delegator then can be passive and trusts the pool operator to keep making the
right nominations based on the initial promise. However, a better solution would be if a pool operator could be a smart
contract so a delegator does not have to trust an individual but can trust the code. This is where our project comes in.

We want to eventually have multiple pools with different strategies enforced by a smart contract and on-chain verifiable
code. This will allow delegators to choose a pool based on the strategy they like. Few strategies we are thinking of

- Mimic the [1kv validator selection](https://wiki.polkadot.network/docs/thousand-validators) strategy.
- A pool that only maximises the highest returns.
- A pool which accumulates slashing insurance protection fund to safeguard against future slashing.
- A pool where validators are chosen via an election based on votes from all its pool members.

A pool controlled by smart contracts also comes with its own set of challenges. Since relay chain does not support
smart contracts natively, we need to deploy these contracts on a parachain. These smart contracts then talk to the
relay chain via [XCM](https://paritytech.github.io/xcm-docs/). This means smart contracts only talk asynchronously to
the pool. Listening to relay chain events and storage changes are also a challenge. We are looking to solve this with an
oracle today but we are also looking at other solutions
like [ISMP Substrate](https://github.com/polytope-labs/ismp-substrate) as well as keeping an eye
on [XCQ](https://forum.polkadot.network/t/xcm-as-a-standard-for-reading-and-interacting-with-parachains/266/19) for
future. There is also an idea of
an [Interchain Proof Oracle Network](https://forum.polkadot.network/t/interchain-proof-oracle-network/653)
from [Bryan Chen](https://github.com/xlc) of Acala Network which would be hugely beneficial for this project and many
others.

# Resources

- [Ink](https://use.ink/) and their [roadmap](https://github.com/orgs/paritytech/projects/27/views/19).
- Substrate [Rust docs](https://paritytech.github.io/substrate/master/substrate/index.html).
- Astar [parachain](https://github.com/AstarNetwork/Astar).
- [Forked Astar Node](https://github.com/ok-Alice/Astar) with Nomination Pool Chain Extension.
- [XCM](https://paritytech.github.io/xcm-docs/).

# Local Development

## Zombienet Setup

Before you do anything, follow the steps to setup a local environment of parachain and relay chain.
You will need this to test the contracts that rely on chain extensions added to
the [Astar](https://github.com/ok-Alice/Astar) node.

1. Download the latest binary from [polkadot](https://github.com/paritytech/polkadot/releases) or clone the repository
   and build it manually using `cargo build --release`
2. Clone the [astar-frame](https://github.com/ok-Alice/astar-frame) repository from okAlice and build the project
   using `cargo build --release`
3. Clone the [Astar](https://github.com/ok-Alice/Astar) repository from okAlice and build the project
   using `cargo build --release`
4. Make sure all paths are pointing to the appropriate binaries in
   the [zombienet configuration file](https://github.com/ok-Alice/Astar/blob/master/third-party/zombienet/single_parachain.toml)
5. In the `Astar` repository, run your relay chain and astar parachain node using the
   command `zombienet -p native spawn ./third-party/zombienet/single_parachain.toml`
6. In [Contracts UI](https://contracts-ui.substrate.io)
   and [PolkadotJs](https://cloudflare-ipfs.com/ipns/dotapps.io/#/explorer) change the `ws` port to the one shown in
   the `zombienet` output. You should copy the port from the `collator1` node which is normally shown at the end of the
   output.

## Building & Deploying Contracts

Now you can build and deploy the necessary contracts for liquid staking.

1. Compile all contracts using the `./build-all.sh` script.
   You will receive the respective `.contract` bundles for all the smart contracts in the `target/ink/` folder:
    - `target/ink/issuer_staker/issuer_staker.contract`
    - `target/ink/issuer_staker/oracle-validators.contract`
    - `target/ink/issuer_staker/validator_selector.contract`
2. Upload the `.contract` bundles to the chain and instantiate
