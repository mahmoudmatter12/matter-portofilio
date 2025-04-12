"use client"

import { useState, useEffect } from "react"
import { memoryCache } from "@/lib/cache-utils"

// A hook to fetch and cache data
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    initialData?: T
    cacheTime?: number // milliseconds
    staleTime?: number // milliseconds
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  } = {},
) {
  const {
    initialData,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 0,
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    const cachedData = memoryCache.get<T>(key)

    if (cachedData) {
      if (isMounted) {
        setData(cachedData)
        setIsLoading(false)
      }

      // If we have cached data but it's stale, refetch in the background
      const cacheEntry = memoryCache.get<any>(`meta:${key}`)
      const timestamp = cacheEntry?.timestamp || 0

      if (Date.now() - timestamp > staleTime) {
        fetchData()
      }
    } else {
      fetchData()
    }

    async function fetchData() {
      try {
        const freshData = await fetchFn()

        if (isMounted) {
          setData(freshData)
          setIsLoading(false)
          setError(null)

          if (onSuccess) {
            onSuccess(freshData)
          }
        }

        memoryCache.set(key, freshData, cacheTime)
        memoryCache.set(`meta:${key}`, { timestamp: Date.now() }, cacheTime)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)

          if (onError) {
            onError(err instanceof Error ? err : new Error(String(err)))
          }
        }
      }
    }

    return () => {
      isMounted = false
    }
  }, [key, fetchFn, cacheTime, staleTime, onSuccess, onError])

  // Function to manually refetch data
  const refetch = async () => {
    setIsLoading(true)
    try {
      const freshData = await fetchFn()
      setData(freshData)
      setError(null)

      memoryCache.set(key, freshData, cacheTime)
      memoryCache.set(`meta:${key}`, { timestamp: Date.now() }, cacheTime)

      if (onSuccess) {
        onSuccess(freshData)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))

      if (onError) {
        onError(err instanceof Error ? err : new Error(String(err)))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { data, isLoading, error, refetch }
}
