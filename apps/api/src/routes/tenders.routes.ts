// Tender CRUD routes.
import { FastifyInstance } from "fastify"
import { requireAuth, requireOperator } from "../middleware/auth.middleware.js"
import { logAudit } from "../middleware/audit.middleware.js"
import { tenderService } from "../services/tender.service.js"
import { CreateTenderSchema } from "@nexus/shared"

export async function tenderRoutes(server: FastifyInstance) {
  // GET /tenders - list all tenders for this user
  server.get("/", { preHandler: requireAuth }, async (request, reply) => {
    const tenders = await tenderService.listForUser(request.user!)
    return reply.send(tenders)
  })

  // GET /tenders/:id
  server.get("/:id", { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const tender = await tenderService.findById(id, request.user!)
    if (!tender) return reply.status(404).send({ error: "Not found" })
    return reply.send(tender)
  })

  // POST /tenders - create new tender (operators only)
  server.post("/", { preHandler: requireOperator }, async (request, reply) => {
    const parsed = CreateTenderSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten() })
    }

    const tender = await tenderService.create(parsed.data, request.user!.id)
    await logAudit(request, { action: "tender.create", resource: `tender:${tender.id}` })
    return reply.status(201).send(tender)
  })

  // PATCH /tenders/:id/status - update tender status
  server.patch("/:id/status", { preHandler: requireOperator }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { status } = request.body as { status: string }
    const tender = await tenderService.updateStatus(id, status)
    await logAudit(request, { action: "tender.status_update", resource: `tender:${id}`, metadata: { status } })
    return reply.send(tender)
  })
}
