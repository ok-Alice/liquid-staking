#![cfg_attr(not(feature = "std"), no_std, no_main)]
#![feature(min_specialization)]

use scale::{Decode, Encode};
#[openbrush::contract]
pub mod issuer_staker {
    use openbrush::{contracts::pausable::*, traits::Storage};
    use scale::{Decode, Encode, MaxEncodedLen};
    use crate::NPSError;

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

        /// Modifies the code which is used to execute calls to this contract address
        /// (`AccountId`).
        ///
        /// We use this to upgrade the contract logic. We don't do any authorization here,
        /// any caller can execute this method.
        ///
        /// In a production contract you would do some authorization here!
        #[ink(message)]
        pub fn set_code(&mut self, code_hash: Hash) {
            self.env().set_code_hash(&code_hash).unwrap_or_else(|err| {
                panic!("Failed to `set_code_hash` to {code_hash:?} due to {err:?}")
            });
            ink::env::debug_println!("Switched code hash to {:?}.", code_hash);
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
            unimplemented!("read_current_era not implemented")
        }

        #[ink(message)]
        pub fn read_unbonding_period(&self) -> u32 {
            unimplemented!("read_unbonding_period not implemented")
        }

        #[ink(message)]
        pub fn read_era_reward(&self, _era: u32) -> Result<(), NPSError> {
            unimplemented!("read_era_reward not implemented")
        }

        #[ink(message)]
        pub fn read_era_staked(&self, _era: u32) -> Result<(), NPSError> {
            unimplemented!("read_era_staked not implemented")
        }

        #[ink(message)]
        pub fn read_staked_amount(&self, _account: AccountId) -> Result<(), NPSError> {
            unimplemented!("read_staked_amount not implemented")
        }

        #[ink(message)]
        pub fn read_staked_amount_on_contract(
            &self,
            _staker: AccountId,
            _contract: AccountId,
        ) -> Result<(), NPSError> {
            unimplemented!("read_staked_amount_on_contract not implemented")
        }

        #[ink(message)]
        pub fn read_contract_stake(&self, _account: AccountId) -> Result<(), NPSError> {
            unimplemented!("read_contract_stake not implemented")
        }

        #[ink(message, payable)]
        // #[openbrush::modifiers(when_not_paused)] // TODO: Figure out what it is used for
        pub fn bond_nomination_pool(&mut self) -> Result<(), NPSError> {
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
                .handle_error_code::<NPSError>()
                .call(&input)
        }

        #[ink(message)]
        pub fn unbond_and_unstake(&mut self, _value: Balance) -> Result<(), NPSError> {
            unimplemented!("unbond_and_unstake not implemented")
        }

        #[ink(message)]
        pub fn withdraw_unbonded(&mut self) -> Result<(), NPSError> {
            unimplemented!("withdraw_unbonded not implemented")
        }

        #[ink(message)]
        pub fn claim_dapp(&mut self, _account_id: AccountId, era: u32) -> Result<(), NPSError> {
            unimplemented!("claim_dapp not implemented")
        }

        #[ink(message)]
        pub fn claim_staker(&mut self) -> Result<(), NPSError> {
            unimplemented!("claim_staker not implemented")
        }

        #[ink(message)]
        pub fn set_reward_destination(&mut self, _destination: u8) -> Result<(), NPSError> {
            unimplemented!("set_reward_destination not implemented")
        }

        #[ink(message)]
        pub fn nomination_transfer(
            &mut self,
            _origin_contract: AccountId,
            _target_contract: AccountId,
            _value: Balance,
        ) -> Result<(), crate::NPSError> {
            unimplemented!("nomination_transfer not implemented")
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
                .instantiate("issuer_staker", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("issuer_staker", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("issuer_staker", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("issuer_staker", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("issuer_staker", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("issuer_staker", &ink_e2e::alice(), constructor, 0, None)
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
                .instantiate("issuer_staker", &ink_e2e::alice(), constructor, 0, None)
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

        // #[ink_e2e::test(additional_contracts = "./updated_incrementer/Cargo.toml")]
        // async fn set_code_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
        //     // Given
        //     let constructor = IncrementerRef::new();
        //     let contract_acc_id = client
        //         .instantiate("incrementer", &ink_e2e::alice(), constructor, 0, None)
        //         .await
        //         .expect("instantiate failed")
        //         .account_id;

        //     let get = build_message::<IncrementerRef>(contract_acc_id.clone())
        //         .call(|incrementer| incrementer.get());
        //     let get_res = client.call_dry_run(&ink_e2e::alice(), &get, 0, None).await;
        //     assert!(matches!(get_res.return_value(), 0));

        //     let inc = build_message::<IncrementerRef>(contract_acc_id.clone())
        //         .call(|incrementer| incrementer.inc());
        //     let _inc_result = client
        //         .call(&ink_e2e::alice(), inc, 0, None)
        //         .await
        //         .expect("`inc` failed");

        //     let get = build_message::<IncrementerRef>(contract_acc_id.clone())
        //         .call(|incrementer| incrementer.get());
        //     let get_res = client.call_dry_run(&ink_e2e::alice(), &get, 0, None).await;
        //     assert!(matches!(get_res.return_value(), 1));

        //     // When
        //     let new_code_hash = client
        //         .upload("updated_incrementer", &ink_e2e::alice(), None)
        //         .await
        //         .expect("uploading `updated_incrementer` failed")
        //         .code_hash;

        //     let new_code_hash = new_code_hash.as_ref().try_into().unwrap();
        //     let set_code = build_message::<IncrementerRef>(contract_acc_id.clone())
        //         .call(|incrementer| incrementer.set_code(new_code_hash));

        //     let _set_code_result = client
        //         .call(&ink_e2e::alice(), set_code, 0, None)
        //         .await
        //         .expect("`set_code` failed");

        //     // Then
        //     // Note that our contract's `AccountId` (so `contract_acc_id`) has stayed the
        //     // same between updates!
        //     let inc = build_message::<IncrementerRef>(contract_acc_id.clone())
        //         .call(|incrementer| incrementer.inc());

        //     let _inc_result = client
        //         .call(&ink_e2e::alice(), inc, 0, None)
        //         .await
        //         .expect("`inc` failed");

        //     let get = build_message::<IncrementerRef>(contract_acc_id.clone())
        //         .call(|incrementer| incrementer.get());
        //     let get_res = client.call_dry_run(&ink_e2e::alice(), &get, 0, None).await;

        //     // Remember, we updated our incrementer contract to increment by `4`.
        //     assert!(matches!(get_res.return_value(), 5));

        //     Ok(())
        // }
    }
}

#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
#[derive(PartialEq, Eq, Copy, Clone, Encode, Decode, Debug)]
pub enum NPSError {
    /// Unknown error
    UnknownError = 99,
}

impl ink::env::chain_extension::FromStatusCode for NPSError {
    fn from_status_code(status_code: u32) -> Result<(), Self> {
        match status_code {
            0 => Ok(()),
            _ =>  Err(Self::UnknownError),
        }
    }
}

impl From<scale::Error> for NPSError {
    fn from(_: scale::Error) -> Self {
        NPSError::UnknownError
    }
}
