"use client";

import Image from "next/image";
import { useState } from "react";
import { useAllWallets, useWallet } from "useink";

import Modal from "@/ui-kit/Modal";
import { Button } from "@/ui-kit/buttons";

const ConnectWallet = () => {
  const wallets = useAllWallets();
  const { connect } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
};

export default ConnectWallet;
