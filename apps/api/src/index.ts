// Barrel export for all API-level Zod validation schemas.
// Shared schemas (used by both frontend and backend) live in packages/shared.
// This file holds any API-only schemas (e.g. query param validation).

import { z } from "zod"

// Pagination query params used on list endpoints
export const PaginationSchema = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type PaginationInput = z.infer<typeof PaginationSchema>

// UUID path param validation
export const UUIDParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
})

// Status update body
export const StatusUpdateSchema = z.object({
  status: z.string().min(1),
})
