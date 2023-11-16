import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./buttons";
import CloseIcon from "./icons/close-icon.svg";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-auto"
    >
      <div className="flex items-start justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50" />

        <div className="relative p-6 bg-white mx-auto mt-20 rounded-2xl w-1/3 flex-shrink-0">
          <Dialog.Title className="text-2xl font-semibold">
            {title}
          </Dialog.Title>
          <button onClick={onClose} className="absolute top-0 right-0 p-4">
            <CloseIcon className="h-8 w-8" />
          </button>

          <div className="mt-4 text-gray-800">{children}</div>

          <div className="flex justify-end mt-4">
            <Button onClick={onClose} variant="primary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
