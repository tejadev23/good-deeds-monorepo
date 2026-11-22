import { Router } from "express";
import type { User } from "@repo/database";
import { deviceTokenSchema, onboardingSchema, updateProfileSchema, usernameSchema, type MeDto } from "@repo/shared";
import type { AppContext } from "../../context";
import { currentUser, requireAuth, requireMember } from "../../middleware/auth";
import { conflict, forbidden } from "../../lib/errors";
import { parse } from "../../lib/validate";

function toMeDto(user: User): MeDto {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    onboarded: user.onboardedAt !== null,
  };
}

export function meRouter({ db }: AppContext) {
  const router = Router();
  router.use(requireAuth);

  router.get("/", (req, res) => {
    res.json(toMeDto(currentUser(req)));
  });

  router.get("/username-available", async (req, res) => {
    const result = usernameSchema.safeParse(req.query.username);
    if (!result.success) {
      return res.json({ available: false, reason: result.error.issues[0]?.message });
    }
    const taken = await db.user.findUnique({ where: { username: result.data }, select: { id: true } });
    const me = currentUser(req);
    res.json({ available: !taken || taken.id === me.id });
  });

  /** One-time: pick a username and basics. Unlocks posting and following. */
  router.post("/onboarding", async (req, res) => {
    const me = currentUser(req);
    if (me.onboardedAt) throw conflict("Profile is already set up");
    const input = parse(onboardingSchema, req.body);

    const taken = await db.user.findUnique({ where: { username: input.username }, select: { id: true } });
    if (taken) throw conflict("That username is taken");

    const user = await db.user.update({
      where: { id: me.id },
      data: { ...input, onboardedAt: new Date() },
    });
    res.status(201).json(toMeDto(user));
  });

  router.patch("/", requireMember, async (req, res) => {
    const input = parse(updateProfileSchema, req.body);
    const user = await db.user.update({ where: { id: currentUser(req).id }, data: input });
    res.json(toMeDto(user));
  });

  router.put("/devices", requireMember, async (req, res) => {
    const input = parse(deviceTokenSchema, req.body);
    const me = currentUser(req);
    const existing = await db.deviceToken.findUnique({ where: { token: input.token } });
    if (existing && existing.userId !== me.id) {
      // Same phone, new account: hand the token over to whoever is signed in now.
      await db.deviceToken.delete({ where: { token: input.token } });
    }
    await db.deviceToken.upsert({
      where: { token: input.token },
      update: { lastSeenAt: new Date(), platform: input.platform },
      create: { ...input, userId: me.id },
    });
    res.status(204).end();
  });

  router.delete("/devices/:token", async (req, res) => {
    const me = currentUser(req);
    const token = await db.deviceToken.findUnique({ where: { token: String(req.params.token) } });
    if (token && token.userId !== me.id) throw forbidden();
    await db.deviceToken.deleteMany({ where: { token: String(req.params.token), userId: me.id } });
    res.status(204).end();
  });

  return router;
}
