"use client";

import Image from "next/image";
import { useState } from "react";
import { useWallet, useAllWallets } from "useink";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

import { Button, DropdownButton } from "@/ui-kit/buttons";
import Modal from "@/ui-kit/Modal";

function getShortAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

function Wallet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { account, connect, disconnect, accounts, setAccount } = useWallet();
  const wallets = useAllWallets();

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
      <DropdownButton
        icon={faWallet}
        text={`${getShortAddress(account.address)} ${
          account.name ? ` | ${account.name}` : ""
        }`}
        dropdownActions={[
          ...walletActions,
          {
            text: "Disconnect",
            onClick: disconnect,
          },
        ]}
      />
    );
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Connect Wallet</Button>
      <Modal
        title="Connect Wallet"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets.map((w) => (
            <button
              key={w.title}
              onClick={() => {
                setIsModalOpen(false);

                w.installed
                  ? connect(w.extensionName)
                  : window.open(w.installUrl);
              }}
              className="flex flex-col items-center bg-gray-100 p-4 rounded-2xl transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="mb-2">
                <Image
                  src={w.logo.src}
                  alt={w.logo.alt}
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-primary font-semibold">
                {w.installed ? `Connect to ${w.title}` : `Install ${w.title}`}
              </span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}

export default Wallet;
