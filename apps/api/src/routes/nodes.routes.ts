// Node registry CRUD routes.
import { FastifyInstance } from "fastify"
import { requireAuth, requireOperator } from "../middleware/auth.middleware.js"
import { logAudit } from "../middleware/audit.middleware.js"
import { nodeService } from "../services/node.service.js"
import { CreateNodeSchema } from "@nexus/shared"

export async function nodeRoutes(server: FastifyInstance) {
  // GET /nodes - list all active nodes
  server.get("/", { preHandler: requireAuth }, async (request, reply) => {
    const nodes = await nodeService.listActive()
    return reply.send(nodes)
  })

  // GET /nodes/:id
  server.get("/:id", { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const node = await nodeService.findById(id)
    if (!node) return reply.status(404).send({ error: "Not found" })
    return reply.send(node)
  })

  // POST /nodes (operators only)
  server.post("/", { preHandler: requireOperator }, async (request, reply) => {
    const parsed = CreateNodeSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten() })
    }
    const node = await nodeService.create(parsed.data)
    await logAudit(request, { action: "node.create", resource: `node:${node.id}` })
    return reply.status(201).send(node)
  })

  // PATCH /nodes/:id (operators only)
  server.patch("/:id", { preHandler: requireOperator }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const node = await nodeService.update(id, request.body as object)
    await logAudit(request, { action: "node.update", resource: `node:${id}` })
    return reply.send(node)
  })
}
