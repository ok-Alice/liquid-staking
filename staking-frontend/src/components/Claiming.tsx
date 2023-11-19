"use client";
import React, { useState } from "react";
import { useWallet } from "useink";
import { useAtomValue, useSetAtom } from "jotai";
import Card from "@/ui-kit/Card";
import { Button } from "@/ui-kit/buttons";
import ConnectWallet from "./ConnectWallet";

import { chainBalanceAtom } from "@/store";
import { useNotifications } from "@/hooks";
import ConfirmDialog from "./ConfirmDialog";

const Claiming: React.FC = () => {
  const { account } = useWallet();
  const { addNotification } = useNotifications();
  const [showConfirmClaim, setShowConfirmClaim] = useState(false);

  const { DOTInFlight, claimableDOT } = useAtomValue(chainBalanceAtom);
  const setBalance = useSetAtom(chainBalanceAtom);

  const handleClaim = async () => {
    return new Promise<void>((resolve) => {
      addNotification({
        title: "Claiming DOT",
        message: "Transaction is pending...",
        type: "warning",
      });

      setTimeout(() => {
        addNotification({
          title: "Claiming DOT",
          message: "Transaction is complete!",
          type: "success",
        });

        addNotification({
          title: "Claimed DOT",
          message: "DOT has been added to your account",
          type: "info",
        });

        resolve();
        setBalance((prev) => ({
          ...prev,
          availableDOT: prev.availableDOT + Number(prev.claimableDOT),
          claimableDOT: 0,
        }));
        setShowConfirmClaim(false);
      }, 5000);
    });
  };

  return (
    <div className="flex flex-col w-full items-center">
      <Card small className="bg-sky-900/20 rounded-t-2xl shadow-lg p-8 pt-4">
        <div className="flex justify-between text-white font-bold">
          <div>
            <h2 className="font-semibold mb-2">DOT In Flight</h2>
            {account ? DOTInFlight : "--"} DOT
          </div>

          <div>
            <h2 className="font-semibold mb-2">Claimable DOT</h2>
            {account ? claimableDOT : "--"} DOT
          </div>
        </div>
      </Card>
      <Card small containerClassName="-mt-4">
        <div className="flex flex-col space-y-4">
          {account ? (
            <Button
              onClick={() => {
                setShowConfirmClaim(true);
              }}
              disabled={!claimableDOT}
            >
              Claim Available DOT
            </Button>
          ) : (
            <ConnectWallet />
          )}
        </div>
      </Card>

      {showConfirmClaim && (
        <ConfirmDialog
          title="Confirm Claiming DOT"
          message={`claim ${claimableDOT} DOT`}
          onCancel={() => setShowConfirmClaim(false)}
          onConfirm={handleClaim}
        />
      )}
    </div>
  );
};

export default Claiming;
