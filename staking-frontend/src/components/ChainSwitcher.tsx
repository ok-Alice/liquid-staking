"use client";

import React, { useState } from "react";
import { useApi } from "useink";
import { ChainId } from "useink/chains";

import DropdownButton from "@/ui-kit/buttons/DropdownButton";

const ChainSwitcher: React.FC = () => {
  const [selectedChain, setSelectedChain] =
    useState<ChainId>("shibuya-testnet");
  const api = useApi(selectedChain);

  const handleChainChange = (chain: ChainId) => {
    setSelectedChain(chain);
  };

  let statusColor = "bg-red-500";
  if (api) {
    if (api.api?.isConnected) {
      statusColor = "bg-green-500";
    }
  }

  return (
    <DropdownButton
      text={
        <>
          <span className="relative">
            <span
              className={`${statusColor} rounded-full inline-block w-3 h-3 absolute top-[56%] transform -translate-y-1/2 left-0`}
            ></span>
            <span className="ml-4">{selectedChain}</span>
          </span>
        </>
      }
      dropdownActions={[
        {
          text: "Shibuya-testnet",
          onClick: () => handleChainChange("shibuya-testnet"),
        },
        {
          text: "Polkadot",
          onClick: () => handleChainChange("polkadot"),
        },
        {
          text: "Westend-testnet",
          onClick: () => handleChainChange("westend-testnet"),
        },
      ]}
    ></DropdownButton>
  );
};

export default ChainSwitcher;
