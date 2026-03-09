// apps/api/src/services/quote.service.ts

// Quote data access layer.
import { supabaseAdmin } from "../config/supabase.js"
import type { ManualQuoteInput } from "@nexus/shared"

export const quoteService = {
  async listByTender(tenderId: string) {
    const { data, error } = await supabaseAdmin
      .from("quotes").select("*").eq("tender_id", tenderId)
    if (error) throw new Error(error.message)
    return data
  },

  // Upsert: creates the quote if it doesn't exist, updates if it does.
  // This handles both first-time manual entry and updates.
  async createOrUpdateManual(input: ManualQuoteInput) {
    const { data, error } = await supabaseAdmin
      .from("quotes")
      .upsert({
        tender_id:      input.tenderId,
        node_id:        input.nodeId,
        status:         "REPLIED",
        price_per_unit: input.pricePerUnit,
        currency:       input.currency,
        valid_until:    input.validUntil ?? null,
        lead_time_days: input.leadTimeDays ?? null,
        notes:          input.notes ?? null,
        received_at:    new Date().toISOString(),
      }, { onConflict: "tender_id,node_id" })
      .select().single()
    if (error) throw new Error(error.message)
    return data
  }
}
