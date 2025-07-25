import type React from "react"
import { memo } from "react"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { Header } from "@/components/Header"
import { Metadata } from "next"
// import { Analytics } from "@vercel/analytics/react"
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from "@/hooks/toastprovidor"
import ProfileProvider from "@/context/ProfileProvidor"
import { ReactQueryProvider } from "@/context/reactquiryProvidor"
import IsDevelopment from "@/components/is-development"
import { ContentWrapper } from "@/components/ContentWrapper"
import MobileOptimizedBackground from "@/components/MobileOptimizedBackground"

export const metadata: Metadata = {
  title: "Mahmoud Matter | Full Stack Developer",
  description: "Portfolio of Mahmoud Matter, a Full Stack Developer specializing in modern web technologies",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

// Simple memoized background component for server-side rendering
const PortfolioBackgroundElements = memo(() => (
  <MobileOptimizedBackground />
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

                  {/* <Analytics /> */}
                </main>
              </ClerkProvider>
            </ContentWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}