# NEXUS — API Reference

Base URL: `http://localhost:3001` (dev) / `https://api.your-domain.com` (prod)

All protected routes require: `Authorization: Bearer <supabase_jwt>`

## Health

```
GET /health
→ { status: "ok", ts: "2026-03-03T..." }
```

## Auth

```
GET /auth/me                   → Profile (requires auth)
```

## Tenders

```
GET    /tenders                → Tender[]
GET    /tenders/:id            → Tender
POST   /tenders                → Tender          (operator only)
PATCH  /tenders/:id/status     → Tender          (operator only)
```

POST body:
```json
{
  "type": "REAL" | "SANDBOX",
  "name": "string",
  "product": "LNG" | "NG" | "CNG",
  "volumeMt": 50000,
  "deliveryDate": "2026-06-01T00:00:00Z",
  "deliveryLocation": "Barcelona, Spain",
  "clientUserId": "uuid" // optional
}
```

## Nodes

```
GET  /nodes                    → SupplyChainNode[]
GET  /nodes/:id                → SupplyChainNode
POST /nodes                    → SupplyChainNode  (operator only)
PATCH /nodes/:id               → SupplyChainNode  (operator only)
```

## Quotes

```
GET  /quotes/:tenderId         → Quote[]          (operator only)
POST /quotes/broadcast/:tenderId → { sent, nodeCount }  (operator only)
POST /quotes/manual            → Quote            (operator only)
```

Manual quote body:
```json
{
  "tenderId": "uuid",
  "nodeId": "uuid",
  "pricePerUnit": 12.50,
  "currency": "USD",
  "validUntil": "2026-04-01T00:00:00Z",
  "leadTimeDays": 45
}
```

## Chain / Greedy

```
GET  /chain/:tenderId          → Chain[]          (operator only)
POST /chain/greedy/:tenderId   → Chain[]          (operator only) — runs algorithm
POST /chain/select             → { success: true } (operator only)
```

Select body:
```json
{ "tenderId": "uuid", "chainId": "uuid" }
```

## Portal (public — rate limited 10/hour)

```
POST /portal/request           → { received: true }
```

Body:
```json
{
  "companyName": "Acme Energy",
  "email": "procurement@acme.com",
  "product": "LNG",
  "volumeMt": 50000,
  "deliveryDate": "2026-06-01",
  "deliveryLocation": "Barcelona, Spain"
}
```

## Error Responses

All errors follow this shape:
```json
{ "error": "Human readable message", "details": {} }
```

| Status | Meaning |
|--------|---------|
| 400 | Validation failed |
| 401 | Missing or invalid JWT |
| 403 | Insufficient role |
| 404 | Resource not found |
| 429 | Rate limited |
| 500 | Server error |
