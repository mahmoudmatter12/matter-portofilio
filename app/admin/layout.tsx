import { AdminLayout } from "@/components/admin/admin-layout"
import type React from "react"

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
