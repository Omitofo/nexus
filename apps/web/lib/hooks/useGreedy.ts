// Hook for running the greedy algorithm and storing results.
"use client"
import { useState } from "react"
import { chainApi } from "@/lib/api/chain"
import { useGraphStore } from "@/lib/store/graphStore"
import type { Chain } from "@nexus/shared"

export function useGreedy(tenderId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setOptimalPaths, setSelectedPath } = useGraphStore()

  async function runGreedy() {
    setLoading(true)
    setError(null)

    try {
      const paths = await chainApi.runGreedy(tenderId)
      setOptimalPaths(paths)
      if (paths.length > 0) {
        setSelectedPath(paths[0])  // Auto-select the best path
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algorithm failed")
    } finally {
      setLoading(false)
    }
  }

  return { runGreedy, loading, error }
}
