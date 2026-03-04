// Validates all required environment variables at startup.
// If any are missing the server refuses to start. (OWASP A05)
import { z } from "zod"

const EnvSchema = z.object({
  SUPABASE_URL:              z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET:       z.string().min(1),
  PORT:         z.coerce.number().default(3001),
  NODE_ENV:     z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN:  z.string().url().default("http://localhost:3000"),
  PRICE_FEED_API_KEY:  z.string().optional(),
  PRICE_FEED_BASE_URL: z.string().url().optional(),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:")
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
