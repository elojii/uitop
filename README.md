# Todo App — Full-Stack Monorepo

A full-stack Todo app built with **NestJS** (backend) and **Vite + React** (frontend), managed as a **pnpm** monorepo.

---

## Quick start (local dev)

```bash
# Install all dependencies from repo root
pnpm install

# Terminal 1 — backend
cd backend && pnpm run start:dev

# Terminal 2 — frontend
cd frontend && pnpm run dev
```

Visit `http://localhost:5173`. The backend API runs at `http://localhost:3001`.

---

## Backend

### Tech stack

- **NestJS** (TypeScript) — REST API framework
- **TypeORM** — ORM
- **PostgreSQL** (Neon via Vercel marketplace, via `pg`) — connection string from `POSTGRES_URL` / `DATABASE_URL`
- **class-validator / class-transformer** — DTO validation

### Run locally

```bash
cd backend
pnpm install
pnpm run start:dev   # watch mode
```

Default port: **3001**. Point a Neon (or any) Postgres connection string at the app via one of the accepted env vars.

Copy `.env.example` to `.env` and adjust if needed:

```
PORT=3001
# Vercel Neon marketplace provides these automatically when linked:
POSTGRES_URL=postgres://user:password@host/db?sslmode=require
# Alternatively any of these are also accepted:
# POSTGRES_PRISMA_URL=...
# DATABASE_URL=...
FRONTEND_URL=http://localhost:3000
```

### Run tests

```bash
cd backend
pnpm run test
```

Tests use an in-memory SQLite database (`better-sqlite3`) and do not touch Neon or any real Postgres instance.

### API reference

All error responses have shape `{ "statusCode": number, "message": string | string[] }`.

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `GET` | `/categories` | — | List all categories |
| `GET` | `/todos` | — | List all todos (add `?category=<id>` to filter by category id) |
| `POST` | `/todos` | `{ text, categoryId }` | Create a todo. Returns **400** if category already has 5 tasks |
| `PATCH` | `/todos/:id` | `{ completed }` | Update completed status. Returns **404** if not found |
| `PATCH` | `/todos/bulk-complete` | `{ ids: number[] }` | Mark multiple todos as completed |
| `DELETE` | `/todos/:id` | — | Delete a todo. Returns **404** if not found |

A todo object: `{ id, text, completed, category: { id, name }, createdAt }`.

Default categories seeded on first run: `Work`, `Personal`, `Shopping`, `Health`, `Study`.

### Docker

```bash
docker-compose up backend
```

The database lives in Neon, so no volume is needed — set `POSTGRES_URL` (or `DATABASE_URL`) on the container.

### Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login (interactive browser auth — run this yourself): `railway login`
3. Init project: `railway init`
4. Deploy: `cd backend && railway up`
5. In the Railway dashboard, set env vars:
   - `POSTGRES_URL=<your-neon-pooled-connection-string>` (from Vercel Neon marketplace, or use `DATABASE_URL`)
   - `FRONTEND_URL=<your-vercel-url>`
6. Live API URL: *(paste Railway URL here after deploy)*

---

## Frontend

### Tech stack

- **Vite + React 19** (TypeScript)
- **Tailwind CSS v4** — styling
- **Radix UI** — headless primitives (shadcn/ui pattern with CVA + clsx + tailwind-merge)
- **TanStack Query v5** — server state / data fetching
- **React Hook Form** — form handling
- **Axios** — HTTP client
- **Sonner** — toast notifications
- **Lucide React** — icons

### Run locally

```bash
cd frontend
pnpm install
pnpm run dev
```

Default port: **5173** (Vite default).

Create `frontend/.env.local`:

```
VITE_API_URL=http://localhost:3001
```

### Docker (full stack)

```bash
docker-compose up
```

Both services start. Frontend at `http://localhost:5173`, backend at `http://localhost:3001`.

> **Note:** `VITE_API_URL` is set to `http://backend:3001` inside Docker. For the browser to reach the backend, traffic must be routed through your host — if you need direct browser access to the API outside Docker, set it to `http://localhost:3001` instead and rebuild.

### Deploy to Vercel

1. Install Vercel CLI (optional): `npm i -g vercel`
2. Login (run yourself): `vercel login`
3. From `frontend/`: `vercel --prod`
4. In Vercel project settings → **Environment Variables**, add:
   - `VITE_API_URL` = `<your-railway-backend-url>`
5. Live URL: *(paste Vercel URL here after deploy)*
# uitop
