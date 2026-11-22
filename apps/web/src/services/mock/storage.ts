import { DB_VERSION, STORAGE_KEYS } from "@/config/storage-keys";
import { buildSeedDatabase } from "@/data/seed/build";
import { wait } from "@/lib/utils";

import { ServiceError } from "../errors";
import type { MockDatabase } from "./schema";

let cache: MockDatabase | null = null;

const isBrowser = () => typeof window !== "undefined";

function read(): MockDatabase | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.db);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockDatabase;
    return parsed.version === DB_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function write(db: MockDatabase): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.db, JSON.stringify(db));
  } catch {
    throw new ServiceError("Your browser storage is full. Try a smaller photo or reset the demo data.", "STORAGE_FULL");
  }
}

/** Returns the current database, seeding it on first use. */
export function getDb(): MockDatabase {
  if (cache) return cache;
  const stored = read();
  if (stored) {
    cache = stored;
    return cache;
  }
  cache = buildSeedDatabase();
  write(cache);
  return cache;
}

/** Applies a mutation and persists it. Rolls back the in-memory copy if saving fails. */
export function mutateDb<T>(mutate: (db: MockDatabase) => T): T {
  const current = getDb();
  const draft = structuredClone(current);
  const result = mutate(draft);
  write(draft);
  cache = draft;
  return result;
}

export function resetDb(): MockDatabase {
  cache = buildSeedDatabase();
  write(cache);
  return cache;
}

/** Small artificial delay so loading states behave like a real network. */
export function latency(min = 120, max = 320): Promise<void> {
  return wait(Math.round(min + Math.random() * (max - min)));
}

export function readSession(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(STORAGE_KEYS.session);
}

export function writeSession(userId: string | null): void {
  if (!isBrowser()) return;
  if (userId) window.localStorage.setItem(STORAGE_KEYS.session, userId);
  else window.localStorage.removeItem(STORAGE_KEYS.session);
}
