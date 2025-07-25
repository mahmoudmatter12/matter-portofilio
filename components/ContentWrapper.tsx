"use client"

import { usePathname } from "next/navigation"
import { useDevBanner } from "@/hooks/use-dev-banner"

interface ContentWrapperProps {
    children: React.ReactNode
}

export const ContentWrapper = ({ children }: ContentWrapperProps) => {
    const hasDevBanner = useDevBanner()
    const pathname = usePathname()
    const isAdminPanel = pathname.startsWith("/admin")

    // Calculate padding based on what's visible
    const getPadding = () => {
        if (isAdminPanel) {
            // No header in admin panel, only consider dev banner
            return hasDevBanner ? "pt-16" : "pt-0"
        } else {
            // Regular pages have header + optional dev banner
            return hasDevBanner ? "pt-36" : "pt-20"
        }
    }

    return (
        <div
            className={`relative z-10 min-h-screen backdrop-blur-[0.5px] transition-all duration-300 ${getPadding()}`}
        >
            {children}
        </div>
    )
} 