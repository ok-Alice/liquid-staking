import Modal from "@/ui-kit/Modal";
import React, { useState } from "react";

interface Props {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}
const ConfirmDialog: React.FC<Props> = ({
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    setIsLoading(true);
    onConfirm().then(() => {
      setIsLoading(false);
    });
  };

  return (
    <Modal
      isOpen={true}
      title={title}
      onCancel={onCancel}
      onClose={onClose}
      closeMessage="Submit"
      size="sm"
      isLoading={isLoading}
    >
      Are you sure you want to {message}?
    </Modal>
  );
};

export default ConfirmDialog;
