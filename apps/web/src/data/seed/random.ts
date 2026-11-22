/** Small deterministic PRNG so the seeded community is identical on every reset. */
export function createRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let state = h >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    int: (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min,
    pick: <T,>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
    sample: <T,>(items: readonly T[], count: number): T[] => {
      const pool = [...items];
      const result: T[] = [];
      while (pool.length > 0 && result.length < count) {
        result.push(pool.splice(Math.floor(next() * pool.length), 1)[0]);
      }
      return result;
    },
  };
}
