// A simple in-memory cache implementation
type CacheEntry<T> = {
    data: T
    timestamp: number
    expiry: number // Time in milliseconds until cache expires
  }
  
  class MemoryCache {
    private cache: Map<string, CacheEntry<any>> = new Map()
  
    // Get data from cache if it exists and is not expired
    get<T>(key: string): T | null {
      const entry = this.cache.get(key)
  
      if (!entry) return null
  
      // Check if cache has expired
      if (Date.now() > entry.timestamp + entry.expiry) {
        this.cache.delete(key)
        return null
      }
  
      return entry.data as T
    }
  
    // Set data in cache with an expiry time
    set<T>(key: string, data: T, expiry: number = 5 * 60 * 1000): void {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        expiry,
      })
    }
  
    // Clear a specific cache entry
    clear(key: string): void {
      this.cache.delete(key)
    }
  
    // Clear all cache
    clearAll(): void {
      this.cache.clear()
    }
  }
  
  // Create a singleton instance
  export const memoryCache = new MemoryCache()
  
  // Utility function to fetch with cache
  export async function fetchWithCache<T>(
    url: string,
    options?: RequestInit,
    cacheTime: number = 5 * 60 * 1000, // 5 minutes default
  ): Promise<T> {
    const cacheKey = `fetch:${url}:${JSON.stringify(options)}`
  
    // Try to get from cache first
    const cachedData = memoryCache.get<T>(cacheKey)
    if (cachedData) {
      return cachedData
    }
  
    // If not in cache, fetch it
    const response = await fetch(url, options)
  
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
    }
  
    const data = await response.json()
  
    // Store in cache
    memoryCache.set<T>(cacheKey, data, cacheTime)
  
    return data
  }
  