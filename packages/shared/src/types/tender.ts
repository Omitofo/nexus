export type TenderType = "REAL" | "SANDBOX"

export type TenderStatus =
  | "DRAFT"
  | "RFQ_SENT"
  | "QUOTES_RECEIVING"
  | "OPTIMAL_FOUND"
  | "CLOSED"

export interface Tender {
  id: string
  type: TenderType
  name: string
  product: string
  volumeMt: number
  deliveryDate: string
  deliveryLocation: string
  status: TenderStatus
  createdBy: string
  clientUserId: string | null
  greedyScore: number | null
  selectedChainId: string | null
  createdAt: string
  updatedAt: string
}