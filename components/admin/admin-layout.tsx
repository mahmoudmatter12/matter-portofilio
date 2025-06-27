"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  ChevronRight,
  FolderOpen,
  Home,
  Mail,
  Menu,
  User,
  Award,
  BarChart3,
  LogOut,
  Crown,
  Sparkles,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  description?: string
  dynamicBadge?: boolean
  color?: string
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
    title: "Overview",
    items: [
      {
        title: "Home",
        href: "/",
        icon: Home,
        description: "Return to the main site",
        color: "from-blue-500 to-cyan-500",
      },
      {
        title: "Dashboard",
        href: "/admin",
        icon: BarChart3,
        description: "Overview and analytics",
        color: "from-purple-500 to-pink-500",
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
        color: "from-green-500 to-emerald-500",
      },
      {
        title: "Projects",
        href: "/admin/projects",
        icon: FolderOpen,
        description: "Portfolio projects and case studies",
        color: "from-orange-500 to-red-500",
      },
      {
        title: "Skills",
        href: "/admin/skills",
        icon: Sparkles,
        description: "Manage skills and expertise",
        color: "from-teal-500 to-cyan-500",
      },
      {
        title: "Certifications",
        href: "/admin/certificates",
        icon: Award,
        description: "Professional certifications and achievements",
        color: "from-yellow-500 to-orange-500",
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
        dynamicBadge: true,
        description: "Contact form submissions",
        color: "from-blue-500 to-indigo-500",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Profile",
        href: "/admin/profile",
        icon: User,
        description: "Your admin profile settings",
        color: "from-pink-500 to-rose-500",
      },
      {
        title: "Development",
        href: "/admin/development",
        icon: Settings,
        description: "Development settings",
        color: "from-gray-500 to-slate-500",
      },
    ],
  },
]

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState<number>(0)

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const count = await getUnreadMessages()
      setUnreadCount(count)
    }

    fetchUnreadMessages()
    const interval = setInterval(fetchUnreadMessages, 120000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 flex h-16 items-center border-b border-white/10 px-4 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown className="h-5 w-5 text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Admin Panel
                </span>
                <span className="text-xs text-gray-400">Content Management</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="relative z-15 flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <nav className="space-y-6 px-3">
          {navigationSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <AnimatePresence>
                {!collapsed && (
                  <motion.h3
                    className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {section.title}
                  </motion.h3>
                )}
              </AnimatePresence>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  const isDisabled = item.badge === "Soon"

                  let badgeValue = item.badge
                  if (item.dynamicBadge && item.title === "Messages") {
                    badgeValue = unreadCount > 0 ? unreadCount.toString() : undefined
                  }

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                    >
                      <Link
                        href={isDisabled ? "#" : item.href}
                        onClick={onNavigate}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300",
                          "hover:bg-white/10 hover:backdrop-blur-sm",
                          isActive && "bg-white/10 backdrop-blur-sm shadow-lg",
                          isDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                          collapsed && "justify-center px-2",
                        )}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className={cn(
                              "absolute left-0 top-0 h-full w-1 rounded-r-full bg-gradient-to-b",
                              item.color || "from-purple-500 to-pink-500",
                            )}
                            layoutId="activeIndicator"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}

                        {/* Icon with gradient background */}
                        <motion.div
                          className={cn(
                            "relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                            isActive
                              ? `bg-gradient-to-br ${item.color || "from-purple-500 to-pink-500"} shadow-lg`
                              : "bg-white/5 group-hover:bg-white/10",
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 transition-colors duration-300",
                              isActive ? "text-white" : "text-gray-300 group-hover:text-white",
                            )}
                          />
                        </motion.div>

                        <AnimatePresence>
                          {!collapsed && (
                            <motion.div
                              className="flex-1 min-w-0"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "font-medium transition-colors duration-300",
                                    isActive ? "text-white" : "text-gray-300 group-hover:text-white",
                                  )}
                                >
                                  {item.title}
                                </span>
                                {badgeValue && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
                                    <Badge
                                      variant={badgeValue === "Soon" ? "secondary" : "default"}
                                      className={cn(
                                        "h-5 text-xs font-medium",
                                        badgeValue === "Soon"
                                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                          : "bg-red-500/20 text-red-400 border-red-500/30",
                                      )}
                                    >
                                      {badgeValue}
                                    </Badge>
                                  </motion.div>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
              {!collapsed && <Separator className="mt-4 bg-white/10" />}
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <motion.div
        className="relative z-10 border-t border-white/10 p-4 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <SignOutButton>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 cursor-pointer text-red-400 hover:text-red-300",
                "hover:bg-red-500/10 border border-transparent hover:border-red-500/20",
                "transition-all duration-300",
                collapsed && "justify-center px-2",
              )}
            >
              <LogOut className="h-4 w-4" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </SignOutButton>
      </motion.div>
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
        "relative hidden border-r border-white/10 bg-slate-900/95 backdrop-blur-xl transition-all duration-300 lg:block",
        collapsed ? "w-23" : "w-72",
      )}
    >
      <SidebarContent collapsed={collapsed} />

      {/* Collapse Toggle */}
      <motion.div className="absolute -right-3 top-6 z-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 rounded-full border border-white/20 bg-slate-800/80 backdrop-blur-sm p-0 shadow-lg hover:bg-slate-700/80 hover:border-white/30"
          onClick={() => setCollapsed(!collapsed)}
        >
          <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <ChevronRight className="h-3 w-3 text-gray-300" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}

function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="sm" className="lg:hidden text-gray-300 hover:text-white hover:bg-white/10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10">
        <SidebarContent collapsed={false} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <DesktopSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <motion.header
          className="flex h-16 items-center gap-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl px-4 lg:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MobileSidebar />
          <div className="flex-1">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="relative min-h-full">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
                animate={{
                  x: [0, -100, 0],
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
