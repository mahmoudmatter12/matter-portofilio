/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ExternalLink,
  Github,
  RefreshCcw,
  FolderOpen,
  Code,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { ProjectPreview } from "@/components/admin/projects/project-preview"
import { ProjectForm } from "@/components/admin/projects/project-form"
import { motion, AnimatePresence } from "framer-motion"

enum ProjectTags {
  JS = "JS",
  HTML = "HTML",
  CSS = "CSS",
  REACT = "REACT",
  NEXTJS = "NEXTJS",
  TAILWINDCSS = "TAILWINDCSS",
  TYPESCRIPT = "TYPESCRIPT",
  NODEJS = "NODEJS",
  EXPRESSJS = "EXPRESSJS",
  MONGODB = "MONGODB",
  POSTGRESQL = "POSTGRESQL",
  GRAPHQL = "GRAPHQL",
  GITHUB = "GITHUB",
  VERCEL = "VERCEL",
  NETLIFY = "NETLIFY",
  AWS = "AWS",
  DOCKER = "DOCKER",
  KUBERNETES = "KUBERNETES",
  PYTHON = "PYTHON",
  DJANGO = "DJANGO",
  FLASK = "FLASK",
  REACT_ROUTER = "REACT_ROUTER",
  REDUX = "REDUX",
  VUEJS = "VUEJS",
  ANGULAR = "ANGULAR",
  BOOTSTRAP = "BOOTSTRAP",
  SASS = "SASS",
  FIGMA = "FIGMA",
  API = "API",
  OTHER = "OTHER",
}

export interface Project {
  id: string
  title: string
  description: string
  image?: string
  github?: string
  live?: string
  tags: ProjectTags[]
  features: string[]
  achievements: string[]
  createdAt: Date
  updatedAt: Date
}

function getTagBadgeColor(tag: ProjectTags): string {
  const colors: Record<string, string> = {
    JS: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30 shadow-yellow-500/20",
    HTML: "bg-orange-500/20 text-orange-600 border-orange-500/30 shadow-orange-500/20",
    CSS: "bg-blue-500/20 text-blue-600 border-blue-500/30 shadow-blue-500/20",
    REACT: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30 shadow-cyan-500/20",
    NEXTJS: "bg-gray-500/20 text-gray-600 border-gray-500/30 shadow-gray-500/20",
    TAILWINDCSS: "bg-teal-500/20 text-teal-600 border-teal-500/30 shadow-teal-500/20",
    TYPESCRIPT: "bg-blue-500/20 text-blue-600 border-blue-500/30 shadow-blue-500/20",
    NODEJS: "bg-green-500/20 text-green-600 border-green-500/30 shadow-green-500/20",
    MONGODB: "bg-green-500/20 text-green-600 border-green-500/30 shadow-green-500/20",
    POSTGRESQL: "bg-indigo-500/20 text-indigo-600 border-indigo-500/30 shadow-indigo-500/20",
    GRAPHQL: "bg-pink-500/20 text-pink-600 border-pink-500/30 shadow-pink-500/20",
    GITHUB: "bg-gray-500/20 text-gray-600 border-gray-500/30 shadow-gray-500/20",
    VERCEL: "bg-gray-500/20 text-gray-600 border-gray-500/30 shadow-gray-500/20",
    NETLIFY: "bg-teal-500/20 text-teal-600 border-teal-500/30 shadow-teal-500/20",
    AWS: "bg-orange-500/20 text-orange-600 border-orange-500/30 shadow-orange-500/20",
    DOCKER: "bg-blue-500/20 text-blue-600 border-blue-500/30 shadow-blue-500/20",
    PYTHON: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30 shadow-yellow-500/20",
    DJANGO: "bg-green-500/20 text-green-600 border-green-500/30 shadow-green-500/20",
    FLASK: "bg-gray-500/20 text-gray-600 border-gray-500/30 shadow-gray-500/20",
    REDUX: "bg-purple-500/20 text-purple-600 border-purple-500/30 shadow-purple-500/20",
    VUEJS: "bg-green-500/20 text-green-600 border-green-500/30 shadow-green-500/20",
    ANGULAR: "bg-red-500/20 text-red-600 border-red-500/30 shadow-red-500/20",
    BOOTSTRAP: "bg-purple-500/20 text-purple-600 border-purple-500/30 shadow-purple-500/20",
    SASS: "bg-pink-500/20 text-pink-600 border-pink-500/30 shadow-pink-500/20",
    FIGMA: "bg-purple-500/20 text-purple-600 border-purple-500/30 shadow-purple-500/20",
    API: "bg-indigo-500/20 text-indigo-600 border-indigo-500/30 shadow-indigo-500/20",
  }

  return colors[tag] || "bg-gray-500/20 text-gray-600 border-gray-500/30 shadow-gray-500/20"
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

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [previewProject, setPreviewProject] = useState<Project | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const { toast } = useToast()

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects")
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Filter and search projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterTag === "all" || project.tags.includes(filterTag as ProjectTags)

    return matchesSearch && matchesFilter
  })

  // Handle create project
  const handleCreateProject = async (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    try {
      setFormLoading(true)
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create project")
      }

      const newProject = await response.json()
      setProjects([...projects, newProject])
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Project created successfully",
      })
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Handle edit project
  const handleEditProject = async (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    if (!editingProject) return

    try {
      setFormLoading(true)
      const response = await fetch(`/api/projects/${editingProject.id}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      const updatedProject = await response.json()
      setProjects(projects.map((project) => (project.id === editingProject.id ? updatedProject : project)))
      setEditingProject(null)
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Project updated successfully",
      })
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Handle delete project
  const handleDeleteProject = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects(projects.filter((p) => p.id !== project.id))
      setDeletingProject(null)
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  // Handle form submission
  const handleFormSubmit = (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    if (editingProject) {
      handleEditProject(projectData)
    } else {
      handleCreateProject(projectData)
    }
  }

  // handle refresh
  const handleRefresh = () => {
    fetchProjects()
    setSearchTerm("")
    setFilterTag("all")
  }

  // Open create form
  const openCreateForm = () => {
    setEditingProject(null)
    setIsFormOpen(true)
  }

  // Open edit form
  const openEditForm = (project: Project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  // Close form
  const closeForm = () => {
    setIsFormOpen(false)
    setEditingProject(null)
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div
      className="p-6 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-muted-foreground text-lg">Manage your portfolio projects and showcase your work.</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={openCreateForm}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Project
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50 bg-transparent"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants}>
          {[
            {
              title: "Total Projects",
              value: projects.length,
              icon: FolderOpen,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              title: "With Live Demo",
              value: projects.filter((p) => p.live).length,
              icon: Globe,
              gradient: "from-emerald-500 to-teal-500",
            },
            {
              title: "With Source Code",
              value: projects.filter((p) => p.github).length,
              icon: Code,
              gradient: "from-purple-500 to-pink-500",
            },
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

        {/* Filters and Search */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                Filter & Search
              </CardTitle>
              <CardDescription>Find specific projects using filters and search.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterTag} onValueChange={setFilterTag}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {Object.values(ProjectTags).map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Table */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-purple-600" />
                Projects ({filteredProjects.length})
              </CardTitle>
              <CardDescription>A list of all your projects with quick actions.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-4">
                    {searchTerm || filterTag !== "all"
                      ? "No projects match your search criteria."
                      : "No projects found. Create your first project!"}
                  </p>
                  {!searchTerm && filterTag === "all" && (
                    <Button
                      onClick={openCreateForm}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Project
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="rounded-lg border border-purple-100 dark:border-purple-900/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                        <TableHead className="font-semibold">Title</TableHead>
                        <TableHead className="font-semibold">Tags</TableHead>
                        <TableHead className="font-semibold">Links</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredProjects.map((project, index) => (
                          <motion.tr
                            key={project.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors duration-200"
                          >
                            <TableCell className="font-medium">
                              <div>
                                <div className="max-w-48 truncate font-semibold" title={project.title}>
                                  {project.title}
                                </div>
                                <div
                                  className="text-xs text-muted-foreground mt-1 max-w-48 truncate"
                                  title={project.description}
                                >
                                  {project.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-48">
                                {project.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} className={getTagBadgeColor(tag)}>
                                    {tag}
                                  </Badge>
                                ))}
                                {project.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{project.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {project.live && (
                                  <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(project.live, "_blank")}
                                      className="hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </motion.div>
                                )}
                                {project.github && (
                                  <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(project.github, "_blank")}
                                      className="hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-950 dark:hover:text-gray-300"
                                    >
                                      <Github className="h-3 w-3" />
                                    </Button>
                                  </motion.div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">{formatDate(project.createdAt)}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPreviewProject(project)}
                                    className="hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditForm(project)}
                                    className="hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeletingProject(project)}
                                    className="hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Form Modal */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={editingProject}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => deletingProject && handleDeleteProject(deletingProject)}
        title={deletingProject?.title || ""}
      />

      {/* Preview Modal */}
      <ProjectPreview isOpen={!!previewProject} onClose={() => setPreviewProject(null)} project={previewProject} />
    </motion.div>
  )
}
