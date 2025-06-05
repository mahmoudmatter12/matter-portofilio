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
import { TimelinePost } from "@/types/timelineposts"
import { TimeLinePostType } from "@prisma/client"


interface TimelinePostFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<TimelinePost, "id">) => void
  initialData?: TimelinePost | null
  loading?: boolean
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

export function TimelinePostForm({ isOpen, onClose, onSubmit, initialData, loading = false }: TimelinePostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    institution: "",
    location: "",
    year: "",
    description: "",
    type: "OTHER",
    link: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          institution: initialData.institution || "",
          location: initialData.location || "",
          year: initialData.year,
          description: initialData.description,
          type: initialData.type as string,
          link: initialData.link || "",
        })
      } else {
        setFormData({
          title: "",
          institution: "",
          location: "",
          year: "",
          description: "",
          type: "OTHER",
          link: "",
        })
      }
      setErrors({})
    }
  }, [isOpen, initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.year.trim()) {
      newErrors.year = "Year is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = "Please enter a valid URL"
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
      type: formData.type as TimeLinePostType,
      institution: formData.institution.trim() || undefined,
      location: formData.location.trim() || undefined,
      link: formData.link.trim() || undefined,
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
          <DialogTitle>{initialData ? "Edit Timeline Post" : "Create New Timeline Post"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the timeline post information below."
              : "Add a new timeline post to showcase your experience, education, or achievements."}
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
                placeholder="e.g., Bachelor's in Computer Science"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TimeLinePostType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="e.g., 2020-2024 or 2023"
                className={errors.year ? "border-destructive" : ""}
              />
              {errors.year && <p className="text-sm text-destructive mt-1">{errors.year}</p>}
            </div>

            {/* Institution */}
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                placeholder="e.g., University of Technology"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            {/* Link */}
            <div className="md:col-span-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="https://example.com"
                className={errors.link ? "border-destructive" : ""}
              />
              {errors.link && <p className="text-sm text-destructive mt-1">{errors.link}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your experience, achievements, or what you learned..."
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
