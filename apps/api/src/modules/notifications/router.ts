import { Router } from "express";
import { paginationSchema } from "@repo/shared";
import type { AppContext } from "../../context";
import { currentUser, requireMember } from "../../middleware/auth";
import { notFound } from "../../lib/errors";
import { idParam } from "../../lib/http";
import { cursorArgs, toPage } from "../../lib/pagination";
import { notificationInclude, toNotificationDto } from "../../lib/serializers";
import { parse } from "../../lib/validate";

export function notificationsRouter({ db }: AppContext) {
  const router = Router();
  router.use(requireMember);

  router.get("/", async (req, res) => {
    const me = currentUser(req);
    const { cursor, limit } = parse(paginationSchema, req.query);
    const rows = await db.notification.findMany({
      where: { recipientId: me.id },
      include: notificationInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...cursorArgs(cursor, limit),
    });
    res.json(toPage(rows, limit, toNotificationDto));
  });

  router.get("/unread-count", async (req, res) => {
    const count = await db.notification.count({ where: { recipientId: currentUser(req).id, readAt: null } });
    res.json({ count });
  });

  router.post("/read-all", async (req, res) => {
    await db.notification.updateMany({
      where: { recipientId: currentUser(req).id, readAt: null },
      data: { readAt: new Date() },
    });
    res.status(204).end();
  });

  router.post("/:id/read", async (req, res) => {
    const result = await db.notification.updateMany({
      where: { id: idParam(req), recipientId: currentUser(req).id, readAt: null },
      data: { readAt: new Date() },
    });
    if (result.count === 0) {
      const exists = await db.notification.findFirst({ where: { id: idParam(req), recipientId: currentUser(req).id } });
      if (!exists) throw notFound("Notification");
    }
    res.status(204).end();
  });

  return router;
}
