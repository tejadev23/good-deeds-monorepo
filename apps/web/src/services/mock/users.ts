import type { UserService } from "../contracts";
import { ServiceError } from "../errors";
import { pushNotification, removeNotifications } from "./notify";
import { getDb, latency, mutateDb } from "./storage";

export const mockUserService: UserService = {
  async list() {
    await latency(60, 140);
    return structuredClone(getDb().users);
  },

  async listFollows() {
    return structuredClone(getDb().follows);
  },

  async follow(followerId, targetId) {
    await latency();
    if (followerId === targetId) throw new ServiceError("You can't follow yourself.", "VALIDATION");
    return mutateDb((db) => {
      const existing = db.follows.find((f) => f.followerId === followerId && f.followingId === targetId);
      if (existing) return existing;
      const follow = { followerId, followingId: targetId, createdAt: new Date().toISOString() };
      db.follows.push(follow);
      pushNotification(db, { recipientId: targetId, actorId: followerId, type: "follow" });
      return follow;
    });
  },

  async unfollow(followerId, targetId) {
    await latency();
    mutateDb((db) => {
      db.follows = db.follows.filter((f) => !(f.followerId === followerId && f.followingId === targetId));
      removeNotifications(db, (n) => n.type === "follow" && n.actorId === followerId && n.recipientId === targetId && !n.read);
    });
  },
};
