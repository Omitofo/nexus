import { z } from "zod"

// Used when an operator manually enters a quote on behalf of a node.
export const ManualQuoteSchema = z.object({
  tenderId: z.string().uuid(),
  nodeId: z.string().uuid(),
  pricePerUnit: z.number().positive(),
  currency: z.string().default("USD"),
  validUntil: z.string().datetime().optional(),
  leadTimeDays: z.number().int().positive().optional(),
  notes: z.string().max(1000).optional().nullable(),
})

export type ManualQuoteInput = z.infer<typeof ManualQuoteSchema>