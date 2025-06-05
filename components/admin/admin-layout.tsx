"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Home,
  Mail,
  Menu,
  User,
  Users,
  Award,
  Briefcase,
  MessageSquare,
  BarChart3,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  description?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const getUnreadMessages = async (): Promise<number> => {
  try {
    const response = await fetch("/api/messages/un-read-messages")
    if (!response.ok) return 0
    const data = await response.json()
    return typeof data.count === "number" ? data.count : 0
  } catch {
    return 0
  }
}

const navigationSections: NavSection[] = [
  {
    title: "Home",
    items: [
      {
        title: "Home",
        href: "/",
        icon: Home,
        description: "Return to the main site",
      },
    ],
  },
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: Home,
        description: "Overview and analytics",
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        description: "Site statistics and insights",
      },
    ],
  },
  {
    title: "Content Management",
    items: [
      {
        title: "Timeline Posts",
        href: "/admin/timeline",
        icon: Calendar,
        description: "Manage education, work, and achievements",
      },
      {
        title: "Projects",
        href: "/admin/projects",
        icon: FolderOpen,
        description: "Portfolio projects and case studies",
      },
      {
        title: "Skills",
        href: "/admin/skills",
        icon: BarChart3,
        description: "Manage skills and expertise",
      },
      {
        title: "Certifications",
        href: "/admin/certificates",
        icon: Award,
        description: "Professional certifications and achievements",
      },
      {
        title: "Experience",
        href: "/admin/experience",
        icon: Briefcase,
        badge: "Soon",
        description: "Professional work experience",
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Messages",
        href: "/admin/messages",
        icon: Mail,
        badge: (await getUnreadMessages()).toString(),
        description: "Contact form submissions",
      },
      {
        title: "Comments",
        href: "/admin/comments",
        icon: MessageSquare,
        badge: "Soon",
        description: "Blog and project comments",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        badge: "Soon",
        description: "User management and permissions",
      },

      {
        title: "Profile",
        href: "/admin/profile",
        icon: User,
        description: "Your admin profile settings",
      },
    ],
  },
]

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()

  useEffect(() => {
    getUnreadMessages()
  }, [])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Admin Panel</span>
              <span className="text-xs text-muted-foreground">Content Management</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-3">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  const isDisabled = item.badge === "Soon"

                  return (
                    <Link
                      key={item.href}
                      href={isDisabled ? "#" : item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                        isActive && "bg-accent text-accent-foreground",
                        isDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.title}</span>
                              {item.badge && (
                                <Badge
                                  variant={item.badge === "Soon" ? "secondary" : "default"}
                                  className="h-5 text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                          </div>
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
              {!collapsed && <Separator className="mt-4" />}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}
          onClick={() => {
            // Handle logout
            console.log("Logout clicked")
          }}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}

function DesktopSidebar({
  collapsed,
  setCollapsed,
}: { collapsed: boolean; setCollapsed: (collapsed: boolean) => void }) {
  return (
    <div
      className={cn(
        "relative hidden border-r bg-background transition-all duration-300 lg:block",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <SidebarContent collapsed={collapsed} />

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background p-0 shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </div>
  )
}

function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent collapsed={false} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <MobileSidebar />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
