#![cfg_attr(not(feature = "std"), no_std)]

pub use self::issuer::{Issuer, IssuerRef};

#[ink::contract]
mod issuer {
    use ink::prelude::{
        vec,
        vec::Vec,
    };

    use ink_env::{
        call::{build_call, ExecutionInput, Selector},
        DefaultEnvironment,
    };
    use ink_prelude::string::ToString;

    /// Increments the underlying `staker` value.
    #[ink(storage)]
    pub struct Issuer {
        /// The `staker` code hash.u
        staker_code_hash: Hash,
    }

    impl Issuer {
        /// Creates a new `issuer` from the given `staker`.
        #[ink(constructor)]
        pub fn new(staker_code_hash: Hash) -> Self {
            Self { staker_code_hash }
        }

        /// Delegates the call to `staker`.
        #[ink(message)]
        pub fn stake(&self, by: i32) {
            match build_call::<DefaultEnvironment>()
                .delegate(self.staker_code_hash)
                .exec_input(
                    ExecutionInput::new(Selector::new(ink::selector_bytes!("stake"))).push_arg(by),
                )
                .returns::<()>()
                .try_invoke()
            {
                Ok(_) => (),
                Err(err) => match err {
                    ink_env::Error::Decode(err) => {
                        panic!("Failed to decode return value: {:?}", err.to_string())
                    }
                    _ => panic!("Failed to invoke `stake`"),
                },
            }
        }

        /// Delegates the call to `staker`.
        #[ink(message)]
        pub fn unstake(&self) -> i32 {
            return match build_call::<DefaultEnvironment>()
                .delegate(self.staker_code_hash)
                .exec_input(ExecutionInput::new(Selector::new(ink::selector_bytes!(
                    "unstake"
                ))))
                .returns::<i32>()
                .try_invoke()
            {
                Ok(value) => value,
                Err(err) => match err {
                    ink_env::Error::Decode(err) => {
                        panic!("Failed to decode return value: {:?}", err.to_string())
                    }
                    _ => panic!("Failed to invoke `stake`"),
                },
            };
        }

        /// Vec with staker account_id, staker caller, own caller 
        #[ink(message)]
        pub fn callers(&self) -> Vec<AccountId> {
            let staker_account_id =  match build_call::<DefaultEnvironment>()
            .delegate(self.staker_code_hash)
            .exec_input(ExecutionInput::new(Selector::new(ink::selector_bytes!(
                "account_id"
            ))))
            .returns::<AccountId>()
            .try_invoke()
                {
                    Ok(value) => value,
                    Err(err) => match err {
                        ink_env::Error::Decode(err) => {
                            panic!("Failed to decode return value: {:?}", err.to_string())
                        }
                        _ => panic!("Failed to invoke `caller`"),
                    },
                };


            let staker_caller =  match build_call::<DefaultEnvironment>()
            .delegate(self.staker_code_hash)
            .exec_input(ExecutionInput::new(Selector::new(ink::selector_bytes!(
                "caller"
            ))))
            .returns::<AccountId>()
            .try_invoke()
                {
                    Ok(value) => value,
                    Err(err) => match err {
                        ink_env::Error::Decode(err) => {
                            panic!("Failed to decode return value: {:?}", err.to_string())
                        }
                        _ => panic!("Failed to invoke `caller`"),
                    },
                };

            vec![staker_account_id, staker_caller, self.env().caller()]

        }


    }
}
