import { Router } from "express";
import { commentSchema, LIMITS, paginationSchema } from "@repo/shared";
import type { AppContext } from "../../context";
import { currentUser, requireMember } from "../../middleware/auth";
import { forbidden, notFound, tooMany } from "../../lib/errors";
import { idParam } from "../../lib/http";
import { cursorArgs, toPage } from "../../lib/pagination";
import { commentInclude, toCommentDto } from "../../lib/serializers";
import { parse } from "../../lib/validate";
import { notify } from "../notifications/notify";
import { findVisibleDeed, hiddenAuthorIds } from "../deeds/service";

/** Mounted at /v1/deeds/:id/comments */
export function deedCommentsRouter({ db }: AppContext) {
  const router = Router({ mergeParams: true });

  router.get("/", async (req, res) => {
    const deed = await findVisibleDeed(db, idParam(req), req.user?.id);
    const { cursor, limit } = parse(paginationSchema, req.query);
    const hidden = await hiddenAuthorIds(db, req.user?.id);
    const rows = await db.comment.findMany({
      where: { deedId: deed.id, deletedAt: null, author: { status: "ACTIVE" }, authorId: { notIn: hidden } },
      include: commentInclude,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      ...cursorArgs(cursor, limit),
    });
    res.json(toPage(rows, limit, toCommentDto));
  });

  router.post("/", requireMember, async (req, res) => {
    const me = currentUser(req);
    const deed = await findVisibleDeed(db, idParam(req), me.id);
    const { text } = parse(commentSchema, req.body);

    const since = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db.comment.count({ where: { authorId: me.id, createdAt: { gte: since } } });
    if (recent >= LIMITS.commentsPerHour) throw tooMany("You're commenting a lot — take a short break");

    const comment = await db.comment.create({
      data: { deedId: deed.id, authorId: me.id, text },
      include: commentInclude,
    });
    await notify(db, {
      recipientId: deed.authorId,
      actorId: me.id,
      type: "COMMENT",
      deedId: deed.id,
      message: text.slice(0, 140),
    });
    res.status(201).json(toCommentDto(comment));
  });

  return router;
}

/** Mounted at /v1/comments */
export function commentsRouter({ db }: AppContext) {
  const router = Router();

  /** The commenter, the deed's author (their space) or an admin may remove a comment. */
  router.delete("/:id", requireMember, async (req, res) => {
    const me = currentUser(req);
    const comment = await db.comment.findFirst({
      where: { id: idParam(req), deletedAt: null },
      include: { deed: { select: { authorId: true } } },
    });
    if (!comment) throw notFound("Comment");
    const allowed = comment.authorId === me.id || comment.deed.authorId === me.id || me.role === "ADMIN";
    if (!allowed) throw forbidden();
    await db.comment.update({ where: { id: comment.id }, data: { deletedAt: new Date() } });
    res.status(204).end();
  });

  return router;
}
