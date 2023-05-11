#![cfg_attr(not(feature = "std"), no_std)]

pub use self::adder::{Adder, AdderRef};

#[ink::contract]
mod adder {
    use accumulator::AccumulatorRef;
    use ink_env::{DefaultEnvironment, call::{build_call, ExecutionInput, Selector}};
    use ink_prelude::string::ToString;

    /// Increments the underlying `accumulator` value.
    #[ink(storage)]
    pub struct Adder {
        /// The `accumulator` to store the value.
        accumulator: AccumulatorRef,
        /// The `staker` code hash.u
        staker_code_hash: Hash,
    }

    impl Adder {
        /// Creates a new `adder` from the given `accumulator`.
        #[ink(constructor)]
        pub fn new(accumulator: AccumulatorRef, staker_code_hash: Hash) -> Self {
            Self { accumulator, staker_code_hash }
        }

        /// Increases the `accumulator` value by some amount.
        #[ink(message)]
        pub fn inc(&mut self, by: i32) {
            self.accumulator.inc(by)
        }

        /// Delegates the call to `staker`.
        #[ink(message)]
        pub fn stake(&self, by: i32) {
            match build_call::<DefaultEnvironment>()
                .delegate(self.staker_code_hash)
                .exec_input(
                    ExecutionInput::new(Selector::new(ink::selector_bytes!("stake")))
                        .push_arg(by)
                )
                .returns::<()>()
                .try_invoke() {
                    Ok(_) => (),
                    Err(err) => match err {
                        ink_env::Error::Decode(err) => panic!("Failed to decode return value: {:?}", err.to_string()),
                        _ => panic!("Failed to invoke `stake`"),
                    }
                }
        }

         /// Delegates the call to `staker`.
         #[ink(message)]
         pub fn get_stake(&self) -> i32 {
            return match build_call::<DefaultEnvironment>()
                 .delegate(self.staker_code_hash)
                 .exec_input(
                     ExecutionInput::new(Selector::new(ink::selector_bytes!("get_stake")))
                 )
                 .returns::<i32>()
                 .try_invoke() {
                     Ok(value) => value,
                     Err(err) => match err {
                         ink_env::Error::Decode(err) => panic!("Failed to decode return value: {:?}", err.to_string()),
                         _ => panic!("Failed to invoke `stake`"),
                     }
                 }
         }
    }
}
