"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

export function useIntersectionObserver<T extends Element>(
  options: IntersectionObserverOptions = {},
): [RefObject<T>, boolean] {
  const { root = null, rootMargin = "0px", threshold = 0, once = false } = options

  const ref = useRef<T>(null) as RefObject<T>
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)

        // If once is true and the element has been intersected, unobserve it
        if (once && entry.isIntersecting) {
          observer.unobserve(element)
        }
      },
      { root, rootMargin, threshold },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [root, rootMargin, threshold, once])

  return [ref, isIntersecting]
}
