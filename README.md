# Good Deeds

A social platform where real people share real good deeds — and inspire the next one.

This repo holds everything: the web app, the API, the database schema, and (later) the Flutter mobile app.

```
apps/
  web/        Next.js web app
  api/        Express REST API (/v1) — used by web and mobile
packages/
  database/   Prisma schema, migrations, client
  shared/     Validation schemas + API types shared by web and API
```

Production (set up later): Firebase Auth, Cloud SQL Postgres, Cloud Run (API), Firebase Hosting (web), Cloud Storage (photos).
Locally everything runs on your Mac: Postgres + Mailpit in Docker and the Firebase emulators — no cloud account needed.

## First-time setup

You need **Node 22**, **pnpm 10** (`corepack enable`), **Postgres 16**, and the **Firebase CLI** (`npm i -g firebase-tools`, needs Java 21: `brew install openjdk@21` — `pnpm emulators` finds Homebrew's Java on its own).

Postgres either way:

- **Docker:** `pnpm db:up` starts Postgres (and Mailpit, a local email inbox) from `docker-compose.yml`.
- **Homebrew** (`brew install postgresql@16 && brew services start postgresql@16`), then create the user and databases once:

  ```bash
  psql postgres -c "CREATE ROLE gooddeeds LOGIN PASSWORD 'gooddeeds' CREATEDB"
  createdb -O gooddeeds gooddeeds
  createdb -O gooddeeds gooddeeds_test
  ```

The web app runs on port **3100** so it doesn't clash with other projects on 3000.

```bash
pnpm install

# 1. Env files
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env

# 2. Start Postgres (skip if you use Homebrew Postgres)
pnpm db:up

# 3. Create the first migration from the schema (only the very first time; afterwards it just applies)
pnpm db:migrate --name init
```

## Every day

Three terminals:

```bash
pnpm db:up          # Postgres, if you use Docker
pnpm emulators      # Firebase Auth + Storage emulators, UI at http://localhost:4000
pnpm dev            # API on :4100, web on :3100
```

Useful URLs:

| What                    | URL                          |
| ----------------------- | ---------------------------- |
| Web app                 | http://localhost:3100        |
| API health              | http://localhost:4100/health |
| Firebase emulator UI    | http://localhost:4000        |
| Mailpit (local inbox)   | http://localhost:8025        |
| Database browser        | `pnpm db:studio`             |

## Tests

```bash
pnpm test           # API integration tests against the gooddeeds_test database
pnpm typecheck
```

The test database is created automatically by Docker the first time Postgres starts. If your Postgres volume already existed, create it once: `docker exec good-deeds-postgres createdb -U gooddeeds gooddeeds_test`.

## Try the API by hand

```bash
# Create a user in the Auth emulator and get a token
TOKEN=$(curl -s -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo" \
  -H 'content-type: application/json' \
  -d '{"email":"me@example.com","password":"secret123","returnSecureToken":true}' | jq -r .idToken)

curl -H "Authorization: Bearer $TOKEN" localhost:4100/v1/me
curl -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -X POST localhost:4100/v1/me/onboarding -d '{"username":"me","name":"Me"}'
```

Full endpoint list: [docs/api.md](docs/api.md).

## Status

- ✅ Phase 0 — workspace, local services, schema for the full product
- ✅ Phase 1 — API core: auth, onboarding, profiles, follows, vouches, blocks, deeds, feed, ripples, likes, saves, "I was there", comments, notifications, reports + moderation
- ⏳ Phase 2 — web app on the real API (Firebase sign-in, photo uploads, remove demo data)
- ⏳ Phase 3 — challenges, help board, circles endpoints; Cloud setup and first deploy
- ⏳ Phase 4 — Flutter app
