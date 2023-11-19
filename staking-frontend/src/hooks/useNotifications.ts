import { useAtom } from "jotai";

import { notificationsAtom } from "@/store";
import { Notification } from "@/types";

const useNotifications = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = ({ title, message, duration }: Notification) => {
    // Create random id
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      title,
      message,
      duration: duration ? duration : 5000,
      id,
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};

export default useNotifications;
