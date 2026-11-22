import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { api, db, deedBody, member, resetDb } from "./helpers";

beforeEach(resetDb);
afterAll(() => db.$disconnect());

describe("deeds", () => {
  it("creates a deed with images and returns it in the feed", async () => {
    const asha = await member("asha");
    const created = await api()
      .post("/v1/deeds")
      .set(asha.auth)
      .send(deedBody({ images: [{ storagePath: "users/uid-asha/deeds/a.webp", url: "https://example.com/a.webp" }] }))
      .expect(201);
    expect(created.body).toMatchObject({
      title: "Planted saplings by the lake",
      author: { username: "asha" },
      counts: { likes: 0, comments: 0 },
      viewer: { isAuthor: true },
    });
    expect(created.body.images).toHaveLength(1);

    const feed = await api().get("/v1/deeds").expect(200);
    expect(feed.body.items).toHaveLength(1);
    expect(feed.body.items[0].viewer.isAuthor).toBe(false);
  });

  it("validates input and image ownership", async () => {
    const asha = await member("asha");
    await api().post("/v1/deeds").set(asha.auth).send(deedBody({ title: "x" })).expect(400);
    await api().post("/v1/deeds").set(asha.auth).send(deedBody({ category: "crypto" })).expect(400);
    await api().post("/v1/deeds").set(asha.auth).send(deedBody({ activityDate: "2999-01-01" })).expect(400);
    await api()
      .post("/v1/deeds")
      .set(asha.auth)
      .send(deedBody({ images: [{ storagePath: "users/someone-else/x.webp", url: "https://example.com/x.webp" }] }))
      .expect(403);
  });

  it("limits deeds per day", async () => {
    const asha = await member("asha");
    for (let i = 0; i < 5; i++) await api().post("/v1/deeds").set(asha.auth).send(deedBody()).expect(201);
    const res = await api().post("/v1/deeds").set(asha.auth).send(deedBody()).expect(429);
    expect(res.body.error.code).toBe("rate_limited");
  });

  it("paginates newest first with a cursor", async () => {
    const asha = await member("asha");
    for (let i = 1; i <= 3; i++) {
      await api().post("/v1/deeds").set(asha.auth).send(deedBody({ title: `Deed number ${i}` })).expect(201);
    }
    const first = await api().get("/v1/deeds?limit=2").expect(200);
    expect(first.body.items.map((d: { title: string }) => d.title)).toEqual(["Deed number 3", "Deed number 2"]);
    expect(first.body.nextCursor).toBeTruthy();
    const second = await api().get(`/v1/deeds?limit=2&cursor=${first.body.nextCursor}`).expect(200);
    expect(second.body.items.map((d: { title: string }) => d.title)).toEqual(["Deed number 1"]);
    expect(second.body.nextCursor).toBeNull();
  });

  it("filters by category, search, author and following", async () => {
    const asha = await member("asha");
    const ben = await member("ben");
    const cara = await member("cara");
    await api().post("/v1/deeds").set(asha.auth).send(deedBody()).expect(201);
    await api().post("/v1/deeds").set(ben.auth).send(deedBody({ title: "Taught kids chess", description: "Ran a free chess hour at the library.", category: "education" })).expect(201);

    const byCategory = await api().get("/v1/deeds?category=education").expect(200);
    expect(byCategory.body.items).toHaveLength(1);
    const bySearch = await api().get("/v1/deeds?q=SAPLINGS").expect(200);
    expect(bySearch.body.items[0].author.username).toBe("asha");
    const byAuthor = await api().get("/v1/deeds?author=ben").expect(200);
    expect(byAuthor.body.items).toHaveLength(1);

    await api().put("/v1/users/ben/follow").set(cara.auth).expect(204);
    const following = await api().get("/v1/deeds?scope=following").set(cara.auth).expect(200);
    expect(following.body.items.map((d: { author: { username: string } }) => d.author.username)).toEqual(["ben"]);
    await api().get("/v1/deeds?scope=following").expect(400);
  });

  it("likes, saves and confirms idempotently, with notifications", async () => {
    const asha = await member("asha");
    const ben = await member("ben");
    const { body: deed } = await api().post("/v1/deeds").set(asha.auth).send(deedBody()).expect(201);

    await api().put(`/v1/deeds/${deed.id}/like`).set(ben.auth).expect(204);
    await api().put(`/v1/deeds/${deed.id}/like`).set(ben.auth).expect(204);
    await api().put(`/v1/deeds/${deed.id}/save`).set(ben.auth).expect(204);
    await api().put(`/v1/deeds/${deed.id}/confirm`).set(ben.auth).expect(204);
    await api().put(`/v1/deeds/${deed.id}/confirm`).set(asha.auth).expect(400);

    const seen = await api().get(`/v1/deeds/${deed.id}`).set(ben.auth).expect(200);
    expect(seen.body.counts).toMatchObject({ likes: 1, saves: 1, confirmations: 1 });
    expect(seen.body.viewer).toMatchObject({ liked: true, saved: true, confirmed: true });

    const saved = await api().get("/v1/me/saved").set(ben.auth).expect(200);
    expect(saved.body.items.map((d: { id: string }) => d.id)).toEqual([deed.id]);

    await api().delete(`/v1/deeds/${deed.id}/like`).set(ben.auth).expect(204);
    await api().put(`/v1/deeds/${deed.id}/like`).set(ben.auth).expect(204);
    const notifications = await api().get("/v1/notifications").set(asha.auth).expect(200);
    const types = notifications.body.items.map((n: { type: string }) => n.type).sort();
    expect(types).toEqual(["CONFIRMATION", "LIKE"]);

    const unread = await api().get("/v1/notifications/unread-count").set(asha.auth).expect(200);
    expect(unread.body.count).toBe(2);
    await api().post("/v1/notifications/read-all").set(asha.auth).expect(204);
    const after = await api().get("/v1/notifications/unread-count").set(asha.auth).expect(200);
    expect(after.body.count).toBe(0);
  });

  it("tracks ripples and notifies the original author", async () => {
    const asha = await member("asha");
    const ben = await member("ben");
    const { body: original } = await api().post("/v1/deeds").set(asha.auth).send(deedBody()).expect(201);
    const { body: ripple } = await api()
      .post("/v1/deeds")
      .set(ben.auth)
      .send(deedBody({ title: "Planted saplings too", inspiredById: original.id }))
      .expect(201);
    expect(ripple.inspiredBy).toMatchObject({ id: original.id, author: { username: "asha" } });

    const ripples = await api().get(`/v1/deeds/${original.id}/ripples`).expect(200);
    expect(ripples.body.items.map((d: { id: string }) => d.id)).toEqual([ripple.id]);
    const profile = await api().get("/v1/users/asha").expect(200);
    expect(profile.body.stats.ripplesInspired).toBe(1);
    const notifications = await api().get("/v1/notifications").set(asha.auth).expect(200);
    expect(notifications.body.items[0]).toMatchObject({ type: "RIPPLE", deedId: ripple.id, actor: { username: "ben" } });
  });

  it("only the author (or an admin) can delete, and deleted deeds disappear", async () => {
    const asha = await member("asha");
    const ben = await member("ben");
    const { body: deed } = await api().post("/v1/deeds").set(asha.auth).send(deedBody()).expect(201);
    await api().delete(`/v1/deeds/${deed.id}`).set(ben.auth).expect(403);
    await api().delete(`/v1/deeds/${deed.id}`).set(asha.auth).expect(204);
    await api().get(`/v1/deeds/${deed.id}`).expect(404);
    await api().get("/v1/deeds/not-a-uuid").expect(400);
  });
});

describe("comments", () => {
  it("adds, lists and deletes comments with permissions", async () => {
    const asha = await member("asha");
    const ben = await member("ben");
    const cara = await member("cara");
    const { body: deed } = await api().post("/v1/deeds").set(asha.auth).send(deedBody()).expect(201);

    const { body: comment } = await api()
      .post(`/v1/deeds/${deed.id}/comments`)
      .set(ben.auth)
      .send({ text: "  Lovely work!  " })
      .expect(201);
    expect(comment).toMatchObject({ text: "Lovely work!", author: { username: "ben" } });
    await api().post(`/v1/deeds/${deed.id}/comments`).set(ben.auth).send({ text: "" }).expect(400);

    const list = await api().get(`/v1/deeds/${deed.id}/comments`).expect(200);
    expect(list.body.items).toHaveLength(1);

    await api().delete(`/v1/comments/${comment.id}`).set(cara.auth).expect(403);
    await api().delete(`/v1/comments/${comment.id}`).set(asha.auth).expect(204); // deed author may remove
    const after = await api().get(`/v1/deeds/${deed.id}`).expect(200);
    expect(after.body.counts.comments).toBe(0);
  });
});

describe("reports & moderation", () => {
  it("lets members report and admins hide a deed", async () => {
    const asha = await member("asha");
    const ben = await member("ben");
    const admin = await member("mod", "admin@test.dev");
    const { body: deed } = await api().post("/v1/deeds").set(asha.auth).send(deedBody()).expect(201);

    await api().post("/v1/reports").set(ben.auth).send({ targetType: "DEED", targetId: deed.id, reason: "FAKE" }).expect(202);
    await api().get("/v1/admin/reports").set(ben.auth).expect(403);
    const reports = await api().get("/v1/admin/reports").set(admin.auth).expect(200);
    expect(reports.body.items).toHaveLength(1);

    await api()
      .post(`/v1/admin/reports/${reports.body.items[0].id}/resolve`)
      .set(admin.auth)
      .send({ action: "hide_deed" })
      .expect(204);
    await api().get(`/v1/deeds/${deed.id}`).set(ben.auth).expect(404);
    await api().get(`/v1/deeds/${deed.id}`).set(asha.auth).expect(200); // author still sees it
  });
});
