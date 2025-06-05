"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react"
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
import { TimelinePost } from "@/types/timelineposts"



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

  // Fetch timeline posts
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter and search posts
  const filteredPosts = timelinePosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || post.type === filterType

    return matchesSearch && matchesFilter
  })

  // Handle create post
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

  // Handle edit post
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

  // Handle delete post
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

  // Handle form submission
  const handleFormSubmit = (postData: Omit<TimelinePost, "id">) => {
    if (editingPost) {
      handleEditPost(postData)
    } else {
      handleCreatePost(postData)
    }
  }

  // Open create form
  const openCreateForm = () => {
    setEditingPost(null)
    setIsFormOpen(true)
  }

  // Open edit form
  const openEditForm = (post: TimelinePost) => {
    setEditingPost(post)
    setIsFormOpen(true)
  }

  // Close form
  const closeForm = () => {
    setIsFormOpen(false)
    setEditingPost(null)
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timeline Posts</h1>
            <p className="text-muted-foreground">
              Manage your timeline posts, education, work experience, and achievements.
            </p>
          </div>
          <Button onClick={openCreateForm} className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add New Post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timelinePosts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {timelinePosts.filter((p) => p.type === TimeLinePostType.EDUCATION).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {timelinePosts.filter((p) => p.type === TimeLinePostType.WORK).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Awards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {timelinePosts.filter((p) => p.type === TimeLinePostType.AWARD).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
            <CardDescription>Find specific timeline posts using filters and search.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
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

        {/* Timeline Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline Posts ({filteredPosts.length})</CardTitle>
            <CardDescription>A list of all your timeline posts with quick actions.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm || filterType !== "all"
                    ? "No posts match your search criteria."
                    : "No timeline posts found. Create your first post!"}
                </p>
                {!searchTerm && filterType === "all" && (
                  <Button onClick={openCreateForm} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <div className="max-w-48 truncate" title={post.title}>
                            {post.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeBadgeColor(post.type)}>{getTypeLabel(post.type)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-32 truncate" title={post.institution || ""}>
                            {post.institution || "-"}
                          </div>
                        </TableCell>
                        <TableCell>{post.year}</TableCell>
                        <TableCell>
                          <div className="max-w-32 truncate" title={post.location || ""}>
                            {post.location || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setPreviewPost(post)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditForm(post)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingPost(post)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
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
    </div>
  )
}