"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Database, Server, Smartphone, Palette, Wrench, Globe, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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

interface SkillPreviewProps {
  isOpen: boolean
  onClose: () => void
  skill: Skill | null
}

// Get category icon
function getCategoryIcon(category: SkillCategory) {
  switch (category) {
    case SkillCategory.FRONTEND:
      return <Globe className="h-6 w-6" />
    case SkillCategory.BACKEND:
      return <Server className="h-6 w-6" />
    case SkillCategory.DATABASE:
      return <Database className="h-6 w-6" />
    case SkillCategory.DEVOPS:
      return <Zap className="h-6 w-6" />
    case SkillCategory.MOBILE:
      return <Smartphone className="h-6 w-6" />
    case SkillCategory.DESIGN:
      return <Palette className="h-6 w-6" />
    case SkillCategory.TOOLS:
      return <Wrench className="h-6 w-6" />
    case SkillCategory.LANGUAGES:
      return <Code className="h-6 w-6" />
    case SkillCategory.FRAMEWORKS:
      return <Code className="h-6 w-6" />
    default:
      return <Code className="h-6 w-6" />
  }
}

// Get category color
function getCategoryColor(category: SkillCategory): string {
  switch (category) {
    case SkillCategory.FRONTEND:
      return "from-blue-500 to-cyan-400"
    case SkillCategory.BACKEND:
      return "from-green-500 to-emerald-400"
    case SkillCategory.DATABASE:
      return "from-purple-500 to-violet-400"
    case SkillCategory.DEVOPS:
      return "from-orange-500 to-amber-400"
    case SkillCategory.MOBILE:
      return "from-pink-500 to-rose-400"
    case SkillCategory.DESIGN:
      return "from-indigo-500 to-purple-400"
    case SkillCategory.TOOLS:
      return "from-gray-500 to-slate-400"
    case SkillCategory.LANGUAGES:
      return "from-red-500 to-pink-400"
    case SkillCategory.FRAMEWORKS:
      return "from-teal-500 to-cyan-400"
    default:
      return "from-gray-500 to-slate-400"
  }
}

// Get level color and percentage
function getLevelInfo(level: SkillLevel): { color: string; percentage: number; label: string } {
  switch (level) {
    case SkillLevel.BEGINNER:
      return { color: "bg-red-500", percentage: 25, label: "Beginner" }
    case SkillLevel.INTERMEDIATE:
      return { color: "bg-yellow-500", percentage: 50, label: "Intermediate" }
    case SkillLevel.ADVANCED:
      return { color: "bg-blue-500", percentage: 75, label: "Advanced" }
    case SkillLevel.EXPERT:
      return { color: "bg-green-500", percentage: 100, label: "Expert" }
    default:
      return { color: "bg-gray-500", percentage: 0, label: "Unknown" }
  }
}

function formatCategoryName(category: SkillCategory): string {
  return category
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

export function SkillPreview({ isOpen, onClose, skill }: SkillPreviewProps) {
  if (!skill) return null

  const levelInfo = getLevelInfo(skill.level)
  const categoryColor = getCategoryColor(skill.category)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Skill Preview</DialogTitle>
          <DialogDescription>This is how your skill will appear on the frontend.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Header */}
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryColor} text-white shadow-lg`}>
              {getCategoryIcon(skill.category)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{formatCategoryName(skill.category)}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
            </div>
          </div>

          {/* Skill Card Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {/* Skill icon or default */}
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-cyan-400">
                  {skill.icon ? <span className="text-lg">{skill.icon}</span> : <Code className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{skill.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{levelInfo.label}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${levelInfo.color}`}
                    style={{ width: `${levelInfo.percentage}%` }}
                  />
                </div>
              </div>

              {/* Years of experience */}
              {skill.yearsOfExperience && (
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                  {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? "s" : ""} experience
                </p>
              )}

              {/* Description */}
              {skill.description && <p className="text-xs text-gray-500 dark:text-gray-400">{skill.description}</p>}
            </CardContent>
          </Card>

          {/* Skill Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Level</h4>
              <Badge className={`${levelInfo.color} text-white`}>{levelInfo.label}</Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Experience</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {skill.yearsOfExperience ? `${skill.yearsOfExperience} years` : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
