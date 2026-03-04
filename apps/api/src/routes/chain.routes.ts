// Chain routes: run greedy algorithm and save selected chain.
import { FastifyInstance } from "fastify"
import { requireOperator } from "../middleware/auth.middleware.js"
import { logAudit } from "../middleware/audit.middleware.js"
import { greedyService } from "../services/greedy.service.js"
import { chainService } from "../services/chain.service.js"

export async function chainRoutes(server: FastifyInstance) {
  // POST /chain/greedy/:tenderId - run the greedy algorithm
  server.post("/greedy/:tenderId", { preHandler: requireOperator }, async (request, reply) => {
    const { tenderId } = request.params as { tenderId: string }
    const results = await greedyService.findOptimalPaths(tenderId)
    await logAudit(request, {
      action: "greedy.run",
      resource: `tender:${tenderId}`,
      metadata: { topScore: results[0]?.overallScore }
    })
    return reply.send(results)
  })

  // POST /chain/select - save the operator's chosen chain
  server.post("/select", { preHandler: requireOperator }, async (request, reply) => {
    const { tenderId, chainId } = request.body as { tenderId: string; chainId: string }
    await chainService.selectChain(tenderId, chainId)
    await logAudit(request, { action: "chain.select", resource: `chain:${chainId}` })
    return reply.send({ success: true })
  })

  // GET /chain/:tenderId - all saved chains for a tender
  server.get("/:tenderId", { preHandler: requireOperator }, async (request, reply) => {
    const { tenderId } = request.params as { tenderId: string }
    const chains = await chainService.listByTender(tenderId)
    return reply.send(chains)
  })
}
