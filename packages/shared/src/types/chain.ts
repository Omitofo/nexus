//packages/shared/src/types/chain.ts
export interface ChainScoreBreakdown {
  price: number
  risk: number
  compliance: number
  insurance: number
  reputation: number
}

export interface Chain {
  id: string
  tenderId: string
  isGreedyOptimal: boolean
  nodeSequence: string[]
  totalCostPerUnit: number
  estimatedDeliveryDays: number
  overallScore: number
  scoreBreakdown: ChainScoreBreakdown
  notes: string | null
  createdAt: string
  updatedAt: string
}