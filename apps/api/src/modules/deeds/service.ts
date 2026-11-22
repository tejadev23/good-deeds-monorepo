import type { Database, Prisma, User } from "@repo/database";
import { LIMITS, type CreateDeedInput, type FeedQuery } from "@repo/shared";
import { badRequest, forbidden, notFound, tooMany } from "../../lib/errors";
import { deedInclude } from "../../lib/serializers";
import { notify } from "../notifications/notify";

/** Ids the viewer must not see (blocked either way). */
export async function hiddenAuthorIds(db: Database, viewerId: string | undefined) {
  if (!viewerId) return [];
  const blocks = await db.block.findMany({
    where: { OR: [{ blockerId: viewerId }, { blockedId: viewerId }] },
    select: { blockerId: true, blockedId: true },
  });
  return blocks.map((block) => (block.blockerId === viewerId ? block.blockedId : block.blockerId));
}

/** Base visibility rules every deed query shares. */
export async function visibleDeedWhere(db: Database, viewerId: string | undefined): Promise<Prisma.DeedWhereInput> {
  const hidden = await hiddenAuthorIds(db, viewerId);
  return {
    deletedAt: null,
    author: { status: "ACTIVE" },
    ...(hidden.length ? { authorId: { notIn: hidden } } : {}),
    // Moderated deeds stay visible to their author only.
    OR: viewerId ? [{ status: "PUBLISHED" }, { authorId: viewerId }] : [{ status: "PUBLISHED" }],
  };
}

export async function feedWhere(db: Database, viewerId: string | undefined, query: FeedQuery) {
  const and: Prisma.DeedWhereInput[] = [await visibleDeedWhere(db, viewerId)];

  if (query.category) and.push({ category: query.category });
  if (query.author) and.push({ author: { username: query.author.toLowerCase() } });
  if (query.q) {
    and.push({
      OR: [
        { title: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
        { location: { contains: query.q, mode: "insensitive" } },
      ],
    });
  }
  if (query.scope === "following") {
    if (!viewerId) throw badRequest("Sign in to see deeds from people you follow");
    and.push({
      OR: [{ authorId: viewerId }, { author: { followers: { some: { followerId: viewerId } } } }],
    });
  }
  return { AND: and } satisfies Prisma.DeedWhereInput;
}

export async function findVisibleDeed(db: Database, id: string, viewerId: string | undefined) {
  const deed = await db.deed.findFirst({
    where: { id, ...(await visibleDeedWhere(db, viewerId)) },
    include: deedInclude(viewerId),
  });
  if (!deed) throw notFound("Deed");
  return deed;
}

export async function createDeed(db: Database, author: User, input: CreateDeedInput) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent = await db.deed.count({ where: { authorId: author.id, createdAt: { gte: since } } });
  if (recent >= LIMITS.deedsPerDay) {
    throw tooMany(`You can share up to ${LIMITS.deedsPerDay} deeds a day — come back tomorrow`);
  }

  const activityDate = new Date(`${input.activityDate}T00:00:00.000Z`);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  if (activityDate > tomorrow) throw badRequest("A deed can't happen in the future");

  // Images must be uploaded into the author's own storage folder.
  const ownPrefix = `users/${author.firebaseUid}/`;
  if (input.images.some((image) => !image.storagePath.startsWith(ownPrefix))) {
    throw forbidden("Images must be uploaded from your own account");
  }

  let inspiredBy: { id: string; authorId: string } | null = null;
  if (input.inspiredById) {
    inspiredBy = await db.deed.findFirst({
      where: { id: input.inspiredById, deletedAt: null, status: "PUBLISHED" },
      select: { id: true, authorId: true },
    });
    if (!inspiredBy) throw badRequest("The deed that inspired this one no longer exists");
  }

  if (input.challenge) {
    const challenge = await db.challenge.findUnique({ where: { id: input.challenge.challengeId } });
    if (!challenge) throw badRequest("That challenge doesn't exist");
    if (activityDate < challenge.startDate || activityDate > challenge.endDate) {
      throw badRequest("This deed happened outside the challenge dates");
    }
  }

  const deed = await db.$transaction(async (tx) => {
    const created = await tx.deed.create({
      data: {
        authorId: author.id,
        title: input.title,
        description: input.description,
        category: input.category,
        location: input.location || null,
        activityDate,
        inspiredById: inspiredBy?.id ?? null,
        challengeId: input.challenge?.challengeId ?? null,
        challengeAmount: input.challenge?.amount ?? null,
        images: { create: input.images.map((image, position) => ({ ...image, position })) },
      },
      include: deedInclude(author.id),
    });
    if (input.challenge) {
      await tx.challengeParticipant.upsert({
        where: { challengeId_userId: { challengeId: input.challenge.challengeId, userId: author.id } },
        update: {},
        create: { challengeId: input.challenge.challengeId, userId: author.id },
      });
    }
    return created;
  });

  if (inspiredBy) {
    await notify(db, { recipientId: inspiredBy.authorId, actorId: author.id, type: "RIPPLE", deedId: deed.id });
  }
  return deed;
}

export async function deleteDeed(db: Database, user: User, id: string) {
  const deed = await db.deed.findFirst({ where: { id, deletedAt: null }, select: { authorId: true } });
  if (!deed) throw notFound("Deed");
  if (deed.authorId !== user.id && user.role !== "ADMIN") throw forbidden("Only the author can delete this deed");
  await db.deed.update({ where: { id }, data: { deletedAt: new Date() } });
}
