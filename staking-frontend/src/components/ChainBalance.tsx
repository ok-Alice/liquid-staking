"use client";

import React, { useEffect, useState } from "react";
import { useApi, useBalance, useWallet } from "useink";
import { Polkadot } from "useink/chains";
import { planckToDecimalFormatted } from "useink/utils";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  showIcon?: boolean;
}

const EMPTY_BALANCE = "-- DOT";

const ChainBalance: React.FC<Props> = ({ showIcon }: Props) => {
  const [chainBalance, setChainBalance] = useState<string>(EMPTY_BALANCE);
  const { account } = useWallet();
  const balance = useBalance(account, Polkadot.id);
  const apiPromise = useApi(Polkadot.id);

  useEffect(() => {
    if (account) {
      setChainBalance(
        balance
          ? planckToDecimalFormatted(balance.freeBalance, {
              api: apiPromise?.api,
            }) ?? EMPTY_BALANCE
          : EMPTY_BALANCE
      );
    } else {
      setChainBalance(EMPTY_BALANCE);
    }
  }, [account, balance, apiPromise]);

  return (
    <span className="flex items-center">
      {showIcon && <FontAwesomeIcon icon={faCoins} className="mr-2" />}
      {chainBalance}
    </span>
  );
};

export default ChainBalance;
