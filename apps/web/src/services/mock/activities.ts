import type { ActivityService } from "../contracts";
import { ServiceError } from "../errors";
import { pushNotification } from "./notify";
import { getDb, latency, mutateDb } from "./storage";

export const mockActivityService: ActivityService = {
  async list() {
    await latency(80, 200);
    return structuredClone(getDb().activities).sort((a, b) => a.date.localeCompare(b.date));
  },

  async toggleJoin(activityId, userId) {
    await latency();
    return mutateDb((db) => {
      const activity = db.activities.find((a) => a.id === activityId);
      if (!activity) throw new ServiceError("This activity is no longer available.", "NOT_FOUND");
      if (activity.organizerId === userId) throw new ServiceError("You're organising this one!", "VALIDATION");
      if (activity.participantIds.includes(userId)) {
        activity.participantIds = activity.participantIds.filter((id) => id !== userId);
      } else {
        if (activity.participantIds.length >= activity.spots) throw new ServiceError("All spots are taken.", "VALIDATION");
        activity.participantIds.push(userId);
        pushNotification(db, {
          recipientId: activity.organizerId,
          actorId: userId,
          type: "community",
          activityId,
          message: `joined your ${activity.title}`,
        });
      }
      return structuredClone(activity);
    });
  },
};
