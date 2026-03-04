// Auth routes - minimal because Supabase handles token issuance.
// We only need a route to get the current user's profile.
import { FastifyInstance } from "fastify"
import { requireAuth } from "../middleware/auth.middleware.js"
import { supabaseAdmin } from "../config/supabase.js"

export async function authRoutes(server: FastifyInstance) {
  // GET /auth/me - returns the authenticated user's profile
  server.get("/me", { preHandler: requireAuth }, async (request, reply) => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", request.user!.id)
      .single()

    if (error) return reply.status(404).send({ error: "Profile not found" })
    return reply.send(data)
  })
}
