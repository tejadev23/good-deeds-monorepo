# @repo/web

The Good Deeds web app (Next.js 16, React 19, Tailwind v4).

**Current state:** this is the prototype UI moved in unchanged. It still runs on the in-browser mock
services in `src/services/mock` with demo data. Phase 2 replaces those with an `api` implementation of
`src/services/contracts.ts` that calls `apps/api`, signs in with Firebase Auth and uploads photos to
Firebase Storage. The demo data and demo accounts are removed at that point.

```bash
pnpm --filter @repo/web dev     # http://localhost:3100
```
