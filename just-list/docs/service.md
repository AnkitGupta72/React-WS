# JustList Service Overview

JustList is a small full-stack application for managing personal lists across multiple lightweight “users.” It supports three list kinds—**to-do**, **travel**, and **shopping**—with the same active / completed workflow for each.

There is no password auth. A user is a named profile you select in the navbar; lists are scoped to that profile’s numeric `id`.

---

## High-level architecture

The repo is an **npm workspaces** monorepo with two packages:

| Package | Role | Stack |
|---------|------|--------|
| `client/` | Browser UI | Vite, React 19, TypeScript, React Router, Bootstrap 5 |
| `server/` | HTTP API + optional static host | Express 5, TypeScript, Zod, JSON files on disk |

```text
Browser ──► Vite (dev) or Express static (prod)
              │
              │  /api/*
              ▼
           Express API
              │
              ▼
     server/data/*.json
```

In development, `npm run dev` starts both processes via `concurrently`:

- **Client** on `http://localhost:5173` (Vite)
- **Server** on `http://localhost:8080` (Express via `tsx watch`)

Vite proxies any request under `/api` to the Express server, so the browser always calls same-origin paths like `/api/users` and never hard-codes `localhost:8080` in application code.

In production, `npm run build` produces `client/dist` and `server/dist`. `npm start` runs the compiled server, which serves the built SPA from `client/dist` when that folder exists.

---

## Domain model

### User

```ts
{ id: number; name: string }
```

IDs are assigned by the server (max existing id + 1). Names are validated (trimmed, length-limited, restricted character set).

### List kinds

```ts
type ListKind = 'todo' | 'travel' | 'shopping'
```

### Task bucket (per user, per kind)

```ts
{
  active: string[];      // items still open
  completed: string[];   // items marked done
}
```

### On-disk shape

**`server/data/users.json`**

```json
{ "users": [ { "id": 1, "name": "Ankit" } ] }
```

**`server/data/lists.json`**

```json
{
  "todo": {
    "1": { "active": ["…"], "completed": ["…"] }
  },
  "travel": { "1": { "active": [], "completed": [] } },
  "shopping": { "1": { "active": [], "completed": [] } }
}
```

Keys under each kind are **stringified user ids**. Creating a user also creates empty buckets for that user under all three kinds.

---

## Server (`server/`)

### Entry and app wiring

| File | Responsibility |
|------|----------------|
| `src/index.ts` | Reads `PORT` (default `8080`), creates the app, listens |
| `src/app.ts` | Middleware, mounts routes, optional SPA static serving, error handler |
| `src/routes/users.ts` | User list / create |
| `src/routes/lists.ts` | Get / replace a user’s bucket for a list kind |
| `src/store/jsonStore.ts` | Async read/write of the JSON files under `server/data/` |
| `src/validation.ts` | Zod schemas for request bodies and list kinds |
| `src/types.ts` | Shared TypeScript types |

### Middleware stack (`createApp`)

1. **helmet** — baseline HTTP security headers (CSP left off here so the SPA’s `_headers` / host config can own CSP in static deploys).
2. **cors** — only origins from `CLIENT_ORIGIN` (comma-separated; default `http://localhost:5173`), methods `GET` / `POST` / `PUT`.
3. **express.json({ limit: '32kb' })** — JSON bodies only, size-capped.
4. **Routers** under `/api/users` and `/api/lists`.
5. **Static SPA** (if `client/dist` exists) — assets + HTML fallback for client-side routes; `/api` paths are never swallowed by the SPA fallback.
6. **Error middleware** — logs and returns `{ error: 'Internal server error' }` with status 500.

### API surface

| Method | Path | Behavior |
|--------|------|----------|
| `GET` | `/api/health` | `{ ok: true }` for liveness checks |
| `GET` | `/api/users` | `{ users: User[] }` |
| `POST` | `/api/users` | Body `{ name }`; validates; creates user + empty list buckets; `201` + `{ user }` |
| `GET` | `/api/lists/:kind?userId=` | `:kind` must be `todo` \| `travel` \| `shopping`; returns `{ kind, userId, bucket }` (creates empty bucket if missing) |
| `PUT` | `/api/lists/:kind` | Body `{ userId, bucket }`; validates schema and that the user exists; replaces that user’s bucket for the kind |

Invalid input yields `400` with `{ error: "…" }`. Unknown user on list write yields `404`.

### Persistence (`jsonStore`)

- All file paths are fixed under `server/data/` (no client-controlled paths).
- Reads/writes use `fs/promises`.
- Missing files are created from empty defaults.
- List updates replace one user’s bucket for one kind; they do **not** accept an unvalidated dump of the entire `lists.json` file from the client.
- Bucket contents are constrained by Zod (string length, max array size) before write.

### Validation highlights

- User name: required, trimmed, max 80 chars, Unicode letter/number-friendly pattern.
- Buckets: each item 1–500 characters; at most 500 items per `active` / `completed` array.
- `userId` must be a positive integer.

---

## Client (`client/`)

### Bootstrap

`src/main.tsx` mounts the React tree with `createRoot`, loads Bootstrap CSS, and renders `<App />` under `StrictMode`.

### Routing and layout (`App.tsx`)

`UserProvider` wraps the whole app so every screen shares the selected user.

Routes:

| Path | Page |
|------|------|
| `/` | `HomePage` — animated intro + cards linking to each list |
| `/todo` | `ListPage` with `kind="todo"` |
| `/travel` | `ListPage` with `kind="travel"` |
| `/shopping` | `ListPage` with `kind="shopping"` |
| `*` | Redirect to `/` |

`AppNavbar` is always visible: brand logo, list links, and the user dropdown.

### User state (`context/UserContext.tsx`)

On mount, loads users from `GET /api/users` and selects the first user (or keeps the current selection if still present).

Exposes:

- `users`, `selectedUser`, `loading`, `error`
- `selectUser(user)` — switch profile (lists reload because `ListPage` depends on `selectedUser`)
- `createUser(name)` — `POST /api/users`, then append and select the new user
- `refreshUsers()` — reload from the API

There is no login session; selection lives only in React state for the browser tab.

### API client (`api/client.ts`)

Thin typed wrappers around `fetch`:

- Base URL: `import.meta.env.VITE_API_BASE` or `/api`
- JSON request/response helpers
- Surfaces server `error` messages as thrown `Error`s

Functions: `fetchUsers`, `createUser`, `fetchList`, `saveList`.

### List UI (`pages/ListPage.tsx`)

One component for all three kinds. For the selected user it:

1. Loads the bucket with `fetchList(kind, userId)`.
2. Renders **Active** and **Completed** columns.
3. **Add** opens a modal; new text is appended to `active` and saved with `saveList`.
4. **Check** moves an item from `active` → `completed`.
5. **Trash** removes an item from either column.
6. Every mutation persists the full bucket for that user/kind via `PUT`.

If no user is selected, it prompts the user to create or select one.

### Supporting UI

| Piece | Role |
|-------|------|
| `components/AppNavbar.tsx` | Navigation + branding |
| `components/UserDropdown.tsx` | Select user / inline create form |
| `components/UserCard.tsx` | Compact user row in the dropdown |
| `pages/HomePage.tsx` | Marketing-style landing with timed animations |
| `types/index.ts` | Shared client types + `LIST_META` (titles, paths, blurbs) |

Styling is Bootstrap 5 via `react-bootstrap`, plus small CSS modules for home animations and list button spacing. Icons come from Font Awesome 6.

### Dev proxy (`vite.config.ts`)

```ts
proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } }
```

So client code can use relative `/api/...` in both development and production (when the API and SPA share a host).

---

## Request flow examples

### Switch user and open To-Do

1. User picks a profile in `UserDropdown` → `selectUser`.
2. Navigate to `/todo`.
3. `ListPage` sees new `selectedUser` → `GET /api/lists/todo?userId=N`.
4. Server reads `lists.json`, ensures a bucket for `N`, returns it.
5. UI renders active/completed items.

### Mark an item complete

1. Click check on an active item.
2. Client builds a new bucket (item removed from `active`, appended to `completed`).
3. `PUT /api/lists/todo` with `{ userId, bucket }`.
4. Zod validates; store writes only that user’s todo bucket.
5. Response bucket replaces local state.

### Create a user

1. Dropdown form submits a name.
2. `POST /api/users` with `{ name }`.
3. Server validates, appends to `users.json`, seeds empty buckets in `lists.json` for all kinds.
4. Client selects the new user; subsequent list pages load empty buckets until items are added.

---

## Security posture

| Layer | What it does |
|-------|----------------|
| Helmet | Standard browser security headers on API responses |
| CORS allowlist | Blocks arbitrary browser origins from calling the API |
| Body size limit | Reduces oversized JSON abuse |
| Zod validation | Rejects malformed names, kinds, and buckets |
| Path-locked store | JSON files only under `server/data/` |
| No secrets in client | API base is public config only |
| `client/public/_headers` | CSP and related headers for static hosts (Cloudflare Pages / Netlify). Applied on deploy, not by the Vite dev server |

**Not in scope:** authentication, authorization between users, multi-instance locking on the JSON files, or a real database. Concurrent writes from multiple processes can race; this design targets a local / workshop-scale service.

---

## Scripts and environments

| Command | Effect |
|---------|--------|
| `npm run dev` | Client + server watch mode |
| `npm run build` | `tsc` + Vite build for both packages |
| `npm start` | Run compiled server (serves SPA if built) |
| `npm run lint` | Oxlint on the client |

Useful env vars:

| Variable | Where | Meaning |
|----------|--------|---------|
| `PORT` | Server | Listen port (default `8080`) |
| `CLIENT_ORIGIN` | Server | Allowed CORS origin(s), comma-separated |
| `VITE_API_BASE` | Client (build-time) | API prefix (default `/api`) |

---

## Mental model

Think of JustList as:

1. A **React SPA** that only knows about users and three list kinds.
2. A **small Express service** that validates input and maps HTTP to JSON file updates.
3. A **file-backed store** that is easy to inspect and reset by editing `server/data/`.

The client owns UX and optimistic local edits that always finish with a full-bucket `PUT`. The server owns identity assignment, validation, and durable storage.
