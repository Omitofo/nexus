//apps/web/lib/types/index.ts
// Frontend-specific type extensions and UI-only types.
// Shared domain types live in packages/shared/src/types/.

import type { SupplyChainNode, Quote, QuoteStatus } from "@nexus/shared"

// React Flow node data shape — what each canvas node carries in data prop
export interface FlowNodeData {
  label: string           // Short display name
  companyName: string
  nodeType: string        // NodeType enum value
  score: number
  price?: string          // Formatted price string if quote received
  quoteStatus?: QuoteStatus
  isOptimalPath?: boolean // true when this node is on the selected greedy path
  nodeId: string          // Supabase node id (not the React Flow node id)
}

// Quote with the joined node data — used in the quote list panel
export interface QuoteWithNode extends Quote {
  node: SupplyChainNode
}

// Sidebar tab options
export type SidebarTab = "tenders" | "nodes" | "quotes"

// Graph tool modes
export type GraphTool = "select" | "pan" | "connect" | "disconnect"
