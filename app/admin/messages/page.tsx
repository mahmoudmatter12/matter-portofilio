/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  Search,
  Reply,
  Eye,
  Send,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  name: string
  email: string
  title: string
  details: string
  status: "NEW" | "READ" | "REPLIED"
  createdAt: string
  updatedAt: string
}

interface MessageStats {
  total: number
  NEW: number
  READ: number
  REPLIED: number
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
      ease: "easeOut",
    },
  },
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "NEW" | "READ" | "REPLIED">("all")
  const [, setSelectedMessage] = useState<Message | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [stats, setStats] = useState<MessageStats>({ total: 0, NEW: 0, READ: 0, REPLIED: 0 })
  const [showResetDialog, setShowResetDialog] = useState(false)

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages/get-message")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  // Filter messages
  useEffect(() => {
    let filtered = messages

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((message) => message.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (message) =>
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.title.toLowerCase().includes(query) ||
          message.details.toLowerCase().includes(query),
      )
    }

    setFilteredMessages(filtered)
  }, [messages, searchQuery, statusFilter])

  const calculateStats = (messageList: Message[]) => {
    const stats = messageList.reduce(
      (acc, message) => {
        acc.total++
        acc[message.status]++
        return acc
      },
      { total: 0, NEW: 0, READ: 0, REPLIED: 0 },
    )
    setStats(stats)
  }

  const handleResetMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/messages/delete-all", {
        method: "DELETE",
      })
      if (response.ok) {
        setMessages([])
        setFilteredMessages([])
        setStats({ total: 0, NEW: 0, READ: 0, REPLIED: 0 })
      } else {
        const errorData = await response.json()
        console.error("Failed to reset messages:", errorData)
      }
    } catch (error) {
      console.error("Error resetting messages:", error)
      alert("Failed to reset messages. Please try again later.")
    } finally {
      setLoading(false)
      setShowResetDialog(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/mark-read`, {
        method: "PATCH",
      })

      if (response.ok) {
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "READ" as const } : msg)))
        setStats((prev) => ({
          ...prev,
          NEW: prev.NEW - 1,
          read: prev.READ + 1,
        }))
        setFilteredMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, status: "READ" as const } : msg)),
        )
      }
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const handleReply = async (messageId: string) => {
    if (!replyContent.trim()) return

    setIsReplying(true)
    try {
      const response = await fetch("/api/messages/answer-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          replyContent: replyContent.trim(),
          name: messages.find((msg) => msg.id === messageId)?.name || "",
          email: messages.find((msg) => msg.id === messageId)?.email || "",
        }),
      })

      if (response.ok) {
        const updatedMessage = await response.json()
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? updatedMessage : msg)))
        setReplyContent("")
        setSelectedMessage(null)
        refresh()
      }
    } catch (error) {
      console.error("Error sending reply:", error)
    } finally {
      setIsReplying(false)
    }
  }

  const getStatusBadge = (status: Message["status"]) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-blue-500/20">New</Badge>
      case "READ":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20">Read</Badge>
        )
      case "REPLIED":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20">
            Replied
          </Badge>
        )
    }
  }

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "NEW":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "READ":
        return <Eye className="h-4 w-4 text-yellow-500" />
      case "REPLIED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
    }
  }

  const refresh = () => {
    setLoading(true)
    try {
      fetchMessages()
    } catch (error) {
      console.error("Error refreshing messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-muted-foreground text-lg">Manage contact form submissions and customer inquiries</p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={refresh}
              variant="outline"
              className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6" variants={containerVariants}>
          {[
            { title: "Total Messages", value: stats.total, icon: MessageSquare, gradient: "from-blue-500 to-cyan-500" },
            { title: "New Messages", value: stats.NEW, icon: Mail, gradient: "from-purple-500 to-pink-500" },
            { title: "Read Messages", value: stats.READ, icon: Eye, gradient: "from-yellow-500 to-orange-500" },
            { title: "Replied", value: stats.REPLIED, icon: CheckCircle, gradient: "from-emerald-500 to-teal-500" },
          ].map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <motion.div
                    className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                Filter Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Messages</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="status-filter">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="NEW">New Messages</SelectItem>
                      <SelectItem value="read">Read Messages</SelectItem>
                      <SelectItem value="REPLIED">Replied Messages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Messages ({filteredMessages.length})
                  </CardTitle>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setShowResetDialog(true)}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset All Messages
                    </Button>
                  </motion.div>
                </div>
                <CardDescription>
                  {statusFilter === "all" ? "All messages" : `${statusFilter} messages`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredMessages.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "No messages have been received yet"}
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {filteredMessages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "border rounded-xl p-6 transition-all hover:shadow-md bg-gradient-to-r",
                            message.status === "NEW" &&
                              "from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800",
                            message.status === "READ" &&
                              "from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800",
                            message.status === "REPLIED" &&
                              "from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800",
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <motion.div whileHover={{ scale: 1.1 }}>{getStatusIcon(message.status)}</motion.div>
                                <h3 className="font-semibold text-lg">{message.title}</h3>
                                {getStatusBadge(message.status)}
                              </div>

                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span className="font-medium">{message.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{message.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(message.createdAt)}</span>
                                </div>
                              </div>

                              <p className="text-muted-foreground leading-relaxed">{message.details}</p>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              {message.status === "NEW" && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => markAsRead(message.id)}
                                    className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/50"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              )}

                              {message.status !== "REPLIED" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedMessage(message)
                                          setReplyContent("")
                                        }}
                                        className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50"
                                      >
                                        <Reply className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Reply to Message</DialogTitle>
                                      <DialogDescription>
                                        Replying to {message.name} ({message.email})
                                      </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                      <div className="p-4 bg-muted rounded-lg">
                                        <h4 className="font-semibold mb-2">{message.title}</h4>
                                        <p className="text-sm">{message.details}</p>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="reply">Your Reply</Label>
                                        <Textarea
                                          id="reply"
                                          placeholder="Type your reply here..."
                                          value={replyContent}
                                          onChange={(e) => setReplyContent(e.target.value)}
                                          className="min-h-[120px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                        />
                                      </div>

                                      <div className="flex justify-end gap-2">
                                        <DialogTrigger asChild>
                                          <Button variant="outline">Cancel</Button>
                                        </DialogTrigger>
                                        <Button
                                          onClick={() => handleReply(message.id)}
                                          disabled={!replyContent.trim() || isReplying}
                                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                        >
                                          {isReplying ? (
                                            <>
                                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                                              Sending...
                                            </>
                                          ) : (
                                            <>
                                              <Send className="h-3 w-3 mr-2" />
                                              Send Reply
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={showResetDialog}
          onClose={() => setShowResetDialog(false)}
          onConfirm={handleResetMessages}
          title="all messages"
          ActionName="Reset Messages"
        />
      </div>
    </motion.div>
  )
}
