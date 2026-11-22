import type { NotificationService } from "../contracts";
import { getDb, latency, mutateDb } from "./storage";

export const mockNotificationService: NotificationService = {
  async list(userId) {
    await latency(100, 250);
    return structuredClone(getDb().notifications.filter((n) => n.recipientId === userId)).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },

  async markRead(notificationId) {
    mutateDb((db) => {
      const n = db.notifications.find((item) => item.id === notificationId);
      if (n) n.read = true;
    });
  },

  async markAllRead(userId) {
    await latency(80, 160);
    mutateDb((db) => {
      db.notifications.forEach((n) => {
        if (n.recipientId === userId) n.read = true;
      });
    });
  },
};
