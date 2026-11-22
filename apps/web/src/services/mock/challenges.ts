import type { ChallengeService } from "../contracts";
import { ServiceError } from "../errors";
import { getDb, latency, mutateDb } from "./storage";

export const mockChallengeService: ChallengeService = {
  async list() {
    await latency(80, 200);
    return structuredClone(getDb().challenges);
  },

  async setParticipation(challengeId, userId, join) {
    await latency();
    return mutateDb((db) => {
      const challenge = db.challenges.find((c) => c.id === challengeId);
      if (!challenge) throw new ServiceError("This challenge is no longer available.", "NOT_FOUND");
      if (new Date(challenge.endDate).getTime() < Date.now()) throw new ServiceError("This challenge has already ended.", "VALIDATION");
      const without = challenge.participantIds.filter((id) => id !== userId);
      challenge.participantIds = join ? [...without, userId] : without;
      return structuredClone(challenge);
    });
  },
};
