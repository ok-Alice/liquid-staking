#![cfg_attr(not(feature = "std"), no_std, no_main)]
#![feature(min_specialization)]

#[openbrush::implementation(Pausable)]
#[openbrush::contract]
pub mod validator_selector {
    use openbrush::{contracts::pausable::*, traits::Storage};
    use scale::{Decode, Encode};
    use ink::prelude::vec::Vec;
    
    use oracle_validators::OracleValidatorsRef;

    #[derive(Debug, Copy, Clone, PartialEq, Eq, Encode, Decode)]
    struct NominationPoolStakingValueInput<Balance> {
        pub contract: [u8; 32],
        pub value: Balance,
    }

    #[ink(storage)]
    #[derive(Storage)]
    pub struct ValidatorSelector {
        oracle_validators: OracleValidatorsRef,

        #[storage_field]
        pause: pausable::Data,
        flipped: bool,
    }

    impl ValidatorSelector {
        #[ink(constructor)]
        pub fn new(oracle_validators: OracleValidatorsRef) -> Self {
            Self {
                oracle_validators,
                pause: pausable::Data::default(),
                flipped: false,
            }
        }

        #[ink(message)]
        pub fn pause(&mut self) -> Result<(), PausableError> {
            Internal::_pause(self)
        }

        #[ink(message)]
        pub fn unpause(&mut self) -> Result<(), PausableError> {
            Internal::_unpause(self)
        }

        #[ink(message)]
        pub fn change_state(&mut self) -> Result<(), PausableError> {
            Internal::_switch_pause(self)
        }
    }

    // impl Pausable for ValidatorSelector {
    //     #[ink(message)]
    //     fn paused(&self) -> bool {
    //         self.pause.paused()
    //     }
    // }

    impl ValidatorSelector {
        #[ink(message)]
        #[openbrush::modifiers(when_not_paused)]
        pub fn select_validator(&mut self) -> Result<Vec<(AccountId, u32, Balance)>, PausableError> {
            Ok(self.oracle_validators.get())
        }
    }

    #[cfg(all(test, feature = "e2e-tests"))]
    pub mod tests {
        #[rustfmt::skip]
        use super::*;
        #[rustfmt::skip]
        use ink_e2e::build_message;

        use test_helpers::{method_call, method_call_dry_run};

        type E2EResult<T> = Result<T, Box<dyn std::error::Error>>;

        #[ink_e2e::test]
        async fn success_flip_when_not_paused(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = ContractRef::new();
            let address = client
                .instantiate(
                    "validator_selector",
                    &ink_e2e::alice(),
                    constructor,
                    0,
                    None,
                )
                .await
                .expect("instantiate failed")
                .account_id;

            assert_eq!(method_call!(client, address, flip), Ok(()));

            Ok(())
        }

        #[ink_e2e::test]
        async fn success_pause_when_not_paused(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = ContractRef::new();
            let address = client
                .instantiate(
                    "validator_selector",
                    &ink_e2e::alice(),
                    constructor,
                    0,
                    None,
                )
                .await
                .expect("instantiate failed")
                .account_id;

            assert_eq!(method_call!(client, address, pause), Ok(()));

            Ok(())
        }

        #[ink_e2e::test]
        async fn success_change_state(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = ContractRef::new();
            let address = client
                .instantiate(
                    "validator_selector",
                    &ink_e2e::alice(),
                    constructor,
                    0,
                    None,
                )
                .await
                .expect("instantiate failed")
                .account_id;

            assert_eq!(method_call!(client, address, change_state), Ok(()));

            Ok(())
        }

        #[ink_e2e::test]
        async fn failed_double_pause(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = ContractRef::new();
            let address = client
                .instantiate(
                    "validator_selector",
                    &ink_e2e::alice(),
                    constructor,
                    0,
                    None,
                )
                .await
                .expect("instantiate failed")
                .account_id;

            assert_eq!(method_call!(client, address, pause), Ok(()));
            assert!(matches!(
                method_call_dry_run!(client, address, pause),
                Err(_)
            ));

            Ok(())
        }

        #[ink_e2e::test]
        async fn success_pause_and_unpause(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = ContractRef::new();
            let address = client
                .instantiate(
                    "validator_selector",
                    &ink_e2e::alice(),
                    constructor,
                    0,
                    None,
                )
                .await
                .expect("instantiate failed")
                .account_id;

            assert_eq!(method_call!(client, address, pause), Ok(()));
            assert_eq!(method_call!(client, address, unpause), Ok(()));

            Ok(())
        }

        #[ink_e2e::test]
        async fn failed_unpause(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = ContractRef::new();
            let address = client
                .instantiate(
                    "validator_selector",
                    &ink_e2e::alice(),
                    constructor,
                    0,
                    None,
                )
                .await
                .expect("instantiate failed")
                .account_id;

            assert!(matches!(
                method_call_dry_run!(client, address, unpause),
                Err(_)
            ));

            Ok(())
        }

        #[ink_e2e::test]
        async fn failed_select_validator_when_paused(
            mut client: ink_e2e::Client<C, E>,
        ) -> E2EResult<()> {
            let constructor = ContractRef::new();
            let address = client
                .instantiate(
                    "validator_selector",
                    &ink_e2e::alice(),
                    constructor,
                    0,
                    None,
                )
                .await
                .expect("instantiate failed")
                .account_id;

            assert_eq!(method_call!(client, address, pause), Ok(()));
            assert!(matches!(
                method_call_dry_run!(client, address, select_validator),
                Err(_)
            ));

            Ok(())
        }
    }
}
