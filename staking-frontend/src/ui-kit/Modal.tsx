import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./buttons";
import Spinner from "./Spinner";

interface ModalProps {
  title: string;
  isOpen: boolean;
  closeMessage?: string;
  onClose: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  closeMessage = "Close",
  onClose,
  onCancel,
  children,
  size = "md",
  isLoading = false,
}) => {
  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "w-[90%] sm:w-3/5 md:w-2/4 lg:w-1/3 xl:w-1/4";
      case "lg":
        return "w-[90%] sm:w-2/3 md:w-1/3 lg:w-1/2 xl:w-1/2";
      default: // md
        return "w-[90%] sm:w-3/4 md:w-2/3 lg:w-[40%] xl:w-1/4";
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel ? onCancel : onClose}
      className="fixed inset-0 z-50 overflow-auto"
    >
      <div className="flex items-start justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50" />

        <div
          className={`relative bg-white mx-auto mt-20 rounded-2xl ${getSizeClass(
            size
          )} flex-shrink-0`}
        >
          <Dialog.Title className="text-2xl font-semibold p-4">
            {title}
          </Dialog.Title>

          <div className="border-b-[2px]" />

          <div className="p-6">
            <div className="text-gray-800">{children}</div>
          </div>

          <div className="border-b-[2px]" />

          <div className="p-4">
            <div className="flex justify-end gap-2">
              {!!onCancel && (
                <Button
                  onClick={onCancel}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={onClose}
                disabled={isLoading}
                variant="primary"
                className="flex justify-between align-center gap-3"
              >
                <span>{closeMessage}</span>
                {isLoading && <Spinner color="white" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
