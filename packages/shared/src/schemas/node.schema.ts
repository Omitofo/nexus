import { z } from "zod"

export const NodeTypeValues = [
  "GAS_SOURCE", "TRADER", "LIQUEFACTION",
  "TRANSPORT", "REGASIFICATION", "STORAGE"
] as const

export const CreateNodeSchema = z.object({
  type: z.enum(NodeTypeValues),
  name: z.string().min(2).max(100),
  companyName: z.string().min(2).max(150),
  country: z.string().length(2),  // ISO 3166-1 alpha-2
  reputationScore: z.number().min(0).max(100),
  insuranceClass: z.string().min(1).max(50),
  certifications: z.array(z.string()).default([]),
  regulatoryRating: z.number().min(0).max(100),
  rfqEmail: z.string().email(),
  rfqWebhookUrl: z.string().url().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
})

export type CreateNodeInput = z.infer<typeof CreateNodeSchema>