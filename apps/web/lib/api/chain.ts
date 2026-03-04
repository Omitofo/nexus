// API calls to the Fastify backend for chain/greedy operations.
// All requests include the Supabase JWT in the Authorization header.
import { createSupabaseBrowserClient } from "@/lib/supabase"
import type { Chain } from "@nexus/shared"

async function getAuthHeader(): Promise<string> {
  const supabase = createSupabaseBrowserClient()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Not authenticated")
  return `Bearer ${token}`
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const chainApi = {
  async runGreedy(tenderId: string): Promise<Chain[]> {
    const auth = await getAuthHeader()
    const res = await fetch(`${API_URL}/chain/greedy/${tenderId}`, {
      method: "POST",
      headers: { Authorization: auth },
    })
    if (!res.ok) throw new Error("Greedy algorithm failed")
    return res.json()
  },

  async listByTender(tenderId: string): Promise<Chain[]> {
    const auth = await getAuthHeader()
    const res = await fetch(`${API_URL}/chain/${tenderId}`, {
      headers: { Authorization: auth },
    })
    if (!res.ok) throw new Error("Failed to load chains")
    return res.json()
  },

  async selectChain(tenderId: string, chainId: string): Promise<void> {
    const auth = await getAuthHeader()
    await fetch(`${API_URL}/chain/select`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ tenderId, chainId }),
    })
  }
}
