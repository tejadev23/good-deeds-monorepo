import { Router } from "express";
import { z } from "zod";
import { paginationSchema, reportSchema } from "@repo/shared";
import type { AppContext } from "../../context";
import { currentUser, requireAdmin, requireMember } from "../../middleware/auth";
import { notFound } from "../../lib/errors";
import { idParam } from "../../lib/http";
import { cursorArgs, toPage } from "../../lib/pagination";
import { parse } from "../../lib/validate";

/** Mounted at /v1/reports — anyone signed in can flag content. */
export function reportsRouter({ db }: AppContext) {
  const router = Router();
  router.post("/", requireMember, async (req, res) => {
    const me = currentUser(req);
    const input = parse(reportSchema, req.body);
    // One report per person per item; re-reporting just updates the reason.
    await db.report.upsert({
      where: { reporterId_targetType_targetId: { reporterId: me.id, targetType: input.targetType, targetId: input.targetId } },
      update: { reason: input.reason, details: input.details ?? null, status: "OPEN" },
      create: { ...input, reporterId: me.id },
    });
    res.status(202).json({ received: true });
  });
  return router;
}

const resolveSchema = z.object({
  action: z.enum(["dismiss", "hide_deed", "remove_comment", "suspend_user"]),
});

/** Mounted at /v1/admin — moderation for the small founding team. */
export function adminRouter({ db }: AppContext) {
  const router = Router();
  router.use(requireAdmin);

  router.get("/reports", async (req, res) => {
    const { cursor, limit } = parse(paginationSchema, req.query);
    const rows = await db.report.findMany({
      where: { status: "OPEN" },
      include: { reporter: { select: { username: true } } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...cursorArgs(cursor, limit),
    });
    res.json(toPage(rows, limit, (row) => row));
  });

  router.post("/reports/:id/resolve", async (req, res) => {
    const me = currentUser(req);
    const report = await db.report.findUnique({ where: { id: idParam(req) } });
    if (!report) throw notFound("Report");
    const { action } = parse(resolveSchema, req.body);

    await db.$transaction(async (tx) => {
      if (action === "hide_deed" && report.targetType === "DEED") {
        await tx.deed.update({ where: { id: report.targetId }, data: { status: "HIDDEN" } });
      }
      if (action === "remove_comment" && report.targetType === "COMMENT") {
        await tx.comment.update({ where: { id: report.targetId }, data: { deletedAt: new Date() } });
      }
      if (action === "suspend_user" && report.targetType === "USER") {
        await tx.user.update({ where: { id: report.targetId }, data: { status: "SUSPENDED" } });
      }
      // Close every open report about the same thing in one go.
      await tx.report.updateMany({
        where: { targetType: report.targetType, targetId: report.targetId, status: "OPEN" },
        data: { status: action === "dismiss" ? "DISMISSED" : "RESOLVED", resolvedById: me.id, resolvedAt: new Date() },
      });
    });
    res.status(204).end();
  });

  return router;
}
