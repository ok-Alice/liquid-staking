import React, { useEffect, useRef } from "react";

import { Button } from "./buttons";
import CloseIcon from "public/close-icon.svg";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-start">
      <div
        ref={modalRef}
        className="relative p-6 bg-white mx-auto mt-20 rounded-2xl w-1/3 flex-shrink-0"
      >
        <div className="flex justify-between items-center mb-4 -mt-6 -me-6">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <span className="p-4 cursor-pointer" onClick={onClose}>
            <CloseIcon className="h-8 w-8 font-semibold" />
          </span>
        </div>
        <div className="mb-4 text-gray-800">{children}</div>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="primary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
