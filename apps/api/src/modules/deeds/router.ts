import { Router } from "express";
import { createDeedSchema, feedQuerySchema, paginationSchema } from "@repo/shared";
import type { AppContext } from "../../context";
import { currentUser, requireMember } from "../../middleware/auth";
import { badRequest } from "../../lib/errors";
import { idParam } from "../../lib/http";
import { cursorArgs, nextKeyCursor, toPage } from "../../lib/pagination";
import { deedInclude, toDeedDto } from "../../lib/serializers";
import { parse } from "../../lib/validate";
import { notify } from "../notifications/notify";
import { createDeed, deleteDeed, feedWhere, findVisibleDeed, visibleDeedWhere } from "./service";

export function deedsRouter({ db }: AppContext) {
  const router = Router();

  router.get("/", async (req, res) => {
    const query = parse(feedQuerySchema, req.query);
    const viewerId = req.user?.id;
    const rows = await db.deed.findMany({
      where: await feedWhere(db, viewerId, query),
      include: deedInclude(viewerId),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...cursorArgs(query.cursor, query.limit),
    });
    res.json(toPage(rows, query.limit, (row) => toDeedDto(row, viewerId)));
  });

  router.post("/", requireMember, async (req, res) => {
    const me = currentUser(req);
    const deed = await createDeed(db, me, parse(createDeedSchema, req.body));
    res.status(201).json(toDeedDto(deed, me.id));
  });

  router.get("/:id", async (req, res) => {
    const deed = await findVisibleDeed(db, idParam(req), req.user?.id);
    res.json(toDeedDto(deed, req.user?.id));
  });

  router.delete("/:id", requireMember, async (req, res) => {
    await deleteDeed(db, currentUser(req), idParam(req));
    res.status(204).end();
  });

  /** Deeds this one inspired. */
  router.get("/:id/ripples", async (req, res) => {
    const id = idParam(req);
    await findVisibleDeed(db, id, req.user?.id);
    const { cursor, limit } = parse(paginationSchema, req.query);
    const rows = await db.deed.findMany({
      where: { AND: [await visibleDeedWhere(db, req.user?.id), { inspiredById: id }] },
      include: deedInclude(req.user?.id),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...cursorArgs(cursor, limit),
    });
    res.json(toPage(rows, limit, (row) => toDeedDto(row, req.user?.id)));
  });

  // ── Reactions: PUT adds, DELETE removes. Both are idempotent. ──

  router.put("/:id/like", requireMember, async (req, res) => {
    const me = currentUser(req);
    const deed = await findVisibleDeed(db, idParam(req), me.id);
    await db.like.upsert({
      where: { deedId_userId: { deedId: deed.id, userId: me.id } },
      update: {},
      create: { deedId: deed.id, userId: me.id },
    });
    await notify(db, { recipientId: deed.authorId, actorId: me.id, type: "LIKE", deedId: deed.id });
    res.status(204).end();
  });

  router.delete("/:id/like", requireMember, async (req, res) => {
    await db.like.deleteMany({ where: { deedId: idParam(req), userId: currentUser(req).id } });
    res.status(204).end();
  });

  router.put("/:id/save", requireMember, async (req, res) => {
    const me = currentUser(req);
    const deed = await findVisibleDeed(db, idParam(req), me.id);
    await db.save.upsert({
      where: { deedId_userId: { deedId: deed.id, userId: me.id } },
      update: {},
      create: { deedId: deed.id, userId: me.id },
    });
    res.status(204).end();
  });

  router.delete("/:id/save", requireMember, async (req, res) => {
    await db.save.deleteMany({ where: { deedId: idParam(req), userId: currentUser(req).id } });
    res.status(204).end();
  });

  /** "I was there" — a witness confirms the deed happened. */
  router.put("/:id/confirm", requireMember, async (req, res) => {
    const me = currentUser(req);
    const deed = await findVisibleDeed(db, idParam(req), me.id);
    if (deed.authorId === me.id) throw badRequest("You can't confirm your own deed");
    await db.deedConfirmation.upsert({
      where: { deedId_userId: { deedId: deed.id, userId: me.id } },
      update: {},
      create: { deedId: deed.id, userId: me.id },
    });
    await notify(db, { recipientId: deed.authorId, actorId: me.id, type: "CONFIRMATION", deedId: deed.id });
    res.status(204).end();
  });

  router.delete("/:id/confirm", requireMember, async (req, res) => {
    await db.deedConfirmation.deleteMany({ where: { deedId: idParam(req), userId: currentUser(req).id } });
    res.status(204).end();
  });

  return router;
}

/** GET /v1/me/saved — the signed-in person's saved deeds, newest save first. */
export function savedRouter({ db }: AppContext) {
  const router = Router();
  router.get("/", requireMember, async (req, res) => {
    const me = currentUser(req);
    const { cursor, limit } = parse(paginationSchema, req.query);
    const rows = await db.save.findMany({
      where: { userId: me.id, deed: await visibleDeedWhere(db, me.id) },
      include: { deed: { include: deedInclude(me.id) } },
      orderBy: [{ createdAt: "desc" }, { deedId: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { deedId_userId: { deedId: cursor, userId: me.id } }, skip: 1 } : {}),
    });
    const page = nextKeyCursor(rows, limit, (row) => row.deedId);
    res.json({ items: page.rows.map((row) => toDeedDto(row.deed, me.id)), nextCursor: page.nextCursor });
  });
  return router;
}
