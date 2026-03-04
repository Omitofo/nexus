// Node registry data access layer.
import { supabaseAdmin } from "../config/supabase.js"
import type { CreateNodeInput } from "@nexus/shared"

export const nodeService = {
  async listActive() {
    const { data, error } = await supabaseAdmin
      .from("nodes")
      .select("*")
      .eq("is_active", true)
      .order("company_name")
    if (error) throw new Error(error.message)
    return data
  },

  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("nodes").select("*").eq("id", id).single()
    if (error) return null
    return data
  },

  async create(input: CreateNodeInput) {
    const { data, error } = await supabaseAdmin
      .from("nodes")
      .insert({
        type:              input.type,
        name:              input.name,
        company_name:      input.companyName,
        country:           input.country,
        reputation_score:  input.reputationScore,
        insurance_class:   input.insuranceClass,
        certifications:    input.certifications,
        regulatory_rating: input.regulatoryRating,
        rfq_email:         input.rfqEmail,
        rfq_webhook_url:   input.rfqWebhookUrl ?? null,
        notes:             input.notes ?? null,
      })
      .select().single()
    if (error) throw new Error(error.message)
    return data
  },

  async update(id: string, updates: object) {
    const { data, error } = await supabaseAdmin
      .from("nodes").update(updates).eq("id", id).select().single()
    if (error) throw new Error(error.message)
    return data
  }
}
