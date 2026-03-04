export type QuoteStatus = "SENT" | "PENDING" | "REPLIED" | "DECLINED" | "EXPIRED"

export interface Quote {
  id: string
  tenderId: string
  nodeId: string
  status: QuoteStatus
  pricePerUnit: number | null
  currency: string
  validUntil: string | null
  leadTimeDays: number | null
  notes: string | null
  documentUrls: string[]
  receivedAt: string | null
  createdAt: string
  updatedAt: string
}