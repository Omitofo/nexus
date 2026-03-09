// apps/api/src/routes/quotes.routes.ts

// Quote routes: broadcast RFQ and manual quote entry.
import { FastifyInstance } from "fastify"
import { requireOperator } from "../middleware/auth.middleware.js"
import { logAudit } from "../middleware/audit.middleware.js"
import { rfqService } from "../services/rfq.service.js"
import { quoteService } from "../services/quote.service.js"
import { ManualQuoteSchema } from "@nexus/shared"

export async function quoteRoutes(server: FastifyInstance) {
  // POST /quotes/broadcast/:tenderId - send RFQ to all active nodes
  server.post("/broadcast/:tenderId", { preHandler: requireOperator }, async (request, reply) => {
    const { tenderId } = request.params as { tenderId: string }
    const result = await rfqService.broadcastRfq(tenderId)
    await logAudit(request, { action: "rfq.broadcast", resource: `tender:${tenderId}`, metadata: result })
    return reply.send(result)
  })

  // POST /quotes/manual - operator enters a quote on behalf of a node
  server.post("/manual", { preHandler: requireOperator }, async (request, reply) => {
    const parsed = ManualQuoteSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten() })
    }
    const quote = await quoteService.createOrUpdateManual(parsed.data)
    await logAudit(request, { action: "quote.manual_entry", resource: `quote:${quote.id}` })
    return reply.send(quote)
  })

  // GET /quotes/:tenderId - all quotes for a tender
  server.get("/:tenderId", { preHandler: requireOperator }, async (request, reply) => {
    const { tenderId } = request.params as { tenderId: string }
    const quotes = await quoteService.listByTender(tenderId)
    return reply.send(quotes)
  })
}
