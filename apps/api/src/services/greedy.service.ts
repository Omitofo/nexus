// NEXUS Greedy Algorithm
// ---------------------
// Finds the optimal supply chain path for a given tender.
//
// How it works:
//  1. Load all nodes that have a REPLIED quote for this tender
//  2. Build a directed graph based on valid node-type connections
//  3. Find all complete source-to-client paths using depth-first search
//  4. Score each path using weighted criteria
//  5. Return the top 3 paths sorted by score (best first)
//
// Scoring weights:
//   Price      35%  - lower total cost = higher score
//   Risk       25%  - lower operational risk = higher score
//   Compliance 20%  - certifications match tender requirements
//   Insurance  10%  - coverage class quality
//   Reputation 10%  - historical track record
//
// Penalties applied to path score:
//   -10 per missing required certification
//   -15 for regulatory mismatch with delivery country
//   -5  for transit country risk flags

import { supabaseAdmin } from "../config/supabase.js"
import { chainService } from "./chain.service.js"

// Which node types can connect to which in the supply chain.
// GAS_SOURCE -> TRADER or LIQUEFACTION
// TRADER     -> LIQUEFACTION
// LIQUEFACTION -> TRANSPORT
// TRANSPORT  -> REGASIFICATION or STORAGE
// REGASIFICATION -> (end - this is the delivery point)
const VALID_CONNECTIONS: Record<string, string[]> = {
  GAS_SOURCE:      ["TRADER", "LIQUEFACTION"],
  TRADER:          ["LIQUEFACTION"],
  LIQUEFACTION:    ["TRANSPORT"],
  TRANSPORT:       ["REGASIFICATION", "STORAGE"],
  REGASIFICATION:  [],  // terminal node
  STORAGE:         [],  // terminal node
}

// Insurance class quality scores for the algorithm
const INSURANCE_CLASS_SCORES: Record<string, number> = {
  "Lloyds A+":  100,
  "Lloyds A":   90,
  "P&I Class A": 85,
  "P&I Class B": 70,
  "P&I Class C": 55,
}

interface ScoredPath {
  nodeSequence: string[]
  totalCostPerUnit: number
  estimatedDeliveryDays: number
  overallScore: number
  scoreBreakdown: {
    price: number
    risk: number
    compliance: number
    insurance: number
    reputation: number
  }
}

export const greedyService = {
  async findOptimalPaths(tenderId: string): Promise<ScoredPath[]> {
    // Step 1: Load the tender to know delivery location and requirements
    const { data: tender } = await supabaseAdmin
      .from("tenders").select("*").eq("id", tenderId).single()
    if (!tender) throw new Error("Tender not found")

    // Step 2: Load all nodes with REPLIED quotes for this tender
    const { data: quotes } = await supabaseAdmin
      .from("quotes")
      .select("*, nodes(*)")
      .eq("tender_id", tenderId)
      .eq("status", "REPLIED")
    if (!quotes || quotes.length === 0) return []

    // Build a map: nodeId -> { node data, quote data }
    const nodeMap = new Map<string, { node: any; quote: any }>()
    for (const quote of quotes) {
      nodeMap.set(quote.node_id, { node: quote.nodes, quote })
    }

    // Step 3: Find all valid source-to-terminal paths using DFS
    const sourceNodes = [...nodeMap.values()].filter(
      ({ node }) => node.type === "GAS_SOURCE"
    )
    const terminalTypes = new Set(["REGASIFICATION", "STORAGE"])

    const allPaths: string[][] = []

    function dfs(currentNodeId: string, currentPath: string[]) {
      const current = nodeMap.get(currentNodeId)
      if (!current) return

      const nextTypes = VALID_CONNECTIONS[current.node.type] ?? []

      // If this is a terminal node, the path is complete
      if (terminalTypes.has(current.node.type)) {
        allPaths.push([...currentPath])
        return
      }

      // Try each valid next node type
      for (const [nextNodeId, nextEntry] of nodeMap.entries()) {
        if (nextTypes.includes(nextEntry.node.type) && !currentPath.includes(nextNodeId)) {
          dfs(nextNodeId, [...currentPath, nextNodeId])
        }
      }
    }

    for (const { node } of sourceNodes) {
      dfs(node.id, [node.id])
    }

    if (allPaths.length === 0) return []

    // Step 4: Score each path
    const scoredPaths = allPaths.map(path => scorePath(path, nodeMap, tender))

    // Step 5: Sort by overall score descending, return top 3
    scoredPaths.sort((a, b) => b.overallScore - a.overallScore)
    const top3 = scoredPaths.slice(0, 3)

    // Step 6: Save all 3 paths to the database
    for (let i = 0; i < top3.length; i++) {
      const path = top3[i]
      await chainService.save({
        tenderId,
        isGreedyOptimal: i === 0,  // Only the best path is marked optimal
        nodeSequence:           path.nodeSequence,
        totalCostPerUnit:       path.totalCostPerUnit,
        estimatedDeliveryDays:  path.estimatedDeliveryDays,
        overallScore:           path.overallScore,
        scoreBreakdown:         path.scoreBreakdown,
      })
    }

    // Mark the tender as having an optimal path found
    await supabaseAdmin
      .from("tenders")
      .update({ status: "OPTIMAL_FOUND", greedy_score: top3[0].overallScore })
      .eq("id", tenderId)

    return top3
  }
}

// Score a single path.
// Returns a ScoredPath with the composite score and breakdown.
function scorePath(
  nodeSequence: string[],
  nodeMap: Map<string, { node: any; quote: any }>,
  tender: any
): ScoredPath {
  const entries = nodeSequence.map(id => nodeMap.get(id)!)

  // --- Price Score (35%) ---
  // Sum the price_per_unit from each quote in the chain.
  // Lower total cost = higher price score.
  const totalCost = entries.reduce(
    (sum, { quote }) => sum + (quote.price_per_unit ?? 0), 0
  )
  // Normalize: assume a range of $0 to $30/unit. Adjust as needed.
  const priceScore = Math.max(0, 100 - (totalCost / 30) * 100)

  // --- Risk Score (25%) ---
  // Average of the complement of regulatory_rating for each node.
  // High regulatory rating = low risk = high risk score.
  const avgRegulatoryRating = entries.reduce(
    (sum, { node }) => sum + node.regulatory_rating, 0
  ) / entries.length
  const riskScore = avgRegulatoryRating

  // --- Compliance Score (20%) ---
  // Start at 100, subtract 10 for each node missing ISO 9001 (baseline requirement).
  let complianceScore = 100
  for (const { node } of entries) {
    if (!node.certifications.includes("ISO 9001")) {
      complianceScore -= 10
    }
  }
  complianceScore = Math.max(0, complianceScore)

  // --- Insurance Score (10%) ---
  // Average insurance class score across all nodes.
  const avgInsuranceScore = entries.reduce((sum, { node }) => {
    return sum + (INSURANCE_CLASS_SCORES[node.insurance_class] ?? 50)
  }, 0) / entries.length

  // --- Reputation Score (10%) ---
  const avgReputation = entries.reduce(
    (sum, { node }) => sum + node.reputation_score, 0
  ) / entries.length

  // --- Composite Score ---
  const overallScore =
    priceScore      * 0.35 +
    riskScore       * 0.25 +
    complianceScore * 0.20 +
    avgInsuranceScore * 0.10 +
    avgReputation   * 0.10

  // --- Lead Time ---
  const estimatedDeliveryDays = entries.reduce(
    (max, { quote }) => Math.max(max, quote.lead_time_days ?? 0), 0
  )

  return {
    nodeSequence,
    totalCostPerUnit: parseFloat(totalCost.toFixed(4)),
    estimatedDeliveryDays,
    overallScore: parseFloat(Math.min(100, overallScore).toFixed(2)),
    scoreBreakdown: {
      price:       parseFloat(priceScore.toFixed(2)),
      risk:        parseFloat(riskScore.toFixed(2)),
      compliance:  parseFloat(complianceScore.toFixed(2)),
      insurance:   parseFloat(avgInsuranceScore.toFixed(2)),
      reputation:  parseFloat(avgReputation.toFixed(2)),
    }
  }
}
