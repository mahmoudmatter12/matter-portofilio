import { memo } from "react"

const BackgroundElements = memo(() => (
  <>
    {/* Subtle grid texture */}
    <div 
      className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015]"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }}
    />

    {/* Animated gradient orbs */}
    <div 
      className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full 
      bg-gradient-to-br from-sky-400/25 via-cyan-400/15 to-blue-500/10 
      blur-3xl animate-pulse"
      style={{
        animationDuration: '8s',
        animationDelay: '0s'
      }}
      aria-hidden="true"
    />

    <div 
      className="absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full 
      bg-gradient-to-bl from-indigo-400/20 via-purple-400/12 to-pink-500/8 
      blur-3xl opacity-80 animate-pulse"
      style={{
        animationDuration: '10s',
        animationDelay: '2s'
      }}
      aria-hidden="true"
    />

    <div 
      className="absolute -bottom-32 left-1/4 w-[900px] h-[600px] rounded-full 
      bg-gradient-to-tr from-emerald-400/15 via-teal-400/20 to-cyan-500/10 
      blur-3xl opacity-75 animate-pulse"
      style={{
        animationDuration: '12s',
        animationDelay: '4s'
      }}
      aria-hidden="true"
    />

    {/* Interactive floating elements */}
    <div
      className="absolute top-1/5 right-24 w-36 h-36 
      bg-gradient-to-br from-rose-400/15 to-pink-500/20 
      rounded-[2rem] backdrop-blur-sm
      shadow-[0_25px_60px_-15px_rgba(251,113,133,0.4)] 
      rotate-12 animate-bounce hover:scale-110 
      transition-transform duration-700
      border border-white/10"
      style={{
        animationDuration: '6s',
        animationDelay: '1s'
      }}
      aria-hidden="true"
    />

    <div
      className="absolute bottom-1/4 left-32 w-44 h-44 
      bg-gradient-to-tr from-cyan-400/15 to-blue-500/20 
      rounded-full backdrop-blur-sm
      shadow-[0_25px_50px_-15px_rgba(34,211,238,0.4)] 
      -rotate-12 animate-bounce hover:scale-105 
      transition-transform duration-700
      border border-white/10"
      style={{
        animationDuration: '8s',
        animationDelay: '3s'
      }}
      aria-hidden="true"
    />

    <div
      className="absolute top-2/3 right-1/3 w-28 h-28 
      bg-gradient-to-bl from-violet-400/15 to-purple-500/20 
      rounded-2xl backdrop-blur-sm
      shadow-[0_20px_40px_-10px_rgba(147,51,234,0.3)] 
      rotate-45 animate-spin hover:rotate-[60deg] 
      transition-transform duration-700
      border border-white/10"
      style={{
        animationDuration: '20s'
      }}
      aria-hidden="true"
    />
  </>
))

BackgroundElements.displayName = 'BackgroundElements'

export default BackgroundElements