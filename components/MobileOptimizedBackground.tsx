"use client"
import { memo, useState, useEffect } from "react"

// Optimized background elements with mobile performance considerations
const MobileOptimizedBackground = memo(() => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reduce animations on mobile for better performance
  if (isMobile) {
    return (
      <>
        {/* Minimal grid texture for mobile */}
        <div
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.005]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.05) 1px, transparent 0)`,
            backgroundSize: '64px 64px'
          }}
        />
        
        {/* Single static background element for mobile */}
        <div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full 
          bg-gradient-to-br from-sky-400/8 to-cyan-400/6 
          blur-2xl"
          aria-hidden="true"
        />
      </>
    )
  }

  return (
    <>
      {/* Simplified grid texture */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.1) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Reduced number of animated elements */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full 
        bg-gradient-to-br from-sky-400/15 via-cyan-400/10 to-blue-500/6 
        blur-3xl animate-pulse"
        style={{
          animationDuration: '15s',
          animationDelay: '0s'
        }}
        aria-hidden="true"
      />

      <div
        className="absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full 
        bg-gradient-to-bl from-indigo-400/12 via-purple-400/8 to-pink-500/6 
        blur-3xl opacity-70 animate-pulse"
        style={{
          animationDuration: '18s',
          animationDelay: '4s'
        }}
        aria-hidden="true"
      />

      <div
        className="absolute -bottom-32 left-1/4 w-[800px] h-[500px] rounded-full 
        bg-gradient-to-tr from-emerald-400/10 via-teal-400/12 to-cyan-500/8 
        blur-3xl opacity-60 animate-pulse"
        style={{
          animationDuration: '20s',
          animationDelay: '8s'
        }}
        aria-hidden="true"
      />

      {/* Single interactive element */}
      <div
        className="absolute top-1/3 right-24 w-32 h-32 
        bg-gradient-to-br from-rose-400/10 to-pink-500/15 
        rounded-2xl backdrop-blur-sm
        shadow-[0_20px_40px_-10px_rgba(251,113,133,0.2)] 
        rotate-12 animate-bounce hover:scale-105 
        transition-all duration-500 hover:shadow-[0_30px_60px_-10px_rgba(251,113,133,0.3)]
        border border-white/10 dark:border-white/5"
        style={{
          animationDuration: '10s',
          animationDelay: '2s'
        }}
        aria-hidden="true"
      />
    </>
  )
})

MobileOptimizedBackground.displayName = 'MobileOptimizedBackground'

export default MobileOptimizedBackground 