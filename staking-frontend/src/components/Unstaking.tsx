"use client";
import React, { useMemo, useState } from "react";
import { useWallet } from "useink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { useAtomValue } from "jotai";

import Card from "@/ui-kit/Card";
import { Button } from "@/ui-kit/buttons";
import { mockedDataAtom } from "@/store";
import ConnectWallet from "./ConnectWallet";
import ChainBalance from "./ChainBalance";

const UnStaking: React.FC = () => {
  const [unstakeAmount, setUnstakeAmount] = useState<string>("");
  const { account } = useWallet();
  const [overLimit, setOverLimit] = useState(false);
  const { LDOTToDOTExchangeRate: exchangeRate, availableLDOT } =
    useAtomValue(mockedDataAtom);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let isValid = value === "" || /^(\d+\.?\d*|\.\d+)$/.test(value);

    // convert to number and check if it is less than availableDOT
    if (isValid) {
      setOverLimit(Number(value) > Number(availableLDOT));
      setUnstakeAmount(value);
    }
  };

  const handleStake = async () => {
    // Your stake logic here
  };

  const DOTToRecieve = useMemo(
    () =>
      unstakeAmount && !overLimit
        ? Number(unstakeAmount) * Number(exchangeRate)
        : "--",
    [unstakeAmount, exchangeRate, overLimit]
  );

  return (
    <div className="flex flex-col w-full items-center">
      <Card small className="bg-sky-900/20 rounded-t-2xl shadow-lg p-8 pt-4">
        <div className="flex justify-between text-white font-bold">
          <div>
            <h2 className="font-semibold mb-2 text-center">Available LDOT</h2>
            {/* <ChainBalance /> */}
            {account ? availableLDOT : "--"}
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-center">
              Current Exchange Rate
            </h2>
            1:{exchangeRate}
          </div>
        </div>
      </Card>
      <Card small containerClassName="-mt-4">
        <div className="flex flex-col space-y-4">
          <div className="relative border rounded-2xl w-full">
            <FontAwesomeIcon
              icon={faCoins}
              className="absolute top-1/2 left-3 transform -translate-y-1/2"
            />
            <input
              type="text"
              value={unstakeAmount}
              onChange={handleInputChange}
              placeholder="Amount of LDOT"
              className="pl-10 p-2 py-4 border-0 rounded-2xl w-full"
              disabled={!account}
            />
          </div>
          <span className={`text-red-500 ${overLimit ? "" : "hidden"}`}>
            Entered amount exceeds available DOT
          </span>
          {account ? (
            <Button
              onClick={handleStake}
              disabled={overLimit || unstakeAmount === ""}
            >
              Stake
            </Button>
          ) : (
            <ConnectWallet />
          )}
        </div>

        <div>
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex justify-between">
              <strong>You will receive</strong> {DOTToRecieve} DOT
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UnStaking;
