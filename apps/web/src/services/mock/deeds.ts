import { createId } from "@/lib/utils";
import type { Deed } from "@/types";

import type { DeedService } from "../contracts";
import { ServiceError } from "../errors";
import { pushNotification, removeNotifications } from "./notify";
import { getDb, latency, mutateDb } from "./storage";
import type { MockDatabase } from "./schema";

function findDeed(db: MockDatabase, deedId: string): Deed {
  const deed = db.deeds.find((d) => d.id === deedId);
  if (!deed) throw new ServiceError("This deed is no longer available.", "NOT_FOUND");
  return deed;
}

export const mockDeedService: DeedService = {
  async list() {
    await latency(150, 380);
    return structuredClone(getDb().deeds);
  },

  async create(authorId, input) {
    await latency(500, 800);
    if (!input.title.trim() || !input.description.trim()) {
      throw new ServiceError("Please add a title and a short description.", "VALIDATION");
    }
    const deed: Deed = {
      id: createId("d"),
      authorId,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      images: input.images,
      location: input.location?.trim() || undefined,
      activityDate: input.activityDate,
      createdAt: new Date().toISOString(),
      likedBy: [],
      communityLikes: 0,
      inspiredById: input.inspiredById,
      challenge: input.challenge && input.challenge.amount > 0 ? input.challenge : undefined,
    };
    mutateDb((db) => {
      db.deeds.unshift(deed);
      const origin = deed.inspiredById ? db.deeds.find((d) => d.id === deed.inspiredById) : undefined;
      if (origin) {
        pushNotification(db, { recipientId: origin.authorId, actorId: authorId, type: "ripple", deedId: deed.id, message: origin.title });
      }
      const challenge = deed.challenge ? db.challenges.find((c) => c.id === deed.challenge?.challengeId) : undefined;
      if (challenge && !challenge.participantIds.includes(authorId)) challenge.participantIds.push(authorId);
    });
    return deed;
  },

  async remove(deedId, userId) {
    await latency();
    mutateDb((db) => {
      const deed = findDeed(db, deedId);
      if (deed.authorId !== userId) throw new ServiceError("You can only delete your own deeds.", "FORBIDDEN");
      db.deeds = db.deeds.filter((d) => d.id !== deedId).map((d) => (d.inspiredById === deedId ? { ...d, inspiredById: undefined } : d));
      db.comments = db.comments.filter((c) => c.deedId !== deedId);
      removeNotifications(db, (n) => n.deedId === deedId);
      Object.keys(db.saves).forEach((uid) => {
        db.saves[uid] = db.saves[uid].filter((id) => id !== deedId);
      });
      db.users = db.users.map((u) => (u.featuredDeedId === deedId ? { ...u, featuredDeedId: undefined } : u));
    });
  },

  async toggleLike(deedId, userId) {
    await latency(60, 160);
    return mutateDb((db) => {
      const deed = findDeed(db, deedId);
      if (deed.likedBy.includes(userId)) {
        deed.likedBy = deed.likedBy.filter((id) => id !== userId);
        removeNotifications(db, (n) => n.type === "like" && n.deedId === deedId && n.actorId === userId);
      } else {
        deed.likedBy.push(userId);
        pushNotification(db, { recipientId: deed.authorId, actorId: userId, type: "like", deedId });
      }
      return structuredClone(deed);
    });
  },

  async listComments() {
    return structuredClone(getDb().comments);
  },

  async addComment(deedId, authorId, text) {
    await latency(200, 400);
    const trimmed = text.trim();
    if (!trimmed) throw new ServiceError("Write something kind first 🙂", "VALIDATION");
    return mutateDb((db) => {
      const deed = findDeed(db, deedId);
      const comment = { id: createId("c"), deedId, authorId, text: trimmed.slice(0, 500), createdAt: new Date().toISOString() };
      db.comments.push(comment);
      pushNotification(db, { recipientId: deed.authorId, actorId: authorId, type: "comment", deedId, message: comment.text });
      return comment;
    });
  },

  async listSaved(userId) {
    return [...(getDb().saves[userId] ?? [])];
  },

  async toggleSave(deedId, userId) {
    await latency(60, 140);
    return mutateDb((db) => {
      const saved = db.saves[userId] ?? [];
      db.saves[userId] = saved.includes(deedId) ? saved.filter((id) => id !== deedId) : [deedId, ...saved];
      return [...db.saves[userId]];
    });
  },
};
