import { createSupabaseBrowserClient } from "@/lib/supabase"
import type { Tender, CreateTenderInput } from "@nexus/shared"

async function getAuthHeader() {
  const supabase = createSupabaseBrowserClient()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Not authenticated")
  return `Bearer ${token}`
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const tenderApi = {
  async list(): Promise<Tender[]> {
    const auth = await getAuthHeader()
    const res = await fetch(`${API_URL}/tenders`, { headers: { Authorization: auth } })
    if (!res.ok) throw new Error("Failed to load tenders")
    return res.json()
  },

  async create(input: CreateTenderInput): Promise<Tender> {
    const auth = await getAuthHeader()
    const res = await fetch(`${API_URL}/tenders`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error("Failed to create tender")
    return res.json()
  },

  async broadcastRfq(tenderId: string) {
    const auth = await getAuthHeader()
    await fetch(`${API_URL}/quotes/broadcast/${tenderId}`, {
      method: "POST",
      headers: { Authorization: auth },
    })
  }
}
