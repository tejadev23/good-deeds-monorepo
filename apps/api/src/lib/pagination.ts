import type { Page } from "@repo/shared";

/**
 * Cursor pagination helper. Fetch `limit + 1` rows ordered newest-first; the
 * extra row tells us whether there's another page. The cursor is the last id.
 */
export function cursorArgs(cursor: string | undefined, limit: number) {
  return {
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  };
}

export function toPage<Row extends { id: string }, Item>(rows: Row[], limit: number, map: (row: Row) => Item): Page<Item> {
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  return { items: pageRows.map(map), nextCursor: hasMore ? (pageRows.at(-1)?.id ?? null) : null };
}

/** Next cursor for composite-key tables (follows, saves) where the cursor is one side of the key. */
export function nextKeyCursor<Row>(rows: Row[], limit: number, key: (row: Row) => string) {
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const last = pageRows.at(-1);
  return { rows: pageRows, nextCursor: hasMore && last ? key(last) : null };
}
