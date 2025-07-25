import type React from "react"
import { memo } from "react"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { Header } from "@/components/Header"
import { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from "@/hooks/toastprovidor"
import ProfileProvider from "@/context/ProfileProvidor"
import { ReactQueryProvider } from "@/context/reactquiryProvidor"
import IsDevelopment from "@/components/is-development"
import { ContentWrapper } from "@/components/ContentWrapper"

export const metadata: Metadata = {
  title: "Mahmoud Matter | Full Stack Developer",
  description: "Portfolio of Mahmoud Matter, a Full Stack Developer specializing in modern web technologies",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

// Optimized background elements with reduced complexity
const PortfolioBackgroundElements = memo(() => (
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
))

PortfolioBackgroundElements.displayName = 'PortfolioBackgroundElements'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Optimized Background Container */}
          <div
            className="relative min-h-screen overflow-hidden 
            bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50
            dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900
            transition-colors duration-300"
          >
            <PortfolioBackgroundElements />
            <IsDevelopment />
            <Header />
            <ContentWrapper>
              <ClerkProvider>
                <main
                  className="relative min-h-screen
                  bg-white/15 dark:bg-slate-900/25 
                  backdrop-blur-[0.5px]
                  border-l border-r border-white/10 dark:border-slate-700/20
                  shadow-xl shadow-black/5 dark:shadow-black/15
                  transition-all duration-200"
                >
                  <ReactQueryProvider>
                    <ProfileProvider>
                      <ToastProvider>
                        {children}
                      </ToastProvider>
                    </ProfileProvider>
                  </ReactQueryProvider>

                  <Analytics />
                </main>
              </ClerkProvider>
            </ContentWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}