"use client";
import { useMemo, useState } from "react";
import Card from "@/ui-kit/Card";
import { Stake } from ".";
import ChainBalance from "./ChainBalance";

const Staking = () => {
  const [stakeAmount, setStakeAmount] = useState<string>("");

  const exchangeRate = 1.156;
  const transactionFee = "0.0001 DOT";

  const liquidBalancetoReceive = useMemo(
    () => (stakeAmount ? Number(stakeAmount) * Number(exchangeRate) : "--"),
    [stakeAmount]
  );

  return (
    <div className="flex flex-col w-full items-center">
      <Card small className="bg-sky-900/20 rounded-t-2xl shadow-lg p-8 pt-4">
        <div className="flex justify-between text-white font-bold">
          <div>
            <h2 className="font-semibold mb-2 text-center">Available DOT</h2>
            <ChainBalance />
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-center">Acquired LDOT</h2>
            2.4 LDOT
          </div>
        </div>
      </Card>
      <Card small containerClassName="-mt-4">
        <Stake stakeAmount={stakeAmount} setStakeAmount={setStakeAmount} />

        <div>
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex justify-between">
              <strong>You will receive</strong> {liquidBalancetoReceive} LDOT
            </div>
            <div className="flex justify-between">
              <strong>Exchange rate</strong> 1:{exchangeRate}
            </div>
            <div className="flex justify-between">
              <strong>Transaction cost</strong> {transactionFee}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Staking;
