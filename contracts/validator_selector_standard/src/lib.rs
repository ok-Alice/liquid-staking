#![cfg_attr(not(feature = "std"), no_std, no_main)]
#![feature(min_specialization)]

#[openbrush::contract]
pub mod validator_selector_standard {
    use openbrush::{contracts::pausable::*, traits::Storage};
    use scale::{Decode, Encode, MaxEncodedLen};

    #[derive(Debug, Copy, Clone, PartialEq, Eq, Encode, Decode, MaxEncodedLen)]
    struct NominationPoolStakingValueInput<Balance> {
        pub contract: [u8; 32],
        pub value: Balance,
    }

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct ValidatorSelectorStandard {
        #[storage_field]
        pause: pausable::Data,
        flipped: bool,
    }

    impl ValidatorSelectorStandard {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self::default()
        }

        #[ink(message)]
        pub fn pause(&mut self) -> Result<(), PausableError> {
            self._pause()
        }

        #[ink(message)]
        pub fn unpause(&mut self) -> Result<(), PausableError> {
            self._unpause()
        }

        #[ink(message)]
        pub fn change_state(&mut self) -> Result<(), PausableError> {
            self._switch_pause()
        }
    }

    impl Pausable for ValidatorSelectorStandard {
        #[ink(message)]
        fn paused(&self) -> bool {
            self.pause.paused()
        }
    }

    impl ValidatorSelectorStandard {
        #[ink(message)]
        #[openbrush::modifiers(when_not_paused)]
        pub fn select_validator(&mut self) -> Result<(), PausableError> {
            // TODO: implement validator selection logic
            Ok(())
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
                    "validator_selector_standard",
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
                    "validator_selector_standard",
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
                    "validator_selector_standard",
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
                    "validator_selector_standard",
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
                    "validator_selector_standard",
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
                    "validator_selector_standard",
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
                    "validator_selector_standard",
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
