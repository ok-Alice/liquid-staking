"use client";

import { useAtomValue, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { useWallet } from "useink";

import { useNotifications } from "@/hooks";
import { chainBalanceAtom } from "@/store";

const AccountListener: React.FC = () => {
  const { account } = useWallet();
  const { addNotification } = useNotifications();

  const { claimableDOT, DOTInFlight } = useAtomValue(chainBalanceAtom);
  const setBalance = useSetAtom(chainBalanceAtom);

  useEffect(() => {
    console.log(claimableDOT);
    if (account && claimableDOT) {
      addNotification({
        title: "Claimable DOT",
        message: `You have ${claimableDOT} DOT to claim`,
        type: "info",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, claimableDOT]);

  useEffect(() => {
    if (account && DOTInFlight) {
      addNotification({
        title: "DOT In Flight",
        message: `You have ${DOTInFlight} DOT in flight`,
        type: "info",
      });

      setTimeout(() => {
        setBalance((prev) => ({
          ...prev,
          claimableDOT: prev.claimableDOT + DOTInFlight,
          DOTInFlight: 0,
        }));

        addNotification({
          title: "DOT In Flight",
          message: `Your ${DOTInFlight} DOT has landed`,
          type: "info",
        });
      }, 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, DOTInFlight]);

  return null;
};

export default AccountListener;
