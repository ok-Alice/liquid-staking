import { useAtom } from "jotai";

import { notificationsAtom } from "@/store";
import { Notification } from "@/types";

const useNotifications = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = (
    title: string,
    message: string,
    duration: number | undefined = 0
  ) => {
    const newNotification: Notification = {
      title,
      message,
      duration,
      id: Date.now().toString(),
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return { notifications, addNotification, removeNotification };
};

export default useNotifications;
