# ADR 2. Validator selector

Date: 2023-06-22

## Status

Accepted

## Context

The Ok Alice Liquid Staking project will run a [nomination pool](ttps://wiki.polkadot.network/docs/learn-nomination-pools). There are two options for nomination validators.

1. Create a [nominator](https://wiki.polkadot.network/docs/learn-nominator) account which will be controlled by the Ok Alice team to perfrom manual operations such as nominating validators.

2. A WASM Ink! smart-contract that will automatically nominate validators based on a **selection strategy**.

## Decision

We chose the latter. A WASM Ink! smart-contract will be called [`validator_selector`](../../contracts/validator_selector/) which will act on behalf of the nominator account in the nomination pool.

The validator selector will require validator KPIs/statistics from the Polkadot relay chain in order to choose a proper validator.

Based on the KPIs outlined below, the contract will evaluate them according to the following **selection strategy**:

1. Every KPI will have a valid statistical range. Validators with KPIs outside this range are not included in the list sent to the oracle (e.g. The percentage volume of DOT invested by the validator must be a minimum of 25%.).

2. The validator selector will scale each KPI of each validator and assign points to determine which validator to nominate. This will enable additional flexibility to add, remove or modify KPIs and point scaling.

3. The validator selector will nominator the top scoring 16 validators based on the point system.

### Validator KPIs

This is not an exhaustive list at this moment and is subject to change over time, but this is the base line for the nomination strategy.

Reputation of node:

- Era points
- Uptime: percentage of number of eras a validator was a candidate

Node configuration & status:

- Commission rate
- Validation volume
- Number of nominators
- Minimum staking amount (Oversubscribed)
- Verified account

## Consequences

This implementation will require an off-chain script that will automatically query and push validator statistics to an oracle contract which will then be queried by the validator selector.
