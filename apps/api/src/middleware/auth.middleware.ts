// Verifies Supabase JWT on every protected route.
// Attaches the verified user to the request for downstream handlers.
import { FastifyRequest, FastifyReply } from "fastify"
import { supabaseAdmin } from "../config/supabase.js"

// Extend FastifyRequest so TypeScript knows about request.user
declare module "fastify" {
  interface FastifyRequest {
    user?: { id: string; email: string; role: string }
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Missing authorization header" })
  }

  const token = authHeader.replace("Bearer ", "")

  // Supabase verifies the token signature using the JWT secret
  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data.user) {
    return reply.status(401).send({ error: "Invalid or expired token" })
  }

  // Fetch the user's role from our profiles table
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  request.user = {
    id: data.user.id,
    email: data.user.email ?? "",
    role: profile?.role ?? "viewer"
  }
}

// Only allows operators through
export async function requireOperator(request: FastifyRequest, reply: FastifyReply) {
  await requireAuth(request, reply)
  if (request.user?.role !== "operator") {
    return reply.status(403).send({ error: "Operator access required" })
  }
}
