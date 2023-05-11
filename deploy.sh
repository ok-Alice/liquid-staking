set -x

cargo contract upload --manifest-path=contracts/staker/Cargo.toml -x --suri //Alice
cargo contract upload --manifest-path=contracts/accumulator/Cargo.toml -x --suri //Alice
cargo contract upload --manifest-path=contracts/adder/Cargo.toml -x --suri //Alice
cargo contract upload --manifest-path=contracts/subber/Cargo.toml -x --suri //Alice

STAKER_HASH=$(cat target/ink/staker/*.contract | jq -r .source.hash)
ACCUMULATOR_HASH=$(cat target/ink/accumulator/*.contract | jq -r .source.hash)
ADDER_HASH=$(cat target/ink/adder/*.contract | jq -r .source.hash)
SUBBER_HASH=$(cat target/ink/subber/*.contract | jq -r .source.hash)

cargo contract instantiate --manifest-path=Cargo.toml -x --suri //Alice --args 0 0 $ACCUMULATOR_HASH $ADDER_HASH $SUBBER_HASH $STAKER_HASH
