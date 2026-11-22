import { Router } from "express";
import { paginationSchema, type ProfileDto } from "@repo/shared";
import type { AppContext } from "../../context";
import { currentUser, requireMember } from "../../middleware/auth";
import { badRequest, notFound } from "../../lib/errors";
import { stringParam } from "../../lib/http";
import { nextKeyCursor } from "../../lib/pagination";
import { toUserSummary, userSummarySelect, NO_VIEWER } from "../../lib/serializers";
import { parse } from "../../lib/validate";
import { notify } from "../notifications/notify";

export function usersRouter({ db }: AppContext) {
  const router = Router();

  async function findMember(username: string) {
    const user = await db.user.findUnique({ where: { username: username.toLowerCase() } });
    if (!user || !user.onboardedAt || user.status !== "ACTIVE") throw notFound("Person");
    return user;
  }

  router.get("/:username", async (req, res) => {
    const user = await findMember(stringParam(req, "username"));
    const viewerId = req.user?.id ?? NO_VIEWER;

    const [deeds, followers, following, likesReceived, ripplesInspired, vouches, viewerFollow, viewerVouch] =
      await Promise.all([
        db.deed.count({ where: { authorId: user.id, deletedAt: null, status: "PUBLISHED" } }),
        db.follow.count({ where: { followingId: user.id } }),
        db.follow.count({ where: { followerId: user.id } }),
        db.like.count({ where: { deed: { authorId: user.id, deletedAt: null } } }),
        db.deed.count({ where: { deletedAt: null, inspiredBy: { authorId: user.id }, authorId: { not: user.id } } }),
        db.vouch.count({ where: { vouchedId: user.id } }),
        db.follow.findUnique({ where: { followerId_followingId: { followerId: viewerId, followingId: user.id } } }),
        db.vouch.findUnique({ where: { voucherId_vouchedId: { voucherId: viewerId, vouchedId: user.id } } }),
      ]);

    const profile: ProfileDto = {
      ...toUserSummary(user),
      bio: user.bio,
      location: user.location,
      coverUrl: user.coverUrl,
      interests: user.interests,
      joinedAt: user.createdAt.toISOString(),
      stats: { deeds, followers, following, likesReceived, ripplesInspired, vouches },
      viewer: { isSelf: user.id === req.user?.id, following: viewerFollow !== null, vouched: viewerVouch !== null },
    };
    res.json(profile);
  });

  router.get("/:username/followers", async (req, res) => {
    const user = await findMember(stringParam(req, "username"));
    const { cursor, limit } = parse(paginationSchema, req.query);
    const rows = await db.follow.findMany({
      where: { followingId: user.id },
      include: { follower: { select: userSummarySelect } },
      orderBy: [{ createdAt: "desc" }, { followerId: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { followerId_followingId: { followerId: cursor, followingId: user.id } }, skip: 1 } : {}),
    });
    const page = nextKeyCursor(rows, limit, (row) => row.followerId);
    res.json({ items: page.rows.map((row) => toUserSummary(row.follower)), nextCursor: page.nextCursor });
  });

  router.get("/:username/following", async (req, res) => {
    const user = await findMember(stringParam(req, "username"));
    const { cursor, limit } = parse(paginationSchema, req.query);
    const rows = await db.follow.findMany({
      where: { followerId: user.id },
      include: { following: { select: userSummarySelect } },
      orderBy: [{ createdAt: "desc" }, { followingId: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { followerId_followingId: { followerId: user.id, followingId: cursor } }, skip: 1 } : {}),
    });
    const page = nextKeyCursor(rows, limit, (row) => row.followingId);
    res.json({ items: page.rows.map((row) => toUserSummary(row.following)), nextCursor: page.nextCursor });
  });

  router.put("/:username/follow", requireMember, async (req, res) => {
    const me = currentUser(req);
    const target = await findMember(stringParam(req, "username"));
    if (target.id === me.id) throw badRequest("You can't follow yourself");
    await db.follow.upsert({
      where: { followerId_followingId: { followerId: me.id, followingId: target.id } },
      update: {},
      create: { followerId: me.id, followingId: target.id },
    });
    await notify(db, { recipientId: target.id, actorId: me.id, type: "FOLLOW" });
    res.status(204).end();
  });

  router.delete("/:username/follow", requireMember, async (req, res) => {
    const me = currentUser(req);
    const target = await findMember(stringParam(req, "username"));
    await db.follow.deleteMany({ where: { followerId: me.id, followingId: target.id } });
    res.status(204).end();
  });

  router.put("/:username/vouch", requireMember, async (req, res) => {
    const me = currentUser(req);
    const target = await findMember(stringParam(req, "username"));
    if (target.id === me.id) throw badRequest("You can't vouch for yourself");
    await db.vouch.upsert({
      where: { voucherId_vouchedId: { voucherId: me.id, vouchedId: target.id } },
      update: {},
      create: { voucherId: me.id, vouchedId: target.id },
    });
    await notify(db, { recipientId: target.id, actorId: me.id, type: "VOUCH" });
    res.status(204).end();
  });

  router.delete("/:username/vouch", requireMember, async (req, res) => {
    const me = currentUser(req);
    const target = await findMember(stringParam(req, "username"));
    await db.vouch.deleteMany({ where: { voucherId: me.id, vouchedId: target.id } });
    res.status(204).end();
  });

  /** Blocking also removes follows in both directions. */
  router.put("/:username/block", requireMember, async (req, res) => {
    const me = currentUser(req);
    const target = await findMember(stringParam(req, "username"));
    if (target.id === me.id) throw badRequest("You can't block yourself");
    await db.$transaction([
      db.block.upsert({
        where: { blockerId_blockedId: { blockerId: me.id, blockedId: target.id } },
        update: {},
        create: { blockerId: me.id, blockedId: target.id },
      }),
      db.follow.deleteMany({
        where: {
          OR: [
            { followerId: me.id, followingId: target.id },
            { followerId: target.id, followingId: me.id },
          ],
        },
      }),
    ]);
    res.status(204).end();
  });

  router.delete("/:username/block", requireMember, async (req, res) => {
    const me = currentUser(req);
    const target = await findMember(stringParam(req, "username"));
    await db.block.deleteMany({ where: { blockerId: me.id, blockedId: target.id } });
    res.status(204).end();
  });

  return router;
}
