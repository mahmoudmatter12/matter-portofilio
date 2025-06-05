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
import { Loader2, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

enum CertificationStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
  REVOKED = "REVOKED",
}

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  credentialId?: string
  credentialUrl?: string
  description?: string
  skills: string[]
  status: CertificationStatus
  createdAt: Date
  updatedAt: Date
}

interface CertificationFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Certification, "id" | "createdAt" | "updatedAt">) => void
  initialData?: Certification | null
  loading?: boolean
}

function formatStatusName(status: CertificationStatus): string {
  return status.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

export function CertificationForm({ isOpen, onClose, onSubmit, initialData, loading = false }: CertificationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
    skills: [] as string[],
    status: CertificationStatus.ACTIVE,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newSkill, setNewSkill] = useState("")

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          issuer: initialData.issuer,
          issueDate: new Date(initialData.issueDate).toISOString().split("T")[0],
          expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split("T")[0] : "",
          credentialId: initialData.credentialId || "",
          credentialUrl: initialData.credentialUrl || "",
          description: initialData.description || "",
          skills: [...initialData.skills],
          status: initialData.status,
        })
      } else {
        setFormData({
          name: "",
          issuer: "",
          issueDate: "",
          expiryDate: "",
          credentialId: "",
          credentialUrl: "",
          description: "",
          skills: [],
          status: CertificationStatus.ACTIVE,
        })
      }
      setErrors({})
      setNewSkill("")
    }
  }, [isOpen, initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.issuer.trim()) {
      newErrors.issuer = "Issuer is required"
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Issue date is required"
    }

    if (formData.expiryDate && formData.issueDate && new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      newErrors.expiryDate = "Expiry date must be after issue date"
    }

    if (formData.credentialUrl && !isValidUrl(formData.credentialUrl)) {
      newErrors.credentialUrl = "Please enter a valid URL"
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
      name: formData.name.trim(),
      issuer: formData.issuer.trim(),
      issueDate: new Date(formData.issueDate),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      credentialId: formData.credentialId.trim() || undefined,
      credentialUrl: formData.credentialUrl.trim() || undefined,
      description: formData.description.trim() || undefined,
      skills: formData.skills,
      status: formData.status,
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

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Certification" : "Create New Certification"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the certification information below."
              : "Add a new certification to showcase your credentials."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Certification Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., AWS Certified Solutions Architect"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            {/* Issuer */}
            <div>
              <Label htmlFor="issuer">Issuer *</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => handleInputChange("issuer", e.target.value)}
                placeholder="e.g., Amazon Web Services"
                className={errors.issuer ? "border-destructive" : ""}
              />
              {errors.issuer && <p className="text-sm text-destructive mt-1">{errors.issuer}</p>}
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CertificationStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatStatusName(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issue Date */}
            <div>
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange("issueDate", e.target.value)}
                className={errors.issueDate ? "border-destructive" : ""}
              />
              {errors.issueDate && <p className="text-sm text-destructive mt-1">{errors.issueDate}</p>}
            </div>

            {/* Expiry Date */}
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                className={errors.expiryDate ? "border-destructive" : ""}
              />
              {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>}
              <p className="text-xs text-muted-foreground mt-1">Leave empty if certification doesnt expire</p>
            </div>

            {/* Credential ID */}
            <div>
              <Label htmlFor="credentialId">Credential ID</Label>
              <Input
                id="credentialId"
                value={formData.credentialId}
                onChange={(e) => handleInputChange("credentialId", e.target.value)}
                placeholder="e.g., AWS-ASA-12345"
              />
            </div>

            {/* Credential URL */}
            <div>
              <Label htmlFor="credentialUrl">Verification URL</Label>
              <Input
                id="credentialUrl"
                type="url"
                value={formData.credentialUrl}
                onChange={(e) => handleInputChange("credentialUrl", e.target.value)}
                placeholder="https://verify.example.com/credential"
                className={errors.credentialUrl ? "border-destructive" : ""}
              />
              {errors.credentialUrl && <p className="text-sm text-destructive mt-1">{errors.credentialUrl}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the certification and what it validates..."
                rows={3}
              />
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <Label>Related Skills</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a related skill..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 h-auto">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeSkill(index)}
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
              {initialData ? "Update Certification" : "Create Certification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
