import * as React from "react";
import type { Notification } from ".prisma/client";

import { Modal, ModalProps } from "components/Modal";
import { useSession } from "lib/auth/client";

interface Props extends Pick<ModalProps, "isOpen" | "onClose"> {
  notifications: Notification[];
}

export const NotificationsModal = ({ notifications, isOpen, onClose }: Props) => {
  const { user } = useSession();

  if (!user) {
    return null;
  }

  return (
    <Modal
      style={{ scrollbarWidth: "thin", overflowY: "auto", maxHeight: "30em", width: "40em" }}
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="p-4 pt-0">
        <h1 className="sticky top-0 py-2 text-3xl dark:text-white font-bold bg-dark-gray">
          Notifications
        </h1>

        {notifications.length <= 0 ? (
          <p className="dark:text-white py-2">You are up to date.</p>
        ) : (
          notifications.map((notification) => {
            const dateFormat = Intl.DateTimeFormat([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour12: false,
            }).format(new Date(notification.createdAt));

            return (
              <div key={notification.id} className="py-2 dark:text-white">
                <h3 className="text-xl font-semibold mb-1">{notification.title}</h3>
                <p>{notification.description}</p>

                <span className="inline-block mt-1">{dateFormat}</span>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
