# Good Deeds — Coding Standards

Monorepo for Good Deeds: a social platform where real people share real good deeds.

## Layout

| Path                | What                                                                          |
| ------------------- | ----------------------------------------------------------------------------- |
| `apps/web`          | Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4             |
| `apps/api`          | Express 5 REST API, versioned under `/v1`. The only thing that talks to the DB |
| `apps/mobile`       | Flutter app (later). Uses the same `/v1` API                                  |
| `packages/database` | Prisma 7 schema, migrations and client factory (`@repo/database`)             |
| `packages/shared`   | zod schemas, constants and API DTO types shared by web and API (`@repo/shared`) |

Package manager: **pnpm**. Task runner: **turbo**. Node 22.

## Golden rules

- **Clients never touch the database.** Web and mobile only call the API. Firebase is used for sign-in and photo storage only.
- **The API contract lives in `packages/shared`.** Request bodies are zod schemas; responses are `*Dto` types. Change them there first, then the API, then the clients.
- **Backwards-compatible API changes only** within `/v1` (add fields, never rename or remove). Mobile apps in people's pockets can't be force-updated.
- **No fictional or demo data in production code paths.** Seed scripts are dev-only.
- **Files stay under 400 lines.** Split into sub-components, hooks, services or helpers before that.
- Commits are authored by `tejadev23 <tejayt28@gmail.com>` only — no co-author lines.

---

## API (`apps/api`)

- One folder per module in `src/modules/<name>/` with `router.ts`, plus `service.ts` once logic grows beyond a few lines.
- Routers stay thin: parse input → call service → serialize. Business rules (rate limits, ownership, visibility) live in services.
- Validate every input with `parse(schema, req.body | req.query)` from `lib/validate.ts`. Validate ids with `idParam(req)`.
- Throw helpers from `lib/errors.ts` (`notFound`, `forbidden`, `badRequest`, `tooMany`…). Never `res.status(4xx)` by hand; the error middleware shapes every error as `{ error: { code, message, details? } }`.
- Never return Prisma rows directly. Map through serializers in `lib/serializers.ts` to a DTO. Never expose `firebaseUid` or other people's emails.
- Visibility rules for deeds (deleted, hidden by moderation, suspended authors, blocks) are centralised in `modules/deeds/service.ts` → `visibleDeedWhere`. Every deed query must use it.
- Toggle-style actions are idempotent `PUT` (add) / `DELETE` (remove) returning `204`.
- Lists use cursor pagination (`?cursor=&limit=`) and return `Page<T>` = `{ items, nextCursor }`.
- Notifications go through `notify()` — it skips self-actions, blocked users and duplicates.
- Auth: `authenticate` attaches `req.user` from a Firebase ID token. Guard routes with `requireAuth` (signed in), `requireMember` (onboarded) or `requireAdmin`.
- Every endpoint gets an integration test in `apps/api/test` (vitest + supertest against a real Postgres). Tests use fake tokens `test:<uid>:<email>`, no Firebase.

## Database (`packages/database`)

- Models are PascalCase in Prisma, snake_case in Postgres via `@@map` / `@map`.
- Ids are UUID v7 (`@default(uuid(7)) @db.Uuid`) — time-ordered, safe to expose.
- Soft-delete user content with `deletedAt`; hard-delete only join rows (likes, saves, follows).
- Change the schema → `pnpm db:migrate` (names and creates a migration, regenerates the client). Commit the migration folder.
- Import types from `@repo/database` — never redeclare model interfaces by hand.

---

## Web (`apps/web`)

### Components

Always use the shadcn-style components in `src/components/ui/` — never raw `<button>`, `<input>`, `<textarea>` or custom modals.

| Need         | Component                                                                     |
| ------------ | ----------------------------------------------------------------------------- |
| Buttons      | `<Button variant size loading>`                                               |
| Inputs       | `<Input>`, `<Textarea>`, `<Select>`, `<Label>`                                |
| Dialogs      | `<Dialog>`, `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`…             |
| Cards        | `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardFooter>`                     |
| Pills        | `<Badge variant>`                                                             |
| Menus / tabs | `<DropdownMenu…>`, `<Tabs…>`                                                  |
| Images       | `<SmartImage>` (fallback + loading state)                                     |

To change how a component looks everywhere, edit the file in `src/components/ui/`, not a `className` override.

### Icons

`solar-icon-set` only, **Linear** style (`HeartLinear`, `MapPointLinear`…). No inline SVGs, no SVG files. Spinner: `<RestartCircleLinear className="animate-spin" />` (or `Button`'s `loading` prop).

### Styling

- Colours come only from semantic tokens defined in `src/app/globals.css` (`bg-background`, `text-muted-foreground`, `bg-sage-subtle`, `text-forest`, `text-heart`…). Raw palette classes (`text-green-600`, `bg-white`) and hex/hsl values in components are banned.
- New colour → define it in `:root` **and** `.dark`, map it in `@theme inline`, then use the utility.
- Tailwind type scale only (`text-xs`…`text-2xl`). No `text-[13px]`.
- Merge classes with `cn()` from `@/lib/utils`.

### Architecture

- Components are dumb: layout, styling, events. No API calls, no try/catch, no multi-step orchestration in JSX files.
- Business logic lives in hooks (`src/hooks/useX.ts`): they call services, own loading/error state and show `toast`s.
- Shared/domain state lives in Zustand stores (`src/store/`). `useState` only for ephemeral UI state (inputs, open/closed, selected tab).
- Data access goes through the service interfaces in `src/services/contracts.ts`. Components and hooks never call `fetch` directly.
- No IIFEs, switch statements or long ternary chains inside JSX — extract helpers or sub-components.
- Every async button shows a loading state.

### Formatting

Use helpers in `src/lib/format.ts` (`formatDate`, `formatRelativeTime`, `formatCompactNumber`, `formatNumber`, `pluralize`). Don't call `toLocaleString` / `Intl` / `date-fns` directly in components. Deed dates are calendar dates (`YYYY-MM-DD`) — never shift them by timezone.

### Config

Routes, categories, image paths and storage keys come from `src/config/*`. No hard-coded route strings or category keys in components.
