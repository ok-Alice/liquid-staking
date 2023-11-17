"use client";

import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import { useWallet } from "useink";

import { useNotifications } from "@/hooks";
import { chainBalanceAtom } from "@/store";

const AccountListener: React.FC = () => {
  const { account } = useWallet();
  const { addNotification } = useNotifications();

  const { claimableDOT } = useAtomValue(chainBalanceAtom);
  useEffect(() => {
    if (account && claimableDOT) {
      addNotification({
        id: "claimableDOT",
        title: "Claimable DOT",
        message: `You have ${claimableDOT} DOT to claim`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, claimableDOT]);

  return null;
};

export default AccountListener;
