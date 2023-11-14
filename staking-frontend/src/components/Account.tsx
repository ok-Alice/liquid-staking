"use client";

import { useWallet } from "useink";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

import { DropdownButton } from "@/ui-kit/buttons";
import ConnectWallet from "./ConnectWallet";
import ChainBalance from "./ChainBalance";
import React from "react";

function getShortAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

const Account: React.FC = () => {
  const { account, disconnect, accounts, setAccount } = useWallet();

  const walletActions = [];

  if (accounts?.length) {
    for (const a of accounts) {
      walletActions.push({
        text: `${a.name ? a.name : getShortAddress(a.address)}`,
        onClick: () => setAccount(a),
      });
    }
  }

  if (account) {
    return (
      <div className="flex items-center">
        <div className="mr-3">
          <ChainBalance showIcon />
        </div>

        <DropdownButton
          icon={faWallet}
          text={`${
            account.name ? account.name : getShortAddress(account.address)
          }`}
          dropdownActions={[
            ...walletActions,
            {
              text: "Disconnect",
              onClick: disconnect,
            },
          ]}
        />
      </div>
    );
  } else {
    return <ConnectWallet />;
  }
};

export default Account;
