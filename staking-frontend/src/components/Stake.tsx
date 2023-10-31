"use client";

import { useState } from "react";
import { Button } from "@/ui-kit/buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "useink";
import { ConnectWallet } from ".";

interface StakeProps {
  stakeAmount: string;
  setStakeAmount: (amount: string) => void;
}

const Stake = ({ stakeAmount, setStakeAmount }: StakeProps) => {
  const { account } = useWallet();
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValidInput = value === "" || /^(\d+\.?\d*|\.\d+)$/.test(value);
    setIsValid(isValidInput);
    if (isValidInput) {
      setStakeAmount(value);
    }
  };

  const handleStake = async () => {
    // Your stake logic here
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative border rounded-2xl w-full">
        <FontAwesomeIcon
          icon={faCoins}
          className="absolute top-1/2 left-3 transform -translate-y-1/2"
        />
        <input
          type="text"
          value={stakeAmount}
          onChange={handleInputChange}
          placeholder="Amount of DOTs"
          className="pl-10 p-2 py-4 border-0 rounded-2xl w-full"
          disabled={!account}
        />
      </div>
      <span className={`text-red-500 ${isValid ? "hidden" : ""}`}>
        Please enter a valid number
      </span>
      {account ? (
        <Button onClick={handleStake} disabled={!isValid || stakeAmount === ""}>
          Stake
        </Button>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};

export default Stake;
