// Portal routes - public facing. No auth required.
// Heavily rate limited to prevent abuse.
import { FastifyInstance } from "fastify"
import { tenderService } from "../services/tender.service.js"
import { supabaseAdmin } from "../config/supabase.js"

export async function portalRoutes(server: FastifyInstance) {
  // POST /portal/request - client submits a rate request
  // This creates a REAL tender and notifies operators.
  server.post(
    "/request",
    {
      config: { rateLimit: { max: 10, timeWindow: "1 hour" } }
    },
    async (request, reply) => {
      const body = request.body as {
        companyName: string
        email: string
        product: string
        volumeMt: number
        deliveryDate: string
        deliveryLocation: string
        // Honeypot: bots fill this, humans leave it empty
        website?: string
      }

      // Honeypot check - if this field is filled, it is a bot
      if (body.website) {
        return reply.status(200).send({ received: true }) // Silent reject
      }

      // Create Supabase auth user for the client
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        password: crypto.randomUUID(), // They will use magic link to sign in
        user_metadata: { role: "client" },
        email_confirm: true,
      })

      if (authError && authError.message !== "User already registered") {
        return reply.status(500).send({ error: "Could not create account" })
      }

      const clientUserId = authData?.user?.id

      // Create a REAL tender linked to the client
      await tenderService.create({
        type: "REAL",
        name: `${body.companyName} - ${body.product} Request`,
        product: body.product as "LNG" | "NG" | "CNG",
        volumeMt: body.volumeMt,
        deliveryDate: body.deliveryDate,
        deliveryLocation: body.deliveryLocation,
        clientUserId,
      }, "system")

      return reply.send({ received: true, message: "Your request has been received." })
    }
  )
}
