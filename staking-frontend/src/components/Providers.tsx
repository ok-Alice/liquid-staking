"use client";
import React from "react";
import { UseInkProvider } from "useink";
import { Polkadot, ShibuyaTestnet, WestendTestnet } from "useink/chains";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <UseInkProvider
        config={{
          dappName: "OkAlice Liquid Staking Platform",
          chains: [ShibuyaTestnet, Polkadot, WestendTestnet],
        }}
      >
        {children}
      </UseInkProvider>
    </>
  );
};

export default Providers;
