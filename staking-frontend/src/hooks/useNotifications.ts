import { useAtom } from "jotai";

import { notificationsAtom } from "@/store";
import { Notification } from "@/types";

const useNotifications = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = ({ id, title, message, duration }: Notification) => {
    // if there is already a notification with the same id, don't add it
    if (id && notifications.find((notification) => notification.id === id))
      return;

    const newNotification: Notification = {
      title,
      message,
      duration,
      id: id ? id : Date.now().toString(),
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  console.log(notifications);

  return { notifications, addNotification, removeNotification };
};

export default useNotifications;
