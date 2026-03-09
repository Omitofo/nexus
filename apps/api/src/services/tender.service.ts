// apps/api/src/services/tender.service.ts
// Tender data access layer. All DB calls go through here.
import { supabaseAdmin } from "../config/supabase.js"
import type { CreateTenderInput } from "@nexus/shared"

export const tenderService = {
  async listForUser(user: { id: string; role: string }) {
    let query = supabaseAdmin.from("tenders").select("*").order("created_at", { ascending: false })
    // Clients only see their own tenders (defense-in-depth on top of RLS)
    if (user.role === "client") {
      query = query.eq("client_user_id", user.id)
    }
    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data
  },

  async findById(id: string, user: { id: string; role: string }) {
    const { data, error } = await supabaseAdmin
      .from("tenders")
      .select("*")
      .eq("id", id)
      .single()
    if (error) return null
    // Extra check: clients can only see their own tenders
    if (user.role === "client" && data.client_user_id !== user.id) return null
    return data
  },

  async create(input: CreateTenderInput & { clientUserId?: string | null }, createdBy: string) {
    const { data, error } = await supabaseAdmin
      .from("tenders")
      .insert({
        type:              input.type,
        name:              input.name,
        product:           input.product,
        volume_mt:         input.volumeMt,
        delivery_date:     input.deliveryDate,
        delivery_location: input.deliveryLocation,
        created_by:        createdBy,
        client_user_id:    input.clientUserId ?? null,
        status:            "DRAFT",
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from("tenders")
      .update({ status })
      .eq("id", id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}
