"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Calendar, CheckCircle, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

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

interface ProjectPreviewProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
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

export function ProjectPreview({ isOpen, onClose, project }: ProjectPreviewProps) {
  if (!project) return null

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Preview</DialogTitle>
          <DialogDescription>This is how your project will appear on the frontend.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Image */}
          {project.image && (
            <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-lg">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Handle image load error
                  e.currentTarget.src = "/placeholder.svg?height=300&width=600"
                }}
              />
            </div>
          )}

          {/* Project Header */}
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Updated {formatDate(project.updatedAt)}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} className={getTagBadgeColor(tag)}>
                {tag.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{project.description}</p>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.github && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub Repository
                </a>
              </Button>
            )}
            {project.live && (
              <Button size="sm" asChild>
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>

          <Separator />

          {/* Features and Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Features */}
            {project.features.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    Features
                  </h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {project.achievements.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Achievements
                  </h3>
                  <ul className="space-y-2">
                    {project.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-yellow-500">•</span>
                        <span className="text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
