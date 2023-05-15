set -x

cargo contract upload --manifest-path=contracts/staker/Cargo.toml -x --suri //Alice
cargo contract upload --manifest-path=contracts/issuer/Cargo.toml -x --suri //Alice

STAKER_HASH=$(cat target/ink/staker/*.contract | jq -r .source.hash)
ISSUER_HASH=$(cat target/ink/issuer/*.contract | jq -r .source.hash)

cargo contract instantiate --manifest-path=Cargo.toml -x --suri //Alice --args 0 0 $ACCUMULATOR_HASH $ADDER_HASH $SUBBER_HASH $STAKER_HASH
