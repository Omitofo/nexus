# NEXUS — Setup Guide (Supabase Cloud)

No Docker required. Everything runs against your Supabase cloud project.

---

## Step 1: Prerequisites

- **Node.js 20 LTS** — https://nodejs.org
- **pnpm 9+** — run: `npm install -g pnpm`
- A **Supabase account** — https://supabase.com (free tier is fine)

---

## Step 2: Create your Supabase project

1. Go to https://supabase.com/dashboard
2. Click **New project**
3. Choose a name (e.g. `nexus-prod`), set a strong DB password, pick a region close to you
4. Wait ~2 minutes for provisioning

---

## Step 3: Collect your credentials

In your Supabase project dashboard:

| Where to find it | Key name |
|---|---|
| Settings → API → Project URL | `SUPABASE_URL` |
| Settings → API → anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Settings → API → service_role secret | `SUPABASE_SERVICE_ROLE_KEY` |
| Settings → API → JWT Secret | `SUPABASE_JWT_SECRET` |

> **Warning:** The service_role key bypasses all Row Level Security.
> Never put it in your frontend. It goes only in `apps/api/.env`.

---

## Step 4: Run the database migrations

You have two options. Option A is the simplest.

### Option A — Supabase SQL Editor (recommended, no CLI needed)

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Open each migration file from `supabase/migrations/` **in order** and paste + run each one:

```
20260303000001_create_profiles.sql
20260303000002_create_tenders.sql
20260303000003_create_nodes.sql
20260303000004_create_quotes.sql
20260303000005_create_chains.sql
20260303000006_create_audit_log.sql
20260303000007_rls_policies.sql
```

4. After all migrations, paste and run `supabase/seed.sql` to load sample nodes.

### Option B — Supabase CLI (no Docker needed with --db-url)

```bash
# Install CLI
npm install -g supabase

# Link to your cloud project (no Docker)
supabase login
supabase link --project-ref YOUR_PROJECT_REF
# Your project ref is in Settings → General → Reference ID

# Push all migrations at once
supabase db push --db-url "postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# Seed data
psql "postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres" -f supabase/seed.sql
```

> Your DB password is the one you set when creating the project.
> Connection string is at: Settings → Database → Connection string → URI

---

## Step 5: Configure Supabase Auth

In your Supabase dashboard:

1. **Authentication → Providers → Email** — make sure it is enabled
2. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (change to your production URL later)
   - Redirect URLs: add `http://localhost:3000/**`
3. **Authentication → Email Templates** — customise if you want

---

## Step 6: Create your first operator user

1. Go to **Authentication → Users → Add user → Create new user**
2. Enter an email and password
3. Go to **Table Editor → profiles**
4. Find the new user's row and set `role` to `operator`

---

## Step 7: Set environment variables

```bash
# Frontend
cp .env.example apps/web/.env.local

# Backend
cp .env.example apps/api/.env
```

Edit `apps/web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Edit `apps/api/.env`:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## Step 8: Install dependencies and start

```bash
pnpm install
pnpm dev

# Frontend  → http://localhost:3000
# API       → http://localhost:3001
```

Log in at http://localhost:3000 with the operator account you created.

---

## Enabling Realtime (important)

Supabase Realtime on the quotes table needs to be explicitly enabled:

1. Go to **Database → Replication** in your dashboard
2. Under **Supabase Realtime**, find the `quotes` table
3. Toggle it **on**

Alternatively, the migration file `20260303000004_create_quotes.sql` already
includes `ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;`
which does this automatically when you run it via the SQL editor.

---

## Deploying to production

### Frontend → Vercel

```bash
# Install Vercel CLI or connect via vercel.com dashboard
npm install -g vercel
cd apps/web
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_API_URL  (your Render/Railway URL)
```

### Backend → Render

1. Go to https://render.com → New Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `apps/api`
   - **Build command:** `npm install -g pnpm && pnpm install && pnpm build`
   - **Start command:** `pnpm start`
4. Add environment variables (all from `apps/api/.env`)
5. Set `CORS_ORIGIN` to your Vercel frontend URL
6. Set `NODE_ENV` to `production`

### Update Supabase Auth for production

In Supabase dashboard → Authentication → URL Configuration:
- Site URL: your Vercel URL (e.g. `https://nexus.vercel.app`)
- Add redirect URL: `https://nexus.vercel.app/**`

---

## Useful SQL Editor queries

```sql
-- Check all profiles and their roles
SELECT id, email, role, created_at FROM public.profiles ORDER BY created_at DESC;

-- Promote a user to operator
UPDATE public.profiles SET role = 'operator' WHERE email = 'you@example.com';

-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' ORDER BY tablename;

-- See audit log
SELECT user_email, action, resource, created_at
FROM public.audit_log ORDER BY created_at DESC LIMIT 50;

-- Check realtime is enabled on quotes
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```
