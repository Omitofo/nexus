# NEXUS — Security Implementation

## OWASP Top 10 Checklist

| # | Threat | Status | Implementation |
|---|--------|--------|----------------|
| A01 | Broken Access Control | ✅ | Supabase RLS + role checks in Fastify |
| A02 | Cryptographic Failures | ✅ | HTTPS, bcrypt via Supabase, JWT RS256 |
| A03 | Injection | ✅ | Zod validation, Supabase parameterized queries |
| A04 | Insecure Design | ✅ | REAL/SANDBOX isolation, audit log |
| A05 | Security Misconfiguration | ✅ | Helmet.js, env validation at startup |
| A06 | Vulnerable Components | ✅ | Minimal deps, pinned versions, pnpm audit |
| A07 | Auth Failures | ✅ | Rate limit on login, 1h session expiry |
| A08 | Integrity Failures | ✅ | Signed JWT, no eval(), CSP headers |
| A09 | Logging Failures | ✅ | Append-only audit_log table |
| A10 | SSRF | ✅ | Domain whitelist for price feed URLs |

## Key Principles

1. **Two Supabase clients, two trust levels**
   - Frontend (anon key): RLS enforced — cannot see other users data
   - Backend (service role key): bypasses RLS — trusted server only

2. **Audit log is immutable**
   - SQL rules prevent UPDATE and DELETE on audit_log
   - Only Fastify (service role) can INSERT

3. **Portal is honeypot-protected**
   - Hidden "website" field in the portal form
   - Bots fill it; humans don't — silent reject if filled

4. **Environment validation on startup**
   - Server refuses to start if any required env var is missing
   - Prevents misconfigured deploys from running silently broken
