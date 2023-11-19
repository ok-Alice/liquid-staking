"use client";
import React, { useMemo, useState } from "react";
import { useWallet } from "useink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useAtomValue, useSetAtom } from "jotai";

import Card from "@/ui-kit/Card";
import { Button } from "@/ui-kit/buttons";
import { chainBalanceAtom, exchangeRatesAtom } from "@/store";
import ConnectWallet from "./ConnectWallet";
import { useNotifications } from "@/hooks";
import ConfirmDialog from "./ConfirmDialog";

const UnStaking: React.FC = () => {
  const { addNotification } = useNotifications();
  const setBalance = useSetAtom(chainBalanceAtom);
  const { account } = useWallet();
  const [unstakeAmount, setUnstakeAmount] = useState<string>("");
  const [showConfirmUnstake, setShowConfirmUnstake] = useState(false);
  const [overLimit, setOverLimit] = useState(false);

  const { availableLDOT } = useAtomValue(chainBalanceAtom);
  const { LDOTToDOTExchangeRate: exchangeRate } =
    useAtomValue(exchangeRatesAtom);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let isValid = value === "" || /^(\d+\.?\d*|\.\d+)$/.test(value);

    // convert to number and check if it is less than availableDOT
    if (isValid) {
      setOverLimit(Number(value) > Number(availableLDOT));
      setUnstakeAmount(value);
    }
  };

  const handleUnstake = () => {
    return new Promise<void>((resolve) => {
      addNotification({
        title: "Unstaking DOT",
        message: "Transaction is pending...",
      });

      setTimeout(() => {
        addNotification({
          title: "Unstaking DOT",
          message: "Transaction is complete!",
        });

        resolve();
        setBalance((prev) => ({
          ...prev,
          availableDOT: prev.availableLDOT - Number(unstakeAmount),
          DOTInFlight: prev.DOTInFlight + Number(DOTToRecieve),
        }));
        setShowConfirmUnstake(false);
        setUnstakeAmount("");
      }, 5000);
    });
  };

  const DOTToRecieve = useMemo(
    () =>
      unstakeAmount && !overLimit ? Number(unstakeAmount) * exchangeRate : "--",
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
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirmUnstake(true);
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
                value={unstakeAmount}
                onChange={handleInputChange}
                placeholder="Amount of LDOT"
                className="pl-10 p-2 py-4 border-0 rounded-2xl w-full"
                disabled={!account}
              />
            </div>
            <span className={`text-red-500 ${overLimit ? "" : "hidden"}`}>
              Entered amount exceeds available LDOT
            </span>
            {account ? (
              <Button
                type="submit"
                disabled={overLimit || unstakeAmount === ""}
              >
                Unstake
              </Button>
            ) : (
              <ConnectWallet />
            )}
          </div>
        </form>

        <div>
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex justify-between">
              <strong>Exchange rate:</strong>
              <span>1:{exchangeRate}</span>
            </div>
            <div className="flex justify-between">
              <strong>You will receive:</strong>
              <span>{DOTToRecieve} DOT</span>
            </div>
          </div>
        </div>
      </Card>

      {showConfirmUnstake && (
        <ConfirmDialog
          title="Confirm Unstaking LDOT"
          message={`Unstake ${unstakeAmount} LDOT`}
          extraMessage={
            <span className="flex items-center">
              <FontAwesomeIcon icon={faWarning} className="mr-2" />
              <span>
                Be aware that your DOT will be in flight for 7 days before they
                become claimable.
              </span>
            </span>
          }
          onCancel={() => setShowConfirmUnstake(false)}
          onConfirm={handleUnstake}
        />
      )}
    </div>
  );
};

export default UnStaking;
