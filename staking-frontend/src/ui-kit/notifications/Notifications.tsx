"use client";

import React from "react";
import { useNotifications } from "@/hooks";
import Notification from "./Notification";

const Notifications: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <div className="fixed z-50 bottom-5 right-5 md:bottom-10 md:right-10 flex flex-col-reverse items-end space-y-reverse space-y-2">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default Notifications;
