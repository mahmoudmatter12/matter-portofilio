"use client"

import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  Trophy,
  BookOpen,
  Star,
  Calendar,
  MapPin,
  ExternalLink,
  Building,
} from "lucide-react"
import { TimelinePost } from "@/types/timelineposts"
import { TimeLinePostType } from "@prisma/client"




interface TimelinePostPreviewProps {
  isOpen: boolean
  onClose: () => void
  post: TimelinePost | null
}

function getIcon(type: TimeLinePostType): React.ReactNode {
  switch (type) {
    case TimeLinePostType.EDUCATION:
      return <GraduationCap className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />
    case TimeLinePostType.WORK:
      return <Briefcase className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />
    case TimeLinePostType.VOLUNTEERING:
      return <Heart className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />
    case TimeLinePostType.PARTICIPATION:
      return <Users className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />
    case TimeLinePostType.AWARD:
      return <Trophy className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />
    case TimeLinePostType.PUBLICATION:
      return <BookOpen className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />
    default:
      return <Star className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />
  }
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

function getTypeBadgeColor(type: TimeLinePostType): string {
  switch (type) {
    case TimeLinePostType.EDUCATION:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
    case TimeLinePostType.WORK:
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
    case TimeLinePostType.VOLUNTEERING:
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
    case TimeLinePostType.PARTICIPATION:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case TimeLinePostType.AWARD:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case TimeLinePostType.PUBLICATION:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export function TimelinePostPreview({ isOpen, onClose, post }: TimelinePostPreviewProps) {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Timeline Post Preview</DialogTitle>
          <DialogDescription>This is how your timeline post will appear on the frontend.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Card */}
          <div className="relative p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-sky-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-400/5" />

            {/* Type badge and year */}
            <div className="relative flex flex-wrap items-center gap-2 mb-2">
              <Badge className={getTypeBadgeColor(post.type)}>{getTypeLabel(post.type)}</Badge>
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {post.year}
              </span>
            </div>

            {/* Title and institution */}
            <h3 className="relative text-lg font-semibold text-gray-900 dark:text-white mb-1">{post.title}</h3>
            {post.institution && (
              <div className="relative flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-cyan-400 mb-1">
                <Building className="h-3.5 w-3.5" />
                {post.institution}
              </div>
            )}

            {/* Location */}
            {post.location && (
              <div className="relative flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {post.location}
              </div>
            )}

            {/* Description */}
            <p className="relative text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{post.description}</p>

            {/* Link */}
            {post.link && (
              <div className="relative mt-4 flex justify-end">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-indigo-600 dark:text-cyan-400 hover:underline transition-transform hover:translate-x-1"
                >
                  Learn more
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Timeline Icon Preview */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-4 border-indigo-300 dark:border-cyan-600 flex items-center justify-center">
              {getIcon(post.type)}
            </div>
            <div>
              <p className="text-sm font-medium">Timeline Icon</p>
              <p className="text-xs text-muted-foreground">This icon will appear on the timeline</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
