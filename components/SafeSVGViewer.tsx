'use client'

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'

// Cache implementation with size limit
const createCache = (maxSize = 50) => {
  const cache = new Map<string, { svg: string; timestamp: number }>()
  
  return {
    get: (key: string) => cache.get(key),
    set: (key: string, value: string) => {
      if (cache.size >= maxSize) {
        // Remove oldest item
        const oldestKey = [...cache.entries()].reduce((oldest, [key, { timestamp }]) => 
          timestamp < cache.get(oldest)!.timestamp ? key : oldest
        , [...cache.keys()][0])
        cache.delete(oldestKey)
      }
      cache.set(key, { svg: value, timestamp: Date.now() })
    },
    clear: () => cache.clear()
  }
}

const svgCache = createCache()

export function DynamicPoster({
  name,
  subtitle,
  className,
  width = 600,
  height = 400
}: {
  name: string
  subtitle: string
  className?: string
  width?: number
  height?: number
}) {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cacheKey = useMemo(() => `${name}-${subtitle}`, [name, subtitle])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchSvg = async () => {
      try {
        // Check cache first
        const cached = svgCache.get(cacheKey)
        if (cached) {
          if (isMounted) {
            setSvgContent(cached.svg)
            setIsLoading(false)
          }
          return
        }

        const response = await fetch(
          `/api/poster?name=${encodeURIComponent(name)}&subtitle=${encodeURIComponent(subtitle)}`,
          { signal: controller.signal }
        )

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const svg = await response.text()
        if (!svg.includes('<svg')) throw new Error('Invalid SVG response')

        svgCache.set(cacheKey, svg)
        if (isMounted) {
          setSvgContent(svg)
          setError(null)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to load SVG:', err)
          setError('Failed to load cosmic view')
          setIsLoading(false)
        }
      }
    }

    fetchSvg()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [cacheKey, name, subtitle])


  if (isLoading) {
    return (
      <div className={cn(
        "relative flex items-center justify-center bg-gray-900 overflow-hidden",
        className
      )} style={{ width, height }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 mb-4" />
          <div className="h-6 w-48 mx-auto bg-gray-700 rounded" />
          <div className="h-4 w-32 mx-auto bg-gray-700 rounded mt-2" />
        </div>
      </div>
    )
  }

  if (error || !svgContent) {
    return (
      <div className={cn(
        "relative flex items-center justify-center bg-gray-900 overflow-hidden",
        className
      )} style={{ width, height }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        <div className="relative z-10 text-center p-4">
          <div className="text-cyan-400 text-lg">{error}</div>
          <div className="text-gray-400 mt-2">Showing simple fallback</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-900",
        className
      )}
      style={{ width, height }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className="w-full h-full"
        style={{
          transform: `scale(${Math.min(width / 1200, height / 800)})`,
          transformOrigin: 'top left'
        }}
      />
    </div>
  )
}