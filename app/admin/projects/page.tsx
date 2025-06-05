"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Search, Filter, ExternalLink, Github } from "lucide-react"
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
    JS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    HTML: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    CSS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    REACT: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    NEXTJS: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    TAILWINDCSS: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    TYPESCRIPT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    NODEJS: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    MONGODB: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    POSTGRESQL: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    GRAPHQL: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    GITHUB: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    VERCEL: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    NETLIFY: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    AWS: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    DOCKER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    PYTHON: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    DJANGO: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    FLASK: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    REDUX: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    VUEJS: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    ANGULAR: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    BOOTSTRAP: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    SASS: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    FIGMA: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    API: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  }

  return colors[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage your portfolio projects and case studies.</p>
          </div>
          <Button onClick={openCreateForm} className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">React Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter((p) => p.tags.includes(ProjectTags.REACT)).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next.js Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter((p) => p.tags.includes(ProjectTags.NEXTJS)).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.filter((p) => p.live).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
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
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {Object.values(ProjectTags).map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Projects ({filteredProjects.length})</CardTitle>
            <CardDescription>A list of all your portfolio projects with quick actions.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm || filterTag !== "all"
                    ? "No projects match your search criteria."
                    : "No projects found. Create your first project!"}
                </p>
                {!searchTerm && filterTag === "all" && (
                  <Button onClick={openCreateForm} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Links</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <div className="max-w-48 truncate" title={project.title}>
                            {project.title}
                          </div>

                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="max-w-96 truncate" title={project.description}>
                            {project.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-48">
                            {project.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} className={getTagBadgeColor(tag)}>
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 3 && <Badge variant="outline">+{project.tags.length - 3}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                                title="GitHub Repository"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                                title="Live Demo"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(project.updatedAt)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setPreviewProject(project)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditForm(project)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingProject(project)}
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
    </div>
  )
}
