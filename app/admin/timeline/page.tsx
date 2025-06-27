/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Search, Filter, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { TimelinePostPreview } from "@/components/admin/timeline-post-preview"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { TimelinePostForm } from "@/components/admin/timeline-post-form"
import { TimeLinePostType } from "@prisma/client"
import type { TimelinePost } from "@/types/timelineposts"
import { motion } from "framer-motion"

function getTypeBadgeColor(type: TimeLinePostType): string {
  switch (type) {
    case TimeLinePostType.EDUCATION:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
    case TimeLinePostType.WORK:
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
    case TimeLinePostType.VOLUNTEERING:
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
    case TimeLinePostType.PARTICIPATION:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case TimeLinePostType.AWARD:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case TimeLinePostType.PUBLICATION:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

function getTypeLabel(type: TimeLinePostType): string {
  switch (type) {
    case TimeLinePostType.EDUCATION:
      return "Education"
    case TimeLinePostType.WORK:
      return "Work"
    case TimeLinePostType.VOLUNTEERING:
      return "Volunteering"
    case TimeLinePostType.PARTICIPATION:
      return "Participation"
    case TimeLinePostType.AWARD:
      return "Award"
    case TimeLinePostType.PUBLICATION:
      return "Publication"
    default:
      return "Other"
  }
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

export default function TimelineAdminPage() {
  const [timelinePosts, setTimelinePosts] = useState<TimelinePost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<TimelinePost | null>(null)
  const [deletingPost, setDeletingPost] = useState<TimelinePost | null>(null)
  const [previewPost, setPreviewPost] = useState<TimelinePost | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const { toast } = useToast()

  const fetchTimelinePosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/timelineposts")
      if (!response.ok) {
        throw new Error("Failed to fetch timeline posts")
      }
      const data = await response.json()
      setTimelinePosts(data)
    } catch (error) {
      console.error("Error fetching timeline posts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch timeline posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimelinePosts()
  }, [])

  const filteredPosts = timelinePosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || post.type === filterType

    return matchesSearch && matchesFilter
  })

  const handleCreatePost = async (postData: Omit<TimelinePost, "id">) => {
    try {
      setFormLoading(true)
      const response = await fetch("/api/timelineposts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error("Failed to create timeline post")
      }

      const newPost = await response.json()
      setTimelinePosts([...timelinePosts, newPost])
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Timeline post created successfully",
      })
    } catch (error) {
      console.error("Error creating timeline post:", error)
      toast({
        title: "Error",
        description: "Failed to create timeline post",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditPost = async (postData: Omit<TimelinePost, "id">) => {
    if (!editingPost) return

    try {
      setFormLoading(true)
      const response = await fetch(`/api/timelineposts/${editingPost.id}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error("Failed to update timeline post")
      }

      const updatedPost = await response.json()
      setTimelinePosts(timelinePosts.map((post) => (post.id === editingPost.id ? updatedPost : post)))
      setEditingPost(null)
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Timeline post updated successfully",
      })
    } catch (error) {
      console.error("Error updating timeline post:", error)
      toast({
        title: "Error",
        description: "Failed to update timeline post",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeletePost = async (post: TimelinePost) => {
    try {
      const response = await fetch(`/api/timelineposts/${post.id}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete timeline post")
      }

      setTimelinePosts(timelinePosts.filter((p) => p.id !== post.id))
      setDeletingPost(null)
      toast({
        title: "Success",
        description: "Timeline post deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting timeline post:", error)
      toast({
        title: "Error",
        description: "Failed to delete timeline post",
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = (postData: Omit<TimelinePost, "id">) => {
    if (editingPost) {
      handleEditPost(postData)
    } else {
      handleCreatePost(postData)
    }
  }

  const handleRefresh = () => {
    fetchTimelinePosts()
    setSearchTerm("")
    setFilterType("all")
  }

  const openCreateForm = () => {
    setEditingPost(null)
    setIsFormOpen(true)
  }

  const openEditForm = (post: TimelinePost) => {
    setEditingPost(post)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingPost(null)
  }

  const statCards = [
    {
      title: "Total Posts",
      value: timelinePosts.length,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Education",
      value: timelinePosts.filter((p) => p.type === TimeLinePostType.EDUCATION).length,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
    },
    {
      title: "Work",
      value: timelinePosts.filter((p) => p.type === TimeLinePostType.WORK).length,
      gradient: "from-cyan-500 to-teal-500",
      bgGradient: "from-cyan-500/10 to-teal-500/10",
    },
    {
      title: "Awards",
      value: timelinePosts.filter((p) => p.type === TimeLinePostType.AWARD).length,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
    },
  ]

  return (
    <motion.div className="p-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Timeline Posts
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
                  Manage your timeline posts, education, work experience, and achievements.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={openCreateForm}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Post
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh Posts
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6" variants={containerVariants}>
          {statCards.map((stat, ) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm" />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Filter & Search</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Find specific timeline posts using filters and search.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="border-gray-300 dark:border-gray-600">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.values(TimeLinePostType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {getTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline Posts Table */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Timeline Posts ({filteredPosts.length})
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                A list of all your timeline posts with quick actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    {searchTerm || filterType !== "all"
                      ? "No posts match your search criteria."
                      : "No timeline posts found. Create your first post!"}
                  </p>
                  {!searchTerm && filterType === "all" && (
                    <Button
                      onClick={openCreateForm}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Post
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Title</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Type</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Institution</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Year</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Location</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900 dark:text-white">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post, index) => (
                        <motion.tr
                          key={post.id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            <div className="max-w-48 truncate" title={post.title}>
                              {post.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(post.type)}>{getTypeLabel(post.type)}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            <div className="max-w-32 truncate" title={post.institution || ""}>
                              {post.institution || "-"}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{post.year}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            <div className="max-w-32 truncate" title={post.location || ""}>
                              {post.location || "-"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setPreviewPost(post)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditForm(post)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeletingPost(post)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Form Modal */}
      <TimelinePostForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={editingPost}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={() => deletingPost && handleDeletePost(deletingPost)}
        title={deletingPost?.title || ""}
      />

      {/* Preview Modal */}
      <TimelinePostPreview isOpen={!!previewPost} onClose={() => setPreviewPost(null)} post={previewPost} />
    </motion.div>
  )
}
