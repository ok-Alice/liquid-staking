#![cfg_attr(not(feature = "std"), no_std, no_main)]
#![feature(min_specialization)]

#[openbrush::contract]
pub mod issuer_staker {
    use dapps_staking_extension::*;
    use openbrush::{contracts::pausable::*, traits::Storage};
    use scale::{Decode, Encode, MaxEncodedLen};

    #[derive(Debug, Copy, Clone, PartialEq, Eq, Encode, Decode, MaxEncodedLen)]
    struct NominationPoolStakingValueInput<Balance> {
        pub contract: [u8; 32],
        pub value: Balance,
    }

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct IssuerStaker {
        #[storage_field]
        pause: pausable::Data,
        flipped: bool,
    }

    impl IssuerStaker {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self::default()
        }

        #[ink(message)]
        #[openbrush::modifiers(when_not_paused)]
        pub fn flip(&mut self) -> Result<(), PausableError> {
            self.flipped = !self.flipped;
            Ok(())
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

    impl Pausable for IssuerStaker {
        #[ink(message)]
        fn paused(&self) -> bool {
            self.pause.paused()
        }
    }

    impl IssuerStaker {
        #[ink(message)]
        pub fn read_current_era(&self) -> u32 {
            DappsStaking::read_current_era()
        }

        #[ink(message)]
        pub fn read_unbonding_period(&self) -> u32 {
            DappsStaking::read_unbonding_period()
        }

        #[ink(message)]
        pub fn read_era_reward(&self, era: u32) -> Balance {
            DappsStaking::read_era_reward(era)
        }

        #[ink(message)]
        pub fn read_era_staked(&self, era: u32) -> Balance {
            DappsStaking::read_era_staked(era)
        }

        #[ink(message)]
        pub fn read_staked_amount(&self, account: AccountId) -> Balance {
            DappsStaking::read_staked_amount(account)
        }

        #[ink(message)]
        pub fn read_staked_amount_on_contract(
            &self,
            staker: AccountId,
            contract: AccountId,
        ) -> Balance {
            DappsStaking::read_staked_amount_on_contract(staker, contract)
        }

        #[ink(message)]
        pub fn read_contract_stake(&self, account: AccountId) -> Balance {
            DappsStaking::read_contract_stake(account)
        }

        #[ink(message, payable)]
        pub fn bond_nomination_pool(&mut self) -> Result<(), DSError> {
            // make sure the caller is recorded as staker

            let contract = self.env().account_id();
            let value = self.env().transferred_value();
            let input = NominationPoolStakingValueInput::<Balance> {
                contract: contract.encode().try_into().unwrap(),
                value,
            };
            ::ink::env::chain_extension::ChainExtensionMethod::build(0x10001)
                .input::<NominationPoolStakingValueInput<Balance>>()
                .output::<(), false>()
                .handle_error_code::<DSError>()
                .call(&input)
        }

        #[ink(message)]
        pub fn unbond_and_unstake(&mut self, value: Balance) -> Result<(), DSError> {
            // make sure caller is the staker

            let contract = self.env().account_id();
            DappsStaking::unbond_and_unstake(contract, value)
        }

        #[ink(message)]
        pub fn withdraw_unbonded(&mut self) -> Result<(), DSError> {
            // make sure caller has staked what is withdrawn

            DappsStaking::withdraw_unbonded()
        }

        #[ink(message)]
        pub fn claim_dapp(&mut self, account_id: AccountId, era: u32) -> Result<(), DSError> {
            DappsStaking::claim_dapp(account_id, era)
        }

        #[ink(message)]
        pub fn claim_staker(&mut self) -> Result<(), DSError> {
            let contract = self.env().account_id();
            DappsStaking::claim_staker(contract)
        }

        #[ink(message)]
        pub fn set_reward_destination(&mut self, destination: u8) -> Result<(), DSError> {
            DappsStaking::set_reward_destination(destination)
        }

        #[ink(message)]
        pub fn nomination_transfer(
            &mut self,
            origin_contract: AccountId,
            target_contract: AccountId,
            value: Balance,
        ) -> Result<(), DSError> {
            DappsStaking::nomination_transfer(origin_contract, target_contract, value)
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
                .instantiate("my_pausable", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("my_pausable", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("my_pausable", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("my_pausable", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("my_pausable", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("my_pausable", &ink_e2e::alice(), constructor, 0, None)
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
        async fn failed_flip_when_paused(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = ContractRef::new();
            let address = client
                .instantiate("my_pausable", &ink_e2e::alice(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            assert_eq!(method_call!(client, address, pause), Ok(()));
            assert!(matches!(
                method_call_dry_run!(client, address, flip),
                Err(_)
            ));

            Ok(())
        }
    }
}
