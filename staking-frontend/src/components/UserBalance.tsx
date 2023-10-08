"use client";

import React, { useEffect, useState } from "react";
import { useApi, useBalance, useWallet } from "useink";
import { Polkadot, ShibuyaTestnet } from "useink/chains";
import { planckToDecimalFormatted } from "useink/utils";

const UserBalance: React.FC = () => {
  const apiPromise = useApi(ShibuyaTestnet.id);
  const { account } = useWallet();

  const [chainBalance, setChainBalance] = useState<string>("--");
  const [liquidBalance, setUserLiquidBalance] = useState<string>("--");
  const [userRewards, setUserRewards] = useState<string>("--");

  const balance = useBalance(account, ShibuyaTestnet.id);

  useEffect(() => {
    if (account) {
      setChainBalance(
        balance
          ? planckToDecimalFormatted(balance.freeBalance, {
              api: apiPromise?.api,
              decimals: 4,
            }) || "--"
          : "--"
      );
    } else {
      setChainBalance("--");
      setUserLiquidBalance("--");
      setUserRewards("--");
    }
  }, [account, balance, apiPromise]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Your Wallet</h2>
      <div className="flex flex-col space-y-2 border-t border-b border-gray-200 pt-2 pb-2">
        <div className="flex justify-between">
          <strong>DOT available:</strong>
          {chainBalance}
        </div>
        <div className="flex justify-between">
          <strong>Liquid Tokens:</strong> {liquidBalance}
        </div>
        <div className="flex justify-between">
          <strong>Rewards:</strong> {userRewards}
        </div>
      </div>
    </div>
  );
};

export default UserBalance;
