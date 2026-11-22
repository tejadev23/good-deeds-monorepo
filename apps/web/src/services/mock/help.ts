import { createId } from "@/lib/utils";
import type { HelpRequest } from "@/types";

import type { HelpService } from "../contracts";
import { ServiceError } from "../errors";
import { pushNotification, removeNotifications } from "./notify";
import type { MockDatabase } from "./schema";
import { getDb, latency, mutateDb } from "./storage";

function findRequest(db: MockDatabase, id: string): HelpRequest {
  const request = db.helpRequests.find((r) => r.id === id);
  if (!request) throw new ServiceError("This request is no longer available.", "NOT_FOUND");
  return request;
}

export const mockHelpService: HelpService = {
  async list() {
    await latency(80, 200);
    return structuredClone(getDb().helpRequests).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(authorId, input) {
    await latency(400, 700);
    if (input.title.trim().length < 4 || input.description.trim().length < 10) {
      throw new ServiceError("Add a clear title and a few words about what you need.", "VALIDATION");
    }
    const request: HelpRequest = {
      id: createId("h"),
      authorId,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      location: input.location.trim(),
      neededBy: input.neededBy,
      helpersNeeded: Math.max(1, Math.min(50, Math.round(input.helpersNeeded))),
      offers: [],
      status: "open",
      createdAt: new Date().toISOString(),
    };
    mutateDb((db) => {
      db.helpRequests.unshift(request);
    });
    return request;
  },

  async offer(requestId, userId, message) {
    await latency();
    return mutateDb((db) => {
      const request = findRequest(db, requestId);
      if (request.authorId === userId) throw new ServiceError("This is your own request.", "VALIDATION");
      if (request.status !== "open") throw new ServiceError("This request has already been fulfilled.", "VALIDATION");
      if (!request.offers.some((o) => o.userId === userId)) {
        const trimmed = message?.trim().slice(0, 280) || undefined;
        request.offers.push({ userId, message: trimmed, createdAt: new Date().toISOString() });
        pushNotification(db, { recipientId: request.authorId, actorId: userId, type: "help", helpRequestId: requestId, message: trimmed });
      }
      return structuredClone(request);
    });
  },

  async withdraw(requestId, userId) {
    await latency();
    return mutateDb((db) => {
      const request = findRequest(db, requestId);
      request.offers = request.offers.filter((o) => o.userId !== userId);
      removeNotifications(db, (n) => n.type === "help" && n.helpRequestId === requestId && n.actorId === userId);
      return structuredClone(request);
    });
  },

  async setFulfilled(requestId, userId, fulfilled) {
    await latency();
    return mutateDb((db) => {
      const request = findRequest(db, requestId);
      if (request.authorId !== userId) throw new ServiceError("Only the person who asked can update this.", "FORBIDDEN");
      request.status = fulfilled ? "fulfilled" : "open";
      return structuredClone(request);
    });
  },
};
