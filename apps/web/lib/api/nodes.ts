import { createSupabaseBrowserClient } from "@/lib/supabase"
import type { SupplyChainNode, CreateNodeInput } from "@nexus/shared"

async function getAuthHeader() {
  const supabase = createSupabaseBrowserClient()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Not authenticated")
  return "Bearer " + token
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const nodeApi = {
  async list(): Promise<SupplyChainNode[]> {
    const auth = await getAuthHeader()
    const res = await fetch(API_URL + "/nodes", { headers: { Authorization: auth } })
    if (!res.ok) throw new Error("Failed to load nodes")
    return res.json()
  },

  async create(input: CreateNodeInput): Promise<SupplyChainNode> {
    const auth = await getAuthHeader()
    const res = await fetch(API_URL + "/nodes", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error("Failed to create node")
    return res.json()
  },

  async update(id: string, updates: Partial<SupplyChainNode>): Promise<SupplyChainNode> {
    const auth = await getAuthHeader()
    const res = await fetch(API_URL + "/nodes/" + id, {
      method: "PATCH",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Failed to update node")
    return res.json()
  }
}
