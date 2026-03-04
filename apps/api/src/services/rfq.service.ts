// RFQ (Request for Quote) service.
// Creates a quote row (status: SENT) for every active node
// when an operator broadcasts an RFQ for a tender.
// In a real system, this would also send emails or webhook calls.
import { supabaseAdmin } from "../config/supabase.js"

export const rfqService = {
  async broadcastRfq(tenderId: string) {
    // Get all active nodes
    const { data: nodes, error: nodesError } = await supabaseAdmin
      .from("nodes").select("id, rfq_email, type").eq("is_active", true)
    if (nodesError) throw new Error(nodesError.message)

    // Create a quote row for each node (skip if already exists)
    const quoteRows = nodes.map((node: { id: string }) => ({
      tender_id: tenderId,
      node_id:   node.id,
      status:    "SENT",
      currency:  "USD",
    }))

    const { data, error } = await supabaseAdmin
      .from("quotes")
      .upsert(quoteRows, { onConflict: "tender_id,node_id", ignoreDuplicates: true })
      .select()
    if (error) throw new Error(error.message)

    // Update tender status to RFQ_SENT
    await supabaseAdmin
      .from("tenders").update({ status: "RFQ_SENT" }).eq("id", tenderId)

    // TODO Phase 9: Send actual emails/webhooks to each node's rfq_email / rfq_webhook_url

    return { sent: data?.length ?? 0, nodeCount: nodes.length }
  }
}
