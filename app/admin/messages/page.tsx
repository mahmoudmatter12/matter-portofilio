/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { Mail, Search, Reply, Eye, Send, Calendar, User, MessageSquare, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"

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
                // Also update filtered messages
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
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">New</Badge>
            case "READ":
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Read</Badge>
            case "REPLIED":
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Replied</Badge>
        }
    }

    const getStatusIcon = (status: Message["status"]) => {
        switch (status) {
            case "NEW":
                return <Mail className="h-4 w-4 text-blue-500" />
            case "READ":
                return <Eye className="h-4 w-4 text-yellow-500" />
            case "REPLIED":
                return <CheckCircle className="h-4 w-4 text-green-500" />
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
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground">Manage contact form submissions and customer inquiries</p>
                </div>
                <Button onClick={refresh} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                        <Mail className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.NEW}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20" >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Read Messages</CardTitle>
                        <Eye className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.READ}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Replied</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.REPLIED}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
                <CardHeader>
                    <CardTitle className="text-lg">Filter Messages</CardTitle>
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
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <Label htmlFor="status-filter">Filter by Status</Label>
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger>
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

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                </div>
            ) : (
                <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
                    <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                            <CardTitle>Messages ({filteredMessages.length})</CardTitle>
                            <Button
                                onClick={() => setShowResetDialog(true)}
                                className="bg-red-700 text-white hover:bg-red-800 cursor-pointer"
                            >
                                Reset All Messages
                            </Button>
                        </div>
                        <CardDescription>{statusFilter === "all" ? "All messages" : `${statusFilter} messages`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredMessages.length === 0 ? (
                            <div className="text-center py-12">
                                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery || statusFilter !== "all"
                                        ? "Try adjusting your filters"
                                        : "No messages have been received yet"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "border rounded-lg p-4 transition-all hover:shadow-md",
                                            message.status === "NEW" && "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20",
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(message.status)}
                                                    <h3 className="font-semibold">{message.title}</h3>
                                                    {getStatusBadge(message.status)}
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {message.name}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {message.email}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(message.createdAt)}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2">{message.details}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {message.status === "NEW" && (
                                                    <Button variant="outline" size="sm" onClick={() => markAsRead(message.id)}>
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                )}

                                                {message.status !== "REPLIED" && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedMessage(message)
                                                                    setReplyContent("")
                                                                }}
                                                            >
                                                                <Reply className="h-3 w-3" />
                                                            </Button>
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
                                                                        className="min-h-[120px]"
                                                                    />
                                                                </div>

                                                                <div className="flex justify-end gap-2">
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline">Cancel</Button>
                                                                    </DialogTrigger>
                                                                    <Button
                                                                        onClick={() => handleReply(message.id)}
                                                                        disabled={!replyContent.trim() || isReplying}
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
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
    )
}