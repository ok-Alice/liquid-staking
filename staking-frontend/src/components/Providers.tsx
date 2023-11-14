"use client";
import React from "react";
import { UseInkProvider } from "useink";
import { Polkadot, ShibuyaTestnet, WestendTestnet } from "useink/chains";

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }: Props) => {
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
