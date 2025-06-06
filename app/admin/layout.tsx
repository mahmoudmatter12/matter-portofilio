import { AdminLayout } from "@/components/admin/admin-layout"
import AdminProvider from "@/components/admin/admin-providor"
import type React from "react"

export default function AdminLayoutWrapper({ children, }: { children: React.ReactNode }) {

  return <AdminLayout><AdminProvider>{children}</AdminProvider></AdminLayout>
}
