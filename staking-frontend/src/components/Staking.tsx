"use client";
import React, { useMemo, useState } from "react";
import { useWallet } from "useink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { useAtomValue, useSetAtom } from "jotai";

import Card from "@/ui-kit/Card";
import { Button } from "@/ui-kit/buttons";
import { chainBalanceAtom, exchangeRatesAtom } from "@/store";
import { useNotifications } from "@/hooks";
import ConnectWallet from "./ConnectWallet";
import ConfirmDialog from "./ConfirmDialog";

const Staking: React.FC = () => {
  const { account } = useWallet();
  const { addNotification } = useNotifications();
  const [overLimit, setOverLimit] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [showConfirmStake, setShowConfirmStake] = useState(false);

  const { availableDOT, availableLDOT } = useAtomValue(chainBalanceAtom);
  const setBalance = useSetAtom(chainBalanceAtom);
  const { DOTToLDOTExchangeRate: exchangeRate } =
    useAtomValue(exchangeRatesAtom);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let valid = value === "" || /^(\d+\.?\d*|\.\d+)$/.test(value);

    if (valid) {
      // convert to number and check if its over the limit
      setOverLimit(Number(value) > availableDOT);
      setStakeAmount(value);
    }
  };

  const handleStake = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      addNotification({
        title: "Staking DOT",
        message: "Transaction is pending...",
      });

      setTimeout(() => {
        addNotification({
          title: "Staking DOT",
          message: "Transaction is complete!",
        });

        resolve();
        setBalance((prev) => ({
          ...prev,
          availableDOT: prev.availableDOT - Number(stakeAmount),
          availableLDOT: prev.availableLDOT + Number(liquidBalancetoReceive),
        }));
        setShowConfirmStake(false);
        setStakeAmount("");
      }, 5000);
    });
  };

  const liquidBalancetoReceive = useMemo(
    () =>
      stakeAmount && !overLimit
        ? Number(stakeAmount) * Number(exchangeRate)
        : "--",
    [stakeAmount, exchangeRate, overLimit]
  );

  return (
    <div className="flex flex-col w-full items-center">
      <Card small className="bg-sky-900/20 rounded-t-2xl shadow-lg p-8 pt-4">
        <div className="flex justify-between text-white font-bold">
          <div>
            <h2 className="font-semibold mb-2 text-center">Available DOT</h2>
            {/* <ChainBalance /> */}
            {account ? availableDOT : "--"}
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-center">Available LDOT</h2>
            {account ? availableLDOT : "--"}
          </div>
        </div>
      </Card>
      <Card small containerClassName="-mt-4">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirmStake(true);
          }}
        >
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
            <span className={`text-red-500 ${overLimit ? "" : "hidden"}`}>
              Entered amount exceeds available DOT
            </span>
            {account ? (
              <Button type="submit" disabled={overLimit || !stakeAmount}>
                Stake
              </Button>
            ) : (
              <ConnectWallet />
            )}
          </div>
        </form>

        <div>
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex justify-between">
              <strong>Exchange Rate:</strong>
              <span>1:{exchangeRate}</span>
            </div>
            <div className="flex justify-between">
              <strong>You will receive:</strong>
              <span>{liquidBalancetoReceive} LDOT</span>
            </div>
          </div>
        </div>
      </Card>

      {showConfirmStake && (
        <ConfirmDialog
          title="Confirm Staking DOT"
          message={`stake ${stakeAmount} DOT`}
          onCancel={() => setShowConfirmStake(false)}
          onConfirm={handleStake}
        />
      )}
    </div>
  );
};

export default Staking;
