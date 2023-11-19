import Modal from "@/ui-kit/Modal";
import React, { ReactElement, useState } from "react";

interface Props {
  title: string;
  message: string;
  extraMessage?: string | ReactElement;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}
const ConfirmDialog: React.FC<Props> = ({
  title,
  message,
  extraMessage,
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
      <p>Are you sure you want to {message}?</p>
      {extraMessage ? <p>{extraMessage}</p> : null}
    </Modal>
  );
};

export default ConfirmDialog;
