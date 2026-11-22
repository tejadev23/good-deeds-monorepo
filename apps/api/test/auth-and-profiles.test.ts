import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { api, db, member, resetDb } from "./helpers";

beforeEach(resetDb);
afterAll(() => db.$disconnect());

describe("auth & onboarding", () => {
  it("health check works without auth", async () => {
    await api().get("/health").expect(200, { ok: true });
  });

  it("rejects bad tokens with 401 and lets anonymous reads through", async () => {
    await api().get("/v1/me").set({ Authorization: "Bearer nope" }).expect(401);
    await api().get("/v1/me").expect(401);
    await api().get("/v1/deeds").expect(200);
  });

  it("creates the user on first sign-in, then requires onboarding before posting", async () => {
    const auth = { Authorization: "Bearer test:uid-new:new@test.dev" };
    const me = await api().get("/v1/me").set(auth).expect(200);
    expect(me.body).toMatchObject({ email: "new@test.dev", username: null, onboarded: false });

    const blocked = await api().post("/v1/deeds").set(auth).send({}).expect(403);
    expect(blocked.body.error.code).toBe("onboarding_required");

    await api().post("/v1/me/onboarding").set(auth).send({ username: "New_Person", name: "New" }).expect(201);
    const after = await api().get("/v1/me").set(auth).expect(200);
    expect(after.body).toMatchObject({ username: "new_person", onboarded: true });
  });

  it("enforces unique and valid usernames", async () => {
    await member("asha");
    const auth = { Authorization: "Bearer test:uid-x:x@test.dev" };
    await api().post("/v1/me/onboarding").set(auth).send({ username: "asha", name: "X" }).expect(409);
    await api().post("/v1/me/onboarding").set(auth).send({ username: "admin", name: "X" }).expect(400);
    await api().post("/v1/me/onboarding").set(auth).send({ username: "a!", name: "X" }).expect(400);
    const check = await api().get("/v1/me/username-available?username=asha").set(auth).expect(200);
    expect(check.body.available).toBe(false);
  });

  it("gives ADMIN role to configured emails", async () => {
    const res = await api().get("/v1/me").set({ Authorization: "Bearer test:uid-adm:admin@test.dev" }).expect(200);
    expect(res.body.role).toBe("ADMIN");
  });
});

describe("profiles, follows, vouches, blocks", () => {
  it("follows and unfollows, updating counts and notifying once", async () => {
    const asha = await member("asha");
    const ben = await member("ben");

    await api().put("/v1/users/ben/follow").set(asha.auth).expect(204);
    await api().put("/v1/users/ben/follow").set(asha.auth).expect(204); // idempotent
    let profile = await api().get("/v1/users/ben").set(asha.auth).expect(200);
    expect(profile.body.stats.followers).toBe(1);
    expect(profile.body.viewer).toMatchObject({ following: true, isSelf: false });

    const followers = await api().get("/v1/users/ben/followers").expect(200);
    expect(followers.body.items.map((u: { username: string }) => u.username)).toEqual(["asha"]);

    await api().delete("/v1/users/ben/follow").set(asha.auth).expect(204);
    await api().put("/v1/users/ben/follow").set(asha.auth).expect(204);
    const notifications = await api().get("/v1/notifications").set(ben.auth).expect(200);
    expect(notifications.body.items.filter((n: { type: string }) => n.type === "FOLLOW")).toHaveLength(1);

    profile = await api().get("/v1/users/asha").expect(200);
    expect(profile.body.stats.following).toBe(1);
    await api().put("/v1/users/asha/follow").set(asha.auth).expect(400);
  });

  it("vouches", async () => {
    const asha = await member("asha");
    await member("ben");
    await api().put("/v1/users/ben/vouch").set(asha.auth).expect(204);
    const profile = await api().get("/v1/users/ben").set(asha.auth).expect(200);
    expect(profile.body.stats.vouches).toBe(1);
    expect(profile.body.viewer.vouched).toBe(true);
  });

  it("blocking removes follows and hides the blocked person's deeds", async () => {
    const asha = await member("asha");
    const ben = await member("ben");
    await api().put("/v1/users/ben/follow").set(asha.auth).expect(204);
    await api().post("/v1/deeds").set(ben.auth).send({
      title: "Fed street dogs", description: "Shared food with the four dogs near the station.", category: "animals",
      activityDate: new Date().toISOString().slice(0, 10),
    }).expect(201);

    await api().put("/v1/users/ben/block").set(asha.auth).expect(204);
    const feed = await api().get("/v1/deeds").set(asha.auth).expect(200);
    expect(feed.body.items).toHaveLength(0);
    const profile = await api().get("/v1/users/ben").expect(200);
    expect(profile.body.stats.followers).toBe(0);
  });

  it("returns 404 for unknown or not-yet-onboarded people", async () => {
    await api().get("/v1/me").set({ Authorization: "Bearer test:uid-half:half@test.dev" });
    await api().get("/v1/users/nobody").expect(404);
  });

  it("updates own profile", async () => {
    const asha = await member("asha");
    await api().patch("/v1/me").set(asha.auth).send({ bio: "Weekend beach cleaner", location: "Kochi" }).expect(200);
    const profile = await api().get("/v1/users/asha").expect(200);
    expect(profile.body).toMatchObject({ bio: "Weekend beach cleaner", location: "Kochi" });
  });
});
