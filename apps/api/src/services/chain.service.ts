// Chain persistence - save and retrieve chain results.
import { supabaseAdmin } from "../config/supabase.js"

export const chainService = {
  async listByTender(tenderId: string) {
    const { data, error } = await supabaseAdmin
      .from("chains").select("*").eq("tender_id", tenderId).order("overall_score", { ascending: false })
    if (error) throw new Error(error.message)
    return data
  },

  async save(chain: {
    tenderId: string
    isGreedyOptimal: boolean
    nodeSequence: string[]
    totalCostPerUnit: number
    estimatedDeliveryDays: number
    overallScore: number
    scoreBreakdown: { price: number; risk: number; compliance: number; insurance: number; reputation: number }
  }) {
    const { data, error } = await supabaseAdmin
      .from("chains")
      .insert({
        tender_id:               chain.tenderId,
        is_greedy_optimal:       chain.isGreedyOptimal,
        node_sequence:           chain.nodeSequence,
        total_cost_per_unit:     chain.totalCostPerUnit,
        estimated_delivery_days: chain.estimatedDeliveryDays,
        overall_score:           chain.overallScore,
        score_price:             chain.scoreBreakdown.price,
        score_risk:              chain.scoreBreakdown.risk,
        score_compliance:        chain.scoreBreakdown.compliance,
        score_insurance:         chain.scoreBreakdown.insurance,
        score_reputation:        chain.scoreBreakdown.reputation,
      })
      .select().single()
    if (error) throw new Error(error.message)
    return data
  },

  async selectChain(tenderId: string, chainId: string) {
    await supabaseAdmin
      .from("tenders")
      .update({ selected_chain_id: chainId, status: "OPTIMAL_FOUND" })
      .eq("id", tenderId)
  }
}
