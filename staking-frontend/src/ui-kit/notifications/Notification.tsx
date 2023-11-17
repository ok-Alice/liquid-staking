import { useEffect } from "react";

import { useNotifications } from "@/hooks";
import { Notification as NotificationType } from "@/types";

import CloseIcon from "../icons/close-icon.svg";

interface Props {
  notification: NotificationType;
}

const Notification: React.FC<Props> = ({ notification }) => {
  const { removeNotification } = useNotifications();

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, removeNotification]);

  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{notification.title}</h4>
        <button
          onClick={() => removeNotification(notification.id)}
          className="ml-4 flex-shrink-0"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
      <p className="text-sm text-gray-600 py-1">{notification.message}</p>
    </div>
  );
};

export default Notification;
