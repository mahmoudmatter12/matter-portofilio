"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FolderOpen, Mail, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"

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

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Fetch timeline posts count
        const timelineResponse = await fetch("/api/timelineposts")
        const timelineData = await timelineResponse.json()

        setStats({
          timelinePosts: Array.isArray(timelineData) ? timelineData.length : 0,
          projects: 12, // Placeholder
          messages: 3, // Placeholder
          users: 1, // Placeholder
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
    switch (type) {
      case "timeline":
        return <Calendar className="h-4 w-4" />
      case "project":
        return <FolderOpen className="h-4 w-4" />
      case "message":
        return <Mail className="h-4 w-4" />
      case "user":
        return <Users className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Heres an overview of your content and activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline Posts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.timelinePosts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600">3</span> unread
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/timeline">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Timeline Post
              </Button>
            </Link>
            <Link href="/admin/projects">
              <Button className="w-full justify-start" variant="outline" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
                <Badge variant="secondary" className="ml-auto">
                  Soon
                </Badge>
              </Button>
            </Link>
            <Link href="/admin/messages">
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Check Messages
                <Badge className="ml-auto bg-red-100 text-red-800">3</Badge>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{activity.title}</p>
                      {getStatusIcon(activity.status)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">{activity.timestamp}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Overview</CardTitle>
          <CardDescription>Summary of your content across different sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
              <h3 className="font-semibold">Timeline</h3>
              <p className="text-2xl font-bold text-indigo-600">{stats.timelinePosts}</p>
              <p className="text-sm text-muted-foreground">Education & Work</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
              <h3 className="font-semibold">Projects</h3>
              <p className="text-2xl font-bold text-cyan-600">{stats.projects}</p>
              <p className="text-sm text-muted-foreground">Portfolio Items</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Mail className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold">Messages</h3>
              <p className="text-2xl font-bold text-green-600">{stats.messages}</p>
              <p className="text-sm text-muted-foreground">Contact Inquiries</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
