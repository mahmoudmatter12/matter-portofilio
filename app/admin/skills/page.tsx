"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Search, Filter, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { SkillPreview } from "@/components/admin/skills/skill-preview"
import { SkillForm } from "@/components/admin/skills/skill-form"

enum SkillCategory {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  DATABASE = "DATABASE",
  DEVOPS = "DEVOPS",
  MOBILE = "MOBILE",
  DESIGN = "DESIGN",
  TOOLS = "TOOLS",
  LANGUAGES = "LANGUAGES",
  FRAMEWORKS = "FRAMEWORKS",
  OTHER = "OTHER",
}

enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
  description?: string
  icon?: string
  yearsOfExperience?: number
  createdAt: Date
  updatedAt: Date
}

function getCategoryBadgeColor(category: SkillCategory): string {
  const colors: Record<string, string> = {
    FRONTEND: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    BACKEND: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    DATABASE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    DEVOPS: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    MOBILE: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    DESIGN: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    TOOLS: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    LANGUAGES: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    FRAMEWORKS: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  }

  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
}

function getLevelBadgeColor(level: SkillLevel): string {
  const colors: Record<string, string> = {
    BEGINNER: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    ADVANCED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    EXPERT: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  }

  return colors[level] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
}

function formatCategoryName(category: SkillCategory): string {
  return category
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

function formatLevelName(level: SkillLevel): string {
  return level.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null)
  const [previewSkill, setPreviewSkill] = useState<Skill | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const { toast } = useToast()

  // Fetch skills
  const fetchSkills = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/skills")
      if (!response.ok) {
        throw new Error("Failed to fetch skills")
      }
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error("Error fetching skills:", error)
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter and search skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || skill.category === filterCategory
    const matchesLevel = filterLevel === "all" || skill.level === filterLevel

    return matchesSearch && matchesCategory && matchesLevel
  })

  // Handle create skill
  const handleCreateSkill = async (skillData: Omit<Skill, "id" | "createdAt" | "updatedAt">) => {
    try {
      setFormLoading(true)
      const response = await fetch("/api/skills/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      })

      if (!response.ok) {
        throw new Error("Failed to create skill")
      }

      const newSkill = await response.json()
      setSkills([...skills, newSkill])
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Skill created successfully",
      })
    } catch (error) {
      console.error("Error creating skill:", error)
      toast({
        title: "Error",
        description: "Failed to create skill",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Handle edit skill
  const handleEditSkill = async (skillData: Omit<Skill, "id" | "createdAt" | "updatedAt">) => {
    if (!editingSkill) return

    try {
      setFormLoading(true)
      const response = await fetch(`/api/skills/${editingSkill.id}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      })

      if (!response.ok) {
        throw new Error("Failed to update skill")
      }

      const updatedSkill = await response.json()
      setSkills(skills.map((skill) => (skill.id === editingSkill.id ? updatedSkill : skill)))
      setEditingSkill(null)
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Skill updated successfully",
      })
    } catch (error) {
      console.error("Error updating skill:", error)
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Handle delete skill
  const handleDeleteSkill = async (skill: Skill) => {
    try {
      const response = await fetch(`/api/skills/${skill.id}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete skill")
      }

      setSkills(skills.filter((s) => s.id !== skill.id))
      setDeletingSkill(null)
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  // Handle form submission
  const handleFormSubmit = (skillData: Omit<Skill, "id" | "createdAt" | "updatedAt">) => {
    if (editingSkill) {
      handleEditSkill(skillData)
    } else {
      handleCreateSkill(skillData)
    }
  }

  // handle refresh
  const handleRefresh = () => {
    fetchSkills()
    setSearchTerm("")
    setFilterCategory("all")
    setFilterLevel("all")
  }

  // Open create form
  const openCreateForm = () => {
    setEditingSkill(null)
    setIsFormOpen(true)
  }

  // Open edit form
  const openEditForm = (skill: Skill) => {
    setEditingSkill(skill)
    setIsFormOpen(true)
  }

  // Close form
  const closeForm = () => {
    setIsFormOpen(false)
    setEditingSkill(null)
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
            <p className="text-muted-foreground">Manage your technical skills and expertise levels.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openCreateForm} className="w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Add New Skill
            </Button>
            <Button variant="outline" onClick={handleRefresh} className="ml-2">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Skills
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skills.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expert Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skills.filter((s) => s.level === SkillLevel.EXPERT).length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frontend Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {skills.filter((s) => s.category === SkillCategory.FRONTEND).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backend Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {skills.filter((s) => s.category === SkillCategory.BACKEND).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
            <CardDescription>Find specific skills using filters and search.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.values(SkillCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {formatCategoryName(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {Object.values(SkillLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {formatLevelName(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Table */}
        <Card className="bg-gradient-to-r dark:from-blue-900/10 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle>Skills ({filteredSkills.length})</CardTitle>
            <CardDescription>A list of all your skills with quick actions.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : filteredSkills.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm || filterCategory !== "all" || filterLevel !== "all"
                    ? "No skills match your search criteria."
                    : "No skills found. Create your first skill!"}
                </p>
                {!searchTerm && filterCategory === "all" && filterLevel === "all" && (
                  <Button onClick={openCreateForm} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Skill
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSkills.map((skill) => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {skill.icon && <span className="text-lg">{skill.icon}</span>}
                            <div>
                              <div className="max-w-48 truncate" title={skill.name}>
                                {skill.name}
                              </div>
                              {skill.description && (
                                <div className="text-xs text-muted-foreground mt-1 max-w-48 truncate">
                                  {skill.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryBadgeColor(skill.category)}>
                            {formatCategoryName(skill.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLevelBadgeColor(skill.level)}>{formatLevelName(skill.level)}</Badge>
                        </TableCell>
                        <TableCell>{skill.yearsOfExperience ? `${skill.yearsOfExperience} years` : "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setPreviewSkill(skill)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditForm(skill)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingSkill(skill)}
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
      <SkillForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={editingSkill}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingSkill}
        onClose={() => setDeletingSkill(null)}
        onConfirm={() => deletingSkill && handleDeleteSkill(deletingSkill)}
        title={deletingSkill?.name || ""}
      />

      {/* Preview Modal */}
      <SkillPreview isOpen={!!previewSkill} onClose={() => setPreviewSkill(null)} skill={previewSkill} />
    </div>
  )
}
