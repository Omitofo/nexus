# NEXUS — Supply Chain Intelligence Platform

Gas supply chain optimization dashboard. Create tenders, broadcast RFQs,
receive quotes in real-time, and find the optimal supply chain path using
the greedy algorithm.

## Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | Next.js 14, TypeScript, Tailwind CSS |
| Graph Canvas | React Flow v11                |
| State        | Zustand + TanStack Query      |
| Backend      | Fastify v4, Node.js 20 LTS    |
| Database     | Supabase (PostgreSQL 15)       |
| Auth         | Supabase Auth                 |
| Realtime     | Supabase Realtime             |
| Monorepo     | Turborepo + pnpm              |

## Prerequisites

- Node.js 20 LTS
- pnpm 9+
- Docker Desktop (for Supabase local dev)

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Initialize Supabase
npx supabase init
npx supabase start

# 3. Copy and fill environment variables
cp .env.example apps/web/.env.local
cp .env.example apps/api/.env
# Edit both files with your Supabase project credentials

# 4. Run database migrations
npx supabase db push

# 5. Seed development data
npx supabase db reset

# 6. Start all dev servers
pnpm dev

# Frontend  -> http://localhost:3000
# Backend   -> http://localhost:3001
# Supabase  -> http://localhost:54321 (API)
# Studio    -> http://localhost:54323 (DB GUI)
```

## Project Structure

```
nexus/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # Fastify backend
├── packages/
│   └── shared/       # Shared types and Zod schemas
├── supabase/
│   ├── migrations/   # Database migrations
│   └── seed.sql      # Development seed data
└── docs/             # Project documentation
```

## Build Phases

See `docs/PROJECT_PLAN.md` for the full 10-phase build plan.

Current status: **Phase 0 — Foundation complete**

## Security

This project implements OWASP Top 10 mitigations. See `docs/SECURITY.md`.

- Input validation with Zod on every endpoint
- Supabase Row Level Security on all tables
- JWT verification via Supabase on every protected route
- Rate limiting on all API routes
- Audit log for all write operations
- SSRF prevention on external price feed calls
