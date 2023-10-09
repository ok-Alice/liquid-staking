"use client";

import React, { useEffect, useState } from "react";
import { useApi, useBalance, useWallet } from "useink";
import { Polkadot } from "useink/chains";
import { planckToDecimalFormatted } from "useink/utils";

const emptyBalance = "--";

const UserBalance: React.FC = () => {
  const apiPromise = useApi(Polkadot.id);
  const { account } = useWallet();

  const [chainBalance, setChainBalance] = useState<string>(emptyBalance);
  const [liquidBalance, setUserLiquidBalance] = useState<string>(emptyBalance);
  const [exchangeRate, setExchangeRate] = useState<string>(emptyBalance);

  const balance = useBalance(account, Polkadot.id);

  useEffect(() => {
    if (account) {
      setChainBalance(
        balance
          ? planckToDecimalFormatted(balance.freeBalance, {
              api: apiPromise?.api,
            }) ?? emptyBalance
          : emptyBalance
      );
    } else {
      setChainBalance(emptyBalance);
      setUserLiquidBalance(emptyBalance);
      setExchangeRate(emptyBalance);
    }
  }, [account, balance, apiPromise]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Your Wallet</h2>
      <div className="flex flex-col space-y-2 border-t border-b border-gray-200 pt-2 pb-2">
        <div className="flex justify-between">
          <strong>Available DOT:</strong>
          {chainBalance}
        </div>
        <div className="flex justify-between">
          <strong>Acquired LDOT:</strong> {liquidBalance}
        </div>
        <div className="flex justify-between">
          <strong>Exchange Rate:</strong> {exchangeRate}
        </div>
      </div>
    </div>
  );
};

export default UserBalance;
