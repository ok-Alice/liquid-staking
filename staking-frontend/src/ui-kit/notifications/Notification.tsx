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
    let timer;
    if (notification.duration) {
      timer = setTimeout(() => {
        removeNotification(notification.id as string);
      }, notification.duration);
    }

    return () => {
      clearTimeout(notification.timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification.id]);

  // Determine border color based on notification type
  const borderColor =
    notification.type === "error"
      ? "border-error-500"
      : notification.type === "warning"
      ? "border-warning-500"
      : notification.type === "success"
      ? "border-success-500"
      : "border-sky-500"; // Default to 'info' type

  return (
    <div
      className={`bg-white p-3 rounded-2xl shadow-md border-2 ${borderColor}`}
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{notification.title}</h4>
        <button
          onClick={() => removeNotification(notification.id as string)}
          className="ml-4 flex-shrink-0"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
      <p className="text-md text-gray-600 py-1">{notification.message}</p>
    </div>
  );
};

export default Notification;
