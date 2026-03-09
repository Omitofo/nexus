//packages/shared/src/types/node.ts

export type NodeType =
  | "GAS_SOURCE"
  | "TRADER"
  | "LIQUEFACTION"
  | "TRANSPORT"
  | "REGASIFICATION"
  | "STORAGE"

export interface SupplyChainNode {
  id: string
  type: NodeType
  name: string
  companyName: string
  country: string
  isActive: boolean
  reputationScore: number
  insuranceClass: string
  certifications: string[]
  regulatoryRating: number
  rfqEmail: string
  rfqWebhookUrl: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}