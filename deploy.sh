set -x

cargo contract instantiate --manifest-path=contracts/issuer_staker/Cargo.toml -x --suri //Alice
cargo contract instantiate --manifest-path=contracts/oracle_validators/Cargo.toml -x --suri //Alice
cargo contract instantiate --manifest-path=contracts/validator_selector/Cargo.toml -x --suri //Alice