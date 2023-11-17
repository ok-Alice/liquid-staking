"use client";
import React from "react";
import { useWallet } from "useink";
import { useAtomValue } from "jotai";
import Card from "@/ui-kit/Card";
import { Button } from "@/ui-kit/buttons";
import ConnectWallet from "./ConnectWallet";

import { chainBalanceAtom } from "@/store";

const Claiming: React.FC = () => {
  const { account } = useWallet();

  const { DOTInFlight, claimableDOT } = useAtomValue(chainBalanceAtom);

  const handleClaim = async () => {
    // Your claim logic here
  };

  return (
    <div className="flex flex-col w-full items-center">
      <Card small className="bg-sky-900/20 rounded-t-2xl shadow-lg p-8 pt-4">
        <div className="flex justify-between text-white font-bold">
          <div>
            <h2 className="font-semibold mb-2 text-center">DOT In Flight</h2>
            {account ? DOTInFlight : "--"} DOT
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-center">Claimable DOT</h2>
            {account ? claimableDOT : "--"} DOT
          </div>
        </div>
      </Card>
      <Card small containerClassName="-mt-4">
        <div className="flex flex-col space-y-4">
          {account ? (
            <Button onClick={handleClaim} disabled={!claimableDOT}>
              Claim Available DOT
            </Button>
          ) : (
            <ConnectWallet />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Claiming;
