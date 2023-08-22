#![cfg_attr(not(feature = "std"), no_std, no_main)]
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

    /// Emitted when storage is appended
    #[ink(event)]
    pub struct AppendStorage {
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

	/// Appends to the current storage
	#[ink(message)]
	pub fn append(&mut self,
		   new: Vec<(AccountId, EraEMA, TotalBonded)>,
	) -> Result<()> {
	    let caller = Self::env().caller();

	    if caller != self.owner {
		return Err(Error::CallerNotOwner)
	    }

	    let num = new.len() as u16;
	    self.current.extend(new);

	    self.env().emit_event( AppendStorage {
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
	fn append_works() {
	    let accounts = default_accounts();

	    set_next_caller(accounts.alice);

	    let mut contract = OracleValidators::new();

	    let test_data1 : Vec<(AccountId, EraEMA, TotalBonded)>
		= vec![ ( accounts.alice, 123, 123 )];

	    assert_eq!(contract.set(test_data1), Ok(()));
            assert_eq!(test::recorded_events().count(), 2);
	    
	    let test_data2 : Vec<(AccountId, EraEMA, TotalBonded)>
		= vec! [ (accounts.bob, 321, 321) ];

	    assert_eq!(contract.append(test_data2), Ok(()));
	    assert_eq!(test::recorded_events().count(), 3);

	    let tset_data = contract.get();
	    assert_eq!(tset_data[1].0, accounts.bob);
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

    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        use super::*;
        use ink_e2e::build_message;

        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        #[ink_e2e::test]
        async fn it_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
	    let constructor = OracleValidatorsRef::new();
	    let contract_acc_id = client
		.instantiate("oracle", &ink_e2e::alice(), constructor, 0, None)
		.await
		.expect("instantiate failed")
		.account_id;

	    let get = build_message::<OracleValidatorsRef>(contract_acc_id.clone())
		.call(|oracle| oracle.get());
	    let get_res = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
	    assert_eq!(get_res.exec_result.result.unwrap().data.len(), 0);

	    Ok(())
	}
    }
}
