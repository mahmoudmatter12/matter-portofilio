import { AdminLayout } from "@/components/admin/admin-layout"
import AdminProvider from "@/components/admin/admin-providor"
import BackgroundElements from "@/components/decoration"
import type React from "react"



interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  return (
    <div className="relative admin-layout-wrapper">
      <AdminLayout>
        <AdminProvider>
          <div
            className="relative min-h-screen overflow-hidden 
            bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/80
            dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
            transition-colors duration-300"
          >
            <BackgroundElements />
            
            {/* Main content container with improved styling */}
            <div className="relative z-10 min-h-screen backdrop-blur-[0.5px]">
              <div 
                className="min-h-screen bg-white/40 dark:bg-slate-900/60 
                backdrop-blur-sm border-r border-white/20 dark:border-slate-700/30
                shadow-2xl shadow-black/5 dark:shadow-black/20
                transition-all duration-300"
              >
                {children}
              </div>
            </div>

            {/* Subtle overlay for depth */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10 
              dark:from-black/20 dark:via-transparent dark:to-white/5 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </AdminProvider>
      </AdminLayout>
    </div>
  )
}