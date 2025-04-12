import type React from "react"
// app/layout.tsx
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { FloatingSocialDock } from "@/components/FloatingSocialDock"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/Header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mahmoud Matter | Full Stack Developer",
  description: "Portfolio of Mahmoud Matter, a Full Stack Developer specializing in modern web technologies",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Background Container */}
          <div
            className="relative min-h-screen overflow-hidden 
            bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]
            dark:from-[#111827] dark:via-[#1F2937] dark:to-[#17263d]"
          >
            {/* Subtle grid texture */}
            <div className="absolute inset-0 grid-pattern bg-center bg-cover opacity-5 dark:opacity-[0.02]" />

            {/* Animated background elements */}
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/30 via-cyan-300/20 to-transparent blur-3xl animate-pulse-slow" />

            <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-300/20 via-purple-300/10 to-transparent blur-3xl opacity-70 animate-pulse-slow-reverse" />

            <div className="absolute bottom-0 left-20 w-[800px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-300/20 via-sky-300/40 to-transparent blur-3xl opacity-70 animate-pulse-slow" />

            {/* Floating Shapes */}
            <div
              className="absolute top-1/4 right-20 w-32 h-32 
              bg-pink-500/10 rounded-3xl 
              shadow-[0_20px_50px_-10px_rgba(251,113,133,0.3)] 
              rotate-12 animate-float-slow"
            />

            <div
              className="absolute bottom-1/3 left-32 w-40 h-40 
              bg-cyan-500/10 rounded-full 
              shadow-[0_20px_40px_-10px_rgba(34,211,238,0.3)] 
              -rotate-12 animate-float"
            />

            {/* Content Wrapper */}
            <Header />
            <main className="relative z-10">
              <FloatingSocialDock />
              {children}
              <Toaster />
            </main>

          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
