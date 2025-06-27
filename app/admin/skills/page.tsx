/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Search, Filter, RefreshCcw, Zap, TrendingUp, Award, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { SkillForm } from "@/components/admin/skills/skill-form"
import { SkillPreview } from "@/components/admin/skills/skill-preview"
import { motion, AnimatePresence } from "framer-motion"
import { SkillCategory, SkillLevel } from "@prisma/client"
import { Skill } from "@/types/skills"



function getCategoryBadgeColor(category: SkillCategory): string {
  const colors: Record<string, string> = {
    FRONTEND: "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-blue-500/20",
    BACKEND: "bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/20",
    DATABASE: "bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-purple-500/20",
    DEVOPS: "bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-orange-500/20",
    MOBILE: "bg-pink-500/20 text-pink-400 border-pink-500/30 shadow-pink-500/20",
    DESIGN: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-indigo-500/20",
    TESTING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20",
    OTHER: "bg-gray-500/20 text-gray-400 border-gray-500/30 shadow-gray-500/20",
  }
  return colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

function getLevelBadgeColor(level: SkillLevel): string {
  const colors: Record<string, string> = {
    BEGINNER: "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20",
    INTERMEDIATE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20",
    ADVANCED: "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-blue-500/20",
    EXPERT: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20",
  }
  return colors[level] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

function formatCategoryName(category: SkillCategory): string {
  return category.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

function formatLevelName(level: SkillLevel): string {
  return level.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
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

  // Calculate statistics
  const stats = {
    total: skills.length,
    expert: skills.filter((s) => s.level === SkillLevel.EXPERT).length,
    advanced: skills.filter((s) => s.level === SkillLevel.ADVANCED).length,
    categories: new Set(skills.map((s) => s.category)).size,
  }

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
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
              Skills
            </h1>
            <p className="text-muted-foreground text-lg">Manage your technical skills and expertise levels.</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={openCreateForm}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Skill
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
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6" variants={containerVariants}>
          {[
            { title: "Total Skills", value: stats.total, icon: Code, gradient: "from-blue-500 to-cyan-500" },
            { title: "Expert Level", value: stats.expert, icon: Award, gradient: "from-emerald-500 to-teal-500" },
            {
              title: "Advanced Level",
              value: stats.advanced,
              icon: TrendingUp,
              gradient: "from-purple-500 to-pink-500",
            },
            { title: "Categories", value: stats.categories, icon: Zap, gradient: "from-orange-500 to-red-500" },
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
                      className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
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
                    <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
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
        </motion.div>

        {/* Skills Table */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-600" />
                Skills ({filteredSkills.length})
              </CardTitle>
              <CardDescription>A list of all your skills with quick actions.</CardDescription>
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
              ) : filteredSkills.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-4">
                    {searchTerm || filterCategory !== "all" || filterLevel !== "all"
                      ? "No skills match your search criteria."
                      : "No skills found. Add your first skill!"}
                  </p>
                  {!searchTerm && filterCategory === "all" && filterLevel === "all" && (
                    <Button
                      onClick={openCreateForm}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Skill
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="rounded-lg border border-purple-100 dark:border-purple-900/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Level</TableHead>
                        <TableHead className="font-semibold">Description</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredSkills.map((skill, index) => (
                          <motion.tr
                            key={skill.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors duration-200"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {skill.icon && (
                                  <div className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                    <span className="text-lg">{skill.icon}</span>
                                  </div>
                                )}
                                <span className="font-semibold">{skill.name}</span>
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
                            <TableCell>
                              <div
                                className="max-w-48 truncate text-sm text-muted-foreground"
                                title={skill.description}
                              >
                                {skill.description || "No description"}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPreviewSkill(skill)}
                                    className="hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditForm(skill)}
                                    className="hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeletingSkill(skill)}
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
    </motion.div>
  )
}
