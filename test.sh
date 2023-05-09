set -x

cargo contract upload --manifest-path=contracts/accumulator/Cargo.toml --suri //Alice
cargo contract upload --manifest-path=contracts/adder/Cargo.toml --suri //Alice
cargo contract upload --manifest-path=contracts/subber/Cargo.toml --suri //Alice

ACCUMULATOR_HASH=$(cat target/ink/accumulator/*.contract | jq -r .source.hash)
ADDER_HASH=$(cat target/ink/adder/*.contract | jq -r .source.hash)
SUBBER_HASH=$(cat target/ink/subber/*.contract | jq -r .source.hash)

cargo contract instantiate --manifest-path=Cargo.toml -x --suri //Alice --args 0 0 $ACCUMULATOR_HASH $ADDER_HASH $SUBBER_HASH
