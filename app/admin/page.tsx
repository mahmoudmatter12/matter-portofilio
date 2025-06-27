"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  FolderOpen,
  Mail,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  User,
  Sparkles,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useProfile } from "@/context/ProfileProvidor"
import Image from "next/image"
import { motion } from "framer-motion"

interface DashboardStats {
  timelinePosts: number
  projects: number
  messages: number
  users: number
}

interface RecentActivity {
  id: string
  type: "timeline" | "project" | "message" | "user"
  title: string
  description: string
  timestamp: string
  status: "completed" | "pending" | "draft"
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    timelinePosts: 0,
    projects: 0,
    messages: 0,
    users: 0,
  })
  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "timeline",
      title: "New Timeline Post",
      description: "Added Bachelor's in Computer Science",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "message",
      title: "Contact Form Submission",
      description: "New message from John Doe",
      timestamp: "4 hours ago",
      status: "pending",
    },
    {
      id: "3",
      type: "timeline",
      title: "Updated Work Experience",
      description: "Modified Senior Developer position",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: "4",
      type: "project",
      title: "Project Draft",
      description: "E-commerce platform project saved as draft",
      timestamp: "2 days ago",
      status: "draft",
    },
  ])
  const [loading, setLoading] = useState(true)
  const { profile } = useProfile()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const timelineResponse = await fetch("/api/timelineposts")
        const timelineData = await timelineResponse.json()

        setStats({
          timelinePosts: Array.isArray(timelineData) ? timelineData.length : 0,
          projects: 12,
          messages: 3,
          users: 1,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getActivityIcon = (type: string) => {
    const iconClass = "h-4 w-4"
    switch (type) {
      case "timeline":
        return <Calendar className={iconClass} />
      case "project":
        return <FolderOpen className={iconClass} />
      case "message":
        return <Mail className={iconClass} />
      case "user":
        return <Users className={iconClass} />
      default:
        return <Clock className={iconClass} />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "draft":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>
        )
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const statCards = [
    {
      title: "Timeline Posts",
      value: stats.timelinePosts,
      icon: Calendar,
      change: "+2",
      changeText: "from last month",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      change: "+1",
      changeText: "from last month",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: Mail,
      change: "3",
      changeText: "unread",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "Total Views",
      value: 2847,
      icon: TrendingUp,
      change: "+12%",
      changeText: "from last month",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
    },
  ]

  const quickActions = [
    {
      title: "Add Timeline Post",
      href: "/admin/timeline",
      icon: Plus,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Create New Project",
      href: "/admin/projects",
      icon: Plus,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Add new skills",
      href: "/admin/skills",
      icon: Plus,
      gradient: "from-green-500 to-emerald-500",
      badge: "Soon",
    },
    {
      title: "Check Messages",
      href: "/admin/messages",
      icon: Mail,
      gradient: "from-orange-500 to-red-500",
      badge: "3",
    },
  ]

  return (
    <motion.div className="p-6 space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl" />
        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/30">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BarChart3 className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Welcome back! Heres an overview of your content and activity.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
        {statCards.map((stat, ) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
                <motion.div
                  className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-md`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="h-4 w-4 text-white" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? "..." : stat.value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span className="text-green-600 font-medium">{stat.change}</span> {stat.changeText}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"
                  whileHover={{ rotate: 10 }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Common tasks and shortcuts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={action.href}>
                    <Button
                      className="w-full justify-start bg-transparent hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-lg transition-all duration-300 group"
                      variant="outline"
                      disabled={action.badge === "Soon"}
                    >
                      <motion.div
                        className={`p-1.5 bg-gradient-to-br ${action.gradient} rounded-md mr-3 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-4 w-4 text-white" />
                      </motion.div>
                      <span className="flex-1 text-left">{action.title}</span>
                      {action.badge && (
                        <Badge
                          variant={action.badge === "Soon" ? "secondary" : "default"}
                          className={
                            action.badge === "Soon"
                              ? ""
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }
                        >
                          {action.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Overview */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg"
                  whileHover={{ rotate: -10 }}
                >
                  <User className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Profile Overview</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your current profile information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {profile.avatar && (
                      <motion.div
                        className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Image src={profile.avatar || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                      </motion.div>
                    )}
                    <div>
                      <p className="font-semibold text-lg text-gray-900 dark:text-white">{profile.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.professions?.[0] || "No profession set"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400 block text-xs font-medium">Location:</span>
                      <p className="font-semibold text-gray-900 dark:text-white">{profile.location || "Not set"}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400 block text-xs font-medium">Email:</span>
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {profile.email?.[0] || "Not set"}
                      </p>
                    </div>
                  </div>
                  <Link href="/admin/profile">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <User className="h-4 w-4 mr-2" />
                      Manage Profile
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <User className="h-8 w-8 text-gray-500" />
                  </motion.div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No profile found</p>
                  <Link href="/admin/profile">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Profile
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Clock className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Latest changes and updates
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/50 hover:from-gray-100/50 dark:hover:from-gray-700/50 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="flex-shrink-0 mt-1 p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"
                      whileHover={{ rotate: 10 }}
                    >
                      {getActivityIcon(activity.type)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {activity.title}
                        </p>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-500">{activity.timestamp}</p>
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Content Overview */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg"
                whileHover={{ rotate: -10 }}
              >
                <BarChart3 className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Content Overview</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Summary of your content across different sections
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Calendar,
                  title: "Timeline",
                  value: stats.timelinePosts,
                  subtitle: "Education & Work",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: FolderOpen,
                  title: "Projects",
                  value: stats.projects,
                  subtitle: "Portfolio Items",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: MessageSquare,
                  title: "Messages",
                  value: stats.messages,
                  subtitle: "Contact Inquiries",
                  gradient: "from-green-500 to-emerald-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
