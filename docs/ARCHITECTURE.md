# NEXUS — Architecture

## System Overview

```
Browser (Next.js 14)
    │
    ├── Supabase Auth        ← login, session, token refresh
    ├── Supabase DB (RLS)    ← direct reads (profile, nodes)
    ├── Supabase Realtime    ← live quote push (no polling)
    └── Fastify API          ← all writes + greedy algorithm
            │
            └── Supabase DB (service role) ← all DB writes
```

## Two Supabase Clients

| Client | Key | Used by | RLS |
|--------|-----|---------|-----|
| Browser client | anon key | Next.js frontend | Enforced |
| Admin client | service role key | Fastify backend | Bypassed |

The service role key **never reaches the browser**. It lives only in the
Fastify process environment.

## Data Flow — Quote Update

1. Operator clicks "Broadcast RFQ" → frontend calls `POST /quotes/broadcast/:tenderId`
2. Fastify creates one quote row per active node (status: SENT)
3. External nodes reply → Fastify upserts quote row (status: REPLIED, price set)
4. Supabase Realtime detects the row change
5. Browser `useRealtimeQuotes` hook receives the payload
6. Zustand `quoteStore` updates → React re-renders quote list and canvas nodes

## Greedy Algorithm Location

`apps/api/src/services/greedy.service.ts`

Runs server-side only (Fastify). Requires Node.js for graph traversal.
Returns top 3 scored paths. Saves all 3 to `chains` table.
See `docs/GREEDY_ALGORITHM.md` for full documentation.

## Monorepo Layout

```
nexus/
├── apps/web/     Next.js 14 — user interface
├── apps/api/     Fastify — business logic, writes, greedy
├── packages/shared/  Types and Zod schemas used by both apps
└── supabase/     DB migrations and seed data
```

## Auth Flow

1. User submits email + password on `/login`
2. Supabase Auth validates → returns signed JWT + refresh token
3. `@supabase/ssr` stores tokens in cookies (not localStorage)
4. On every API call to Fastify, frontend sends `Authorization: Bearer <jwt>`
5. Fastify `auth.middleware.ts` calls `supabaseAdmin.auth.getUser(token)`
6. Verified user + role attached to request for downstream handlers

## Deployment Targets

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | Auto-deploys from `apps/web` |
| Backend | Render or Railway | `apps/api`, always-on free tier ok |
| Database | Supabase Cloud | Managed Postgres + Auth + Realtime |
