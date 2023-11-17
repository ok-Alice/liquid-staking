"use client";

import React from "react";
import { useWallet } from "useink";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtomValue } from "jotai";

import { chainBalanceAtom } from "@/store";

interface Props {
  showIcon?: boolean;
}

const EMPTY_BALANCE = "-- DOT";

const ChainBalance: React.FC<Props> = ({ showIcon }: Props) => {
  const { availableDOT } = useAtomValue(chainBalanceAtom);
  const { account } = useWallet();

  return (
    <span className="flex items-center">
      {showIcon && <FontAwesomeIcon icon={faCoins} className="mr-2" />}
      {account ? `${availableDOT} DOT` : EMPTY_BALANCE}
    </span>
  );
};

export default ChainBalance;
