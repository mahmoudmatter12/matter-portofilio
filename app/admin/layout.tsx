import { AdminLayout } from "@/components/admin/admin-layout"
import AdminProvider from "@/components/admin/admin-providor"
import BackgroundElements from "@/components/decoration"
import type React from "react"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  return (
    <div className="relative admin-layout-wrapper min-h-screen">
      <AdminLayout>
        <AdminProvider>
          <div className="relative min-h-screen overflow-hidden">
            <BackgroundElements />

            {/* Main content container */}
            <div className="relative z-10 min-h-screen">
              <div className="min-h-screen">{children}</div>
            </div>
          </div>
        </AdminProvider>
      </AdminLayout>
    </div>
  )
}
