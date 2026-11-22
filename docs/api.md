# API v1

Base URL: `http://localhost:4100/v1` locally. Send `Authorization: Bearer <Firebase ID token>` when signed in.
Errors always look like `{ "error": { "code": "not_found", "message": "Deed not found" } }`.
Lists return `{ "items": [...], "nextCursor": "…" | null }`; pass `?cursor=<nextCursor>&limit=20` for the next page.

Guards: 🌐 anyone · 🔑 signed in · 👤 signed in + onboarded · 🛡 admin

## Me
| Method | Path | | Notes |
| --- | --- | --- | --- |
| GET | `/me` | 🔑 | Creates the account on first call |
| GET | `/me/username-available?username=` | 🔑 | |
| POST | `/me/onboarding` | 🔑 | `{ username, name, location?, interests? }` — once |
| PATCH | `/me` | 👤 | `{ name?, bio?, location?, interests?, avatarUrl?, coverUrl? }` |
| GET | `/me/saved` | 👤 | Saved deeds |
| PUT | `/me/devices` | 👤 | `{ token, platform }` push token |
| DELETE | `/me/devices/:token` | 🔑 | |

## People
| Method | Path | | Notes |
| --- | --- | --- | --- |
| GET | `/users/:username` | 🌐 | Profile + stats + viewer flags |
| GET | `/users/:username/followers` · `/following` | 🌐 | |
| PUT / DELETE | `/users/:username/follow` | 👤 | |
| PUT / DELETE | `/users/:username/vouch` | 👤 | "I know they do real good" |
| PUT / DELETE | `/users/:username/block` | 👤 | Also removes follows both ways |

## Deeds
| Method | Path | | Notes |
| --- | --- | --- | --- |
| GET | `/deeds` | 🌐 | `scope=all\|following`, `category`, `q`, `author` |
| POST | `/deeds` | 👤 | `{ title, description, category, activityDate, location?, images?, inspiredById?, challenge? }` · max 5/day |
| GET | `/deeds/:id` | 🌐 | |
| DELETE | `/deeds/:id` | 👤 | Author or admin (soft delete) |
| GET | `/deeds/:id/ripples` | 🌐 | Deeds this one inspired |
| PUT / DELETE | `/deeds/:id/like` · `/save` · `/confirm` | 👤 | `confirm` = "I was there" |
| GET | `/deeds/:id/comments` | 🌐 | Oldest first |
| POST | `/deeds/:id/comments` | 👤 | `{ text }` · max 30/hour |
| DELETE | `/comments/:id` | 👤 | Commenter, deed author or admin |

Images are uploaded by the client straight to Firebase Storage under `users/<firebase uid>/…`; the deed body sends `{ storagePath, url, width?, height? }`. The API rejects paths outside the author's folder.

## Notifications
| Method | Path | | |
| --- | --- | --- | --- |
| GET | `/notifications` | 👤 | |
| GET | `/notifications/unread-count` | 👤 | |
| POST | `/notifications/:id/read` · `/notifications/read-all` | 👤 | |

## Safety
| Method | Path | | Notes |
| --- | --- | --- | --- |
| POST | `/reports` | 👤 | `{ targetType, targetId, reason, details? }` |
| GET | `/admin/reports` | 🛡 | Open reports |
| POST | `/admin/reports/:id/resolve` | 🛡 | `{ action: dismiss \| hide_deed \| remove_comment \| suspend_user }` |
