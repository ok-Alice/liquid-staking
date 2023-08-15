#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

pub use self::oracle_validators::{OracleValidators, OracleValidatorsRef};

#[openbrush::contract]
pub mod oracle_validators {
    use openbrush::traits::Storage;
    use ink::prelude::vec::Vec;

    type EraEMA = u32;
    type TotalBonded = Balance;

    /// Emitted when storage is set
    #[ink(event)]
    pub struct SetStorage {
	/// Number of validators in update
	#[ink(topic)]
	num: u16,
    }

    /// Emitted when ownership is transfered
    #[ink(event)]
    pub struct NewOwner {
	#[ink(topic)]
	new_owner: AccountId,
	#[ink(topic)]
	old_owner: AccountId,
    }
    
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
	/// Caller is not permissioned to execute this function
	CallerNotOwner,
    }

    type Result<T> = core::result::Result<T, Error>;

    #[ink(storage)]
    #[derive(Storage)]
    pub struct OracleValidators {
	/// Current data contained by the oracle
	current: Vec<(AccountId, EraEMA, TotalBonded)>,
	/// Caller of constructor becomes privileged owner
	owner: AccountId	
    }

    impl OracleValidators {
        /// Constructors creates empty internal storage.
        #[ink(constructor)]
        pub fn new() -> Self {
	    let current : Vec<(AccountId, EraEMA, TotalBonded)> = Vec::default();
	    let owner = Self::env().caller();

	    Self::env().emit_event(NewOwner {
		new_owner: owner,
		old_owner: [0; 32].into(),
	    });
	    
	    Self {
		current,
		owner,
	    }
        }

	/// Gets current storage
	#[ink(message)]
	pub fn get(&self) -> Vec<(AccountId, EraEMA, TotalBonded)> {
	    self.current.clone()
	}

	/// Sets current storage
	#[ink(message)]
	pub fn set(&mut self,
		   new: Vec<(AccountId, EraEMA, TotalBonded)>,
	) -> Result<()> {
	    let caller = Self::env().caller();

	    if caller != self.owner {
		return Err(Error::CallerNotOwner)
	    }

	    let num = new.len() as u16;
	    self.current = new;

	    self.env().emit_event( SetStorage {
		num,
	    });
	    
	    Ok(())
	}

	/// Changes current owner to new or invalid AccountId
	#[ink(message)]
	pub fn new_owner(&mut self,
			 new_owner: AccountId
	) -> Result<()> {
	    let caller = Self::env().caller();

	    if caller != self.owner {
		return Err(Error::CallerNotOwner)
	    }
	    
	    self.owner = new_owner;

	    self.env().emit_event(NewOwner {
		new_owner,
		old_owner: caller,
	    });
	    
	    Ok(())	    
	}
	
    }

    #[cfg(test)]
    mod tests {
	use super::*;
	use ink::env::test;

	fn default_accounts(
        ) -> test::DefaultAccounts<ink::env::DefaultEnvironment> {
            test::default_accounts::<Environment>()
        }

        fn set_next_caller(caller: AccountId) {
            test::set_caller::<Environment>(caller);
        }

	#[ink::test]
	fn new_works() {
	    let accounts = default_accounts();

	    set_next_caller(accounts.alice);

	    let contract = OracleValidators::new();

	    assert_eq!(contract.get().len(), 0);
            assert_eq!(test::recorded_events().count(), 1);	    
	}


	#[ink::test]
	fn set_works() {
	    let accounts = default_accounts();

	    set_next_caller(accounts.alice);

	    let mut contract = OracleValidators::new();

	    let test_data : Vec<(AccountId, EraEMA, TotalBonded)>
		= vec![ ( accounts.alice, 123, 123 ),
		          (accounts.bob, 321, 321) ];

	    assert_eq!(contract.set(test_data), Ok(()));
            assert_eq!(test::recorded_events().count(), 2);

	    let tset_data = contract.get();
	    assert_eq!(tset_data[1].0, accounts.bob);
	}

	#[ink::test]
	fn set_check_ownership_works() {
	    let accounts = default_accounts();

	    set_next_caller(accounts.alice);

	    let mut contract = OracleValidators::new();

	    set_next_caller(accounts.bob);	    

	    assert_eq!(contract.set(vec![]), Err(Error::CallerNotOwner));
	}

	#[ink::test]
	fn new_owner_works() {
	    let accounts = default_accounts();

	    set_next_caller(accounts.alice);

	    let mut contract = OracleValidators::new();
	    
	    assert_eq!(contract.new_owner(accounts.bob), Ok(()));
	    assert_eq!(test::recorded_events().count(), 2);

	    let test_data : Vec<(AccountId, EraEMA, TotalBonded)>
		= vec![ ( accounts.alice, 123, 123 ),
		          (accounts.bob, 321, 321) ];

	    set_next_caller(accounts.bob);	    

	    assert_eq!(contract.set(test_data), Ok(()));
	    assert_eq!(test::recorded_events().count(), 3);	    
	}
    }

}
