#![cfg_attr(not(feature = "std"), no_std, no_main)]


#[ink::contract]
mod dummy_issuer_staker {
    use scale::{Decode, Encode};
    use sp_arithmetic::{FixedPointNumber, FixedU128};
    use assets_extension::AssetsExtension;
    use assets_extension::Origin;
    
    
    #[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum NPSError {
	/// Success
	Success = 0,
	/// Not enough balance
	NotEnoughBalance = 1,
	/// Asset transfer failed
	TransferFailed = 2,
	/// Asset mint failed
	MintFailed = 3,
	/// Unknown error
	UnknownError = 99,
    }
    
    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    #[derive(Default)]    
    pub struct DummyIssuerStaker {
        /// Stores a single `bool` value on the storage.
        exchange_rate: Balance,
        asset_id: u128,	
        liquid_asset_id: u128,
    }

    impl DummyIssuerStaker {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(
	    exchange_rate: Balance,
            asset_id: u128,	
            liquid_asset_id: u128,
	) -> Self {
	   Self { exchange_rate, asset_id, liquid_asset_id }
        }


	#[ink(message)]
        pub fn bond_and_stake(&mut self, amount: Balance) -> Result<(), NPSError> {
            let caller = self.env().caller();

	    if amount == 0 {
                return Err(NPSError::NotEnoughBalance);
            }

	    // Must approve transfer outside of ink.
            AssetsExtension::transfer(
                Origin::Caller,
                self.asset_id,
                self.env().account_id(),
                amount,
            )
            .or_else(|_| Err(NPSError::TransferFailed))?;

            let amount_to_mint = self
                .convert_staking_to_liquid(amount)
                .or_else(|_| Err(NPSError::UnknownError))?;

            AssetsExtension::mint(
                Origin::Address,
                self.liquid_asset_id,
                caller,
                amount_to_mint,
            )
            .or_else(|_| Err(NPSError::MintFailed))?;

	    Ok(())
	}

	#[ink(message)]
        pub fn unbond_and_unstake(&mut self, amount: Balance) -> Result<(), NPSError> {
            let caller = self.env().caller();
            let amount_to_redeem = self.convert_liquid_to_staking(amount)?;

            AssetsExtension::burn(
                Origin::Address,
                self.liquid_asset_id,
                caller,
                amount_to_redeem,
            )
            .or_else(|_| Err(NPSError::UnknownError))?;
            // TODO: Call unbond in chain extension

            Ok(())
	}

	#[ink(message)]
	pub fn dummy_set_exchange_rate(&mut self, exchange_rate: Balance) {
	    self.exchange_rate = exchange_rate;
	}
	

	// Calculate the amount of liquid currency converted from staking currency by current
	// exchange rate.
	fn convert_staking_to_liquid(&self, staking_amount: Balance) -> Result<Balance, NPSError> {
            self.current_exchange_rate()
		.reciprocal()
		.unwrap_or(FixedU128::from(self.exchange_rate))
		.checked_mul_int(staking_amount)
		.ok_or(NPSError::UnknownError)
	}
	
	fn convert_liquid_to_staking(&self, liquid_amount: Balance) -> Result<Balance, NPSError> {
            self.current_exchange_rate()
		.checked_mul_int(liquid_amount)
		.ok_or(NPSError::UnknownError)
	}

	fn current_exchange_rate(&self) -> FixedU128 {
            FixedU128::saturating_from_rational(1, self.exchange_rate)
	}
    }
	
}


