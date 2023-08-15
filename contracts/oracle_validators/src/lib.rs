#![cfg_attr(not(feature = "std"), no_std, no_main)]
#![feature(min_specialization)]

pub use self::oracle_validators::{OracleValidators, OracleValidatorsRef};

#[openbrush::contract]
pub mod oracle_validators {
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct OracleValidators {
        validators: u32,
    }

    impl OracleValidators {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self::default()
        }

        #[ink(message)]
        pub fn set_validators(&mut self, validators: u32) {
            self.validators = validators;
        }

        #[ink(message)]
        pub fn get_validators(&mut self) -> u32 {
            self.validators
        }
    }
}
