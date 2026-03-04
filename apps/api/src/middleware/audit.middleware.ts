// Logs every write action to the audit_log table.
// Call this after any operation that modifies data.
import { supabaseAdmin } from "../config/supabase.js"
import { FastifyRequest } from "fastify"

interface AuditOptions {
  action: string       // e.g. "tender.create"
  resource?: string    // e.g. "tender:abc-123"
  metadata?: object
}

export async function logAudit(request: FastifyRequest, options: AuditOptions) {
  // Fire and forget - do not block the response for audit logging
  supabaseAdmin.from("audit_log").insert({
    user_id:    request.user?.id ?? null,
    user_email: request.user?.email ?? null,
    action:     options.action,
    resource:   options.resource ?? null,
    ip_address: request.ip,
    user_agent: request.headers["user-agent"] ?? null,
    metadata:   options.metadata ?? null,
  }).then(() => {}).catch(console.error)
}
