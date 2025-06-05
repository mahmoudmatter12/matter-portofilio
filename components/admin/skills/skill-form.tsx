"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

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

interface SkillFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Skill, "id" | "createdAt" | "updatedAt">) => void
  initialData?: Skill | null
  loading?: boolean
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

export function SkillForm({ isOpen, onClose, onSubmit, initialData, loading = false }: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: SkillCategory.OTHER,
    level: SkillLevel.BEGINNER,
    description: "",
    icon: "",
    yearsOfExperience: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          category: initialData.category,
          level: initialData.level,
          description: initialData.description || "",
          icon: initialData.icon || "",
          yearsOfExperience: initialData.yearsOfExperience?.toString() || "",
        })
      } else {
        setFormData({
          name: "",
          category: SkillCategory.OTHER,
          level: SkillLevel.BEGINNER,
          description: "",
          icon: "",
          yearsOfExperience: "",
        })
      }
      setErrors({})
    }
  }, [isOpen, initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (formData.yearsOfExperience && isNaN(Number(formData.yearsOfExperience))) {
      newErrors.yearsOfExperience = "Years of experience must be a number"
    }

    if (formData.yearsOfExperience && Number(formData.yearsOfExperience) < 0) {
      newErrors.yearsOfExperience = "Years of experience cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = {
      name: formData.name.trim(),
      category: formData.category,
      level: formData.level,
      description: formData.description.trim() || undefined,
      icon: formData.icon.trim() || undefined,
      yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Skill" : "Create New Skill"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the skill information below." : "Add a new skill to showcase your expertise."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., React, Node.js, Python"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SkillCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {formatCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level */}
            <div>
              <Label htmlFor="level">Level *</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SkillLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {formatLevelName(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Icon */}
            <div>
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => handleInputChange("icon", e.target.value)}
                placeholder="⚛️, 🐍, 💻"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground mt-1">Optional emoji to represent the skill</p>
            </div>

            {/* Years of Experience */}
            <div>
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                placeholder="e.g., 3"
                className={errors.yearsOfExperience ? "border-destructive" : ""}
              />
              {errors.yearsOfExperience && <p className="text-sm text-destructive mt-1">{errors.yearsOfExperience}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of your experience with this skill..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Skill" : "Create Skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
