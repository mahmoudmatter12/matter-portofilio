import type React from "react"
import { memo } from "react"
// app/layout.tsx
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { FloatingSocialDock } from "@/components/FloatingSocialDock"
import { Header } from "@/components/Header"
import { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { ToastProvider } from "@/hooks/toastprovidor"
import ProfileProvider from "@/context/ProfileProvidor"

export const metadata: Metadata = {
  title: "Mahmoud Matter | Full Stack Developer",
  description: "Portfolio of Mahmoud Matter, a Full Stack Developer specializing in modern web technologies",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

// Memoized background elements for better performance
const PortfolioBackgroundElements = memo(() => (
  <>
    {/* Subtle grid texture */}
    <div
      className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015]"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }}
    />

    {/* Main animated gradient orbs */}
    <div
      className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full 
      bg-gradient-to-br from-sky-400/20 via-cyan-400/12 to-blue-500/8 
      blur-3xl animate-pulse"
      style={{
        animationDuration: '12s',
        animationDelay: '0s'
      }}
      aria-hidden="true"
    />

    <div
      className="absolute top-1/4 -right-40 w-[800px] h-[800px] rounded-full 
      bg-gradient-to-bl from-indigo-400/15 via-purple-400/10 to-pink-500/8 
      blur-3xl opacity-80 animate-pulse"
      style={{
        animationDuration: '15s',
        animationDelay: '3s'
      }}
      aria-hidden="true"
    />

    <div
      className="absolute -bottom-32 left-1/4 w-[900px] h-[600px] rounded-full 
      bg-gradient-to-tr from-emerald-400/12 via-teal-400/15 to-cyan-500/10 
      blur-3xl opacity-75 animate-pulse"
      style={{
        animationDuration: '18s',
        animationDelay: '6s'
      }}
      aria-hidden="true"
    />

    {/* Secondary floating orbs for depth */}
    <div
      className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full 
      bg-gradient-to-tr from-violet-400/10 via-fuchsia-400/8 to-rose-500/6 
      blur-3xl animate-pulse"
      style={{
        animationDuration: '20s',
        animationDelay: '8s'
      }}
      aria-hidden="true"
    />

    {/* Interactive floating elements */}
    <div
      className="absolute top-1/5 right-24 w-40 h-40 
      bg-gradient-to-br from-rose-400/12 to-pink-500/18 
      rounded-[2.5rem] backdrop-blur-sm
      shadow-[0_30px_70px_-15px_rgba(251,113,133,0.3)] 
      rotate-12 animate-bounce hover:scale-110 
      transition-all duration-700 hover:shadow-[0_40px_90px_-15px_rgba(251,113,133,0.4)]
      border border-white/10 dark:border-white/5"
      style={{
        animationDuration: '8s',
        animationDelay: '2s'
      }}
      aria-hidden="true"
    />

    <div
      className="absolute bottom-1/4 left-32 w-48 h-48 
      bg-gradient-to-tr from-cyan-400/12 to-blue-500/18 
      rounded-full backdrop-blur-sm
      shadow-[0_30px_60px_-15px_rgba(34,211,238,0.3)] 
      -rotate-12 animate-bounce hover:scale-105 
      transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(34,211,238,0.4)]
      border border-white/10 dark:border-white/5"
      style={{
        animationDuration: '10s',
        animationDelay: '4s'
      }}
      aria-hidden="true"
    />

    <div
      className="absolute top-2/3 right-1/3 w-32 h-32 
      bg-gradient-to-bl from-violet-400/12 to-purple-500/18 
      rounded-3xl backdrop-blur-sm
      shadow-[0_25px_50px_-10px_rgba(147,51,234,0.3)] 
      rotate-45 animate-spin hover:rotate-[60deg] 
      transition-all duration-700 hover:shadow-[0_35px_70px_-10px_rgba(147,51,234,0.4)]
      border border-white/10 dark:border-white/5"
      style={{
        animationDuration: '25s'
      }}
      aria-hidden="true"
    />

    <div
      className="absolute top-1/3 left-20 w-28 h-28 
      bg-gradient-to-tr from-amber-400/12 to-orange-500/18 
      rounded-2xl backdrop-blur-sm
      shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] 
      -rotate-6 animate-bounce hover:scale-110 
      transition-all duration-700 hover:shadow-[0_30px_60px_-10px_rgba(245,158,11,0.4)]
      border border-white/10 dark:border-white/5"
      style={{
        animationDuration: '12s',
        animationDelay: '6s'
      }}
      aria-hidden="true"
    />

    <div
      className="absolute bottom-1/2 right-16 w-36 h-36 
      bg-gradient-to-bl from-green-400/12 to-emerald-500/18 
      rounded-[3rem] backdrop-blur-sm
      shadow-[0_25px_55px_-12px_rgba(34,197,94,0.3)] 
      rotate-24 animate-spin hover:rotate-[30deg] 
      transition-all duration-700 hover:shadow-[0_35px_75px_-12px_rgba(34,197,94,0.4)]
      border border-white/10 dark:border-white/5"
      style={{
        animationDuration: '30s'
      }}
      aria-hidden="true"
    />
  </>
))

PortfolioBackgroundElements.displayName = 'PortfolioBackgroundElements'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Enhanced Background Container */}
          <div
            className="relative min-h-screen overflow-hidden 
            bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60
            dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900
            transition-colors duration-500"
          >
            <PortfolioBackgroundElements />
            <FloatingSocialDock />
            <Header />
            {/* Content layer with subtle backdrop blur */}
            <div className="relative z-10 min-h-screen backdrop-blur-[0.5px]">
              <ClerkProvider>
                <main
                  className="relative min-h-screen
                  bg-white/20 dark:bg-slate-900/30 
                  backdrop-blur-[1px]
                  border-l border-r border-white/10 dark:border-slate-700/20
                  shadow-2xl shadow-black/5 dark:shadow-black/20
                  transition-all duration-300"
                >
                  <ProfileProvider>
                    <ToastProvider>
                      {children}
                    </ToastProvider>
                  </ProfileProvider>

                  <Analytics />
                </main>
              </ClerkProvider>
            </div>

          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}