# JustList

A TypeScript React + Express app for personal lists: to-do, travel, and shopping.

## Requirements

- Node.js **20.19+** or **22.12+** (Vite 7)
- npm 10+

## Setup

```bash
cd just-list
nvm use
npm install
npm run dev
```

This starts:

- **Client** (Vite): http://localhost:5173
- **API** (Express): http://localhost:8080

The Vite dev server proxies `/api` to the Express API.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client and server in watch mode |
| `npm run build` | Build client (`client/dist`) and server (`server/dist`) |
| `npm start` | Run the compiled server (serves `client/dist` when present) |

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/users` | List users |
| `POST` | `/api/users` | Create user `{ "name": "..." }` |
| `GET` | `/api/lists/:kind?userId=` | Get list (`todo` \| `travel` \| `shopping`) |
| `PUT` | `/api/lists/:kind` | Save list `{ "userId", "bucket": { "active", "completed" } }` |

Data files live under `server/data/`.

## Security

- Express uses `helmet`, restricted CORS, JSON body size limits, and Zod validation.
- Static deploy hosts can use `client/public/_headers` for CSP and related headers.
