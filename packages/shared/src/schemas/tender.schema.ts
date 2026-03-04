import { z } from "zod"

// Used for validating create-tender request bodies.
// Applied on both the frontend (form validation) and backend (API guard).
export const CreateTenderSchema = z.object({
  type: z.enum(["REAL", "SANDBOX"]),
  name: z.string().min(2).max(100),
  product: z.enum(["LNG", "NG", "CNG"]),
  volumeMt: z.number().positive(),
  deliveryDate: z.string().datetime(),
  deliveryLocation: z.string().min(2).max(200),
  clientUserId: z.string().uuid().optional(),
})

export type CreateTenderInput = z.infer<typeof CreateTenderSchema>