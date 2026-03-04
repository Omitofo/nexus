"use client"
import { useEffect, useState, useCallback } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@nexus/shared"

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export function useSupabaseAuth() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [state, setState] = useState<AuthState>({ user: null, profile: null, loading: true })

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    return data as Profile | null
  }, [supabase])

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const profile = await fetchProfile(data.user.id)
        setState({ user: data.user, profile, loading: false })
      } else {
        setState({ user: null, profile: null, loading: false })
      }
    })

    // Listen for auth changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({ user: session.user, profile, loading: false })
      } else {
        setState({ user: null, profile: null, loading: false })
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [fetchProfile])

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return {
    user:     state.user,
    profile:  state.profile,
    loading:  state.loading,
    isOperator: state.profile?.role === "operator",
    signOut,
  }
}
