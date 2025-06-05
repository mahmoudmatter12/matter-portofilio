"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

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

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  initialData?: Project | null
  loading?: boolean
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

export function ProjectForm({ isOpen, onClose, onSubmit, initialData, loading = false }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    github: "",
    live: "",
    tags: [] as ProjectTags[],
    features: [] as string[],
    achievements: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newFeature, setNewFeature] = useState("")
  const [newAchievement, setNewAchievement] = useState("")
  const [tagsOpen, setTagsOpen] = useState(false)

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          description: initialData.description,
          image: initialData.image || "",
          github: initialData.github || "",
          live: initialData.live || "",
          tags: [...initialData.tags],
          features: [...initialData.features],
          achievements: [...initialData.achievements],
        })
      } else {
        setFormData({
          title: "",
          description: "",
          image: "",
          github: "",
          live: "",
          tags: [],
          features: [],
          achievements: [],
        })
      }
      setErrors({})
      setNewFeature("")
      setNewAchievement("")
    }
  }, [isOpen, initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.github && !isValidUrl(formData.github)) {
      newErrors.github = "Please enter a valid URL"
    }

    if (formData.live && !isValidUrl(formData.live)) {
      newErrors.live = "Please enter a valid URL"
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid URL"
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      image: formData.image.trim() || undefined,
      github: formData.github.trim() || undefined,
      live: formData.live.trim() || undefined,
    }

    onSubmit(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }))
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  const toggleTag = (tag: ProjectTags) => {
    setFormData((prev) => {
      const isSelected = prev.tags.includes(tag)
      return {
        ...prev,
        tags: isSelected ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      }
    })
    // Clear tag error if tags are selected
    if (errors.tags) {
      setErrors((prev) => ({ ...prev, tags: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the project information below." : "Add a new project to showcase in your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., E-commerce Platform"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your project..."
                rows={3}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={errors.image ? "border-destructive" : ""}
              />
              {errors.image && <p className="text-sm text-destructive mt-1">{errors.image}</p>}
            </div>

            {/* GitHub URL */}
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                type="url"
                value={formData.github}
                onChange={(e) => handleInputChange("github", e.target.value)}
                placeholder="https://github.com/username/repo"
                className={errors.github ? "border-destructive" : ""}
              />
              {errors.github && <p className="text-sm text-destructive mt-1">{errors.github}</p>}
            </div>

            {/* Live URL */}
            <div>
              <Label htmlFor="live">Live Demo URL</Label>
              <Input
                id="live"
                type="url"
                value={formData.live}
                onChange={(e) => handleInputChange("live", e.target.value)}
                placeholder="https://example.com"
                className={errors.live ? "border-destructive" : ""}
              />
              {errors.live && <p className="text-sm text-destructive mt-1">{errors.live}</p>}
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tags">Tags *</Label>
                <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={tagsOpen}
                      className={cn(
                        "w-full justify-between h-auto min-h-10 py-2",
                        errors.tags ? "border-destructive" : "",
                        !formData.tags.length && "text-muted-foreground",
                      )}
                    >
                      {formData.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mr-2">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} className={getTagBadgeColor(tag)}>
                              {tag.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "Select technologies used..."
                      )}
                      <span className="ml-auto opacity-50">↓</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search technologies..." />
                      <CommandList>
                        <CommandEmpty>No technology found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-[200px]">
                            {Object.values(ProjectTags).map((tag) => {
                              const isSelected = formData.tags.includes(tag)
                              return (
                                <CommandItem
                                  key={tag}
                                  value={tag}
                                  onSelect={() => toggleTag(tag)}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox checked={isSelected} />
                                  <span>{tag.replace(/_/g, " ")}</span>
                                </CommandItem>
                              )
                            })}
                          </ScrollArea>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags}</p>}
            </div>

            {/* Features */}
            <div className="md:col-span-2">
              <Label>Features</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 h-auto">
                    {feature}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="md:col-span-2">
              <Label>Achievements</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Add an achievement..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addAchievement()
                    }
                  }}
                />
                <Button type="button" onClick={addAchievement} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.achievements.map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 h-auto">
                    {achievement}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeAchievement(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
