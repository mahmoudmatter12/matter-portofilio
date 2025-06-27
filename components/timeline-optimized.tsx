"use client"
import { useState, useRef, useMemo } from "react"
import React from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import {
  GraduationCap,
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  Heart,
  Trophy,
  BookOpen,
  Users,
  Star,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { TimeLinePostType } from "@prisma/client"
import { TimelinePost } from "@/types/timelineposts"




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
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-cyan-400"
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

// Memoized TimelineItem component
const TimelineItem = React.memo(function TimelineItem({
  item,
  index,
  isMobile,
  hoveredIndex,
  setHoveredIndex,
}: {
  item: TimelinePost
  index: number
  isMobile: boolean
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}) {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className={`relative mb-12 flex ${
        isMobile ? "flex-col" : index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } items-center`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Timeline dot with pulse effect on hover */}
      <div className="relative flex items-center justify-center z-10">
        <div
          className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-4 ${
            hoveredIndex === index ? "border-indigo-500 dark:border-cyan-400" : "border-indigo-300 dark:border-cyan-600"
          } flex items-center justify-center transition-colors duration-300`}
        >
          {getIcon(item.type)}
        </div>
        {hoveredIndex === index && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-indigo-500/50 dark:border-cyan-400/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </div>

      {/* Card with enhanced hover effects */}
      <div
        className={`w-full ${isMobile ? "mt-4" : "md:w-5/12"} ${
          !isMobile && index % 2 === 0 ? "md:ml-8" : !isMobile ? "md:mr-8" : ""
        }`}
      >
        <motion.div
          className="relative p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-sky-100 dark:border-gray-700 shadow-sm overflow-hidden group"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Type badge and year */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(item.type)}`}>
              {getTypeLabel(item.type)}
            </span>
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {item.year}
            </span>
          </div>

          {/* Title and institution */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
            {item.title}
          </h3>
          {item.institution && (
            <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-cyan-400 mb-1">
              {item.institution}
            </div>
          )}

          {/* Location */}
          {item.location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {item.location}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>

          {/* Link */}
          {item.link && (
            <div className="mt-4 flex justify-end">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-indigo-600 dark:text-cyan-400 hover:underline group-hover:translate-x-1 transition-transform"
              >
                Learn more
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
})

// Loading skeleton component
const TimelineItemSkeleton = React.memo(function TimelineItemSkeleton({
  index,
  isMobile,
}: {
  index: number
  isMobile: boolean
}) {
  return (
    <div
      className={`relative mb-12 flex ${
        isMobile ? "flex-col" : index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } items-center`}
    >
      {/* Timeline dot skeleton */}
      <div className="relative flex items-center justify-center z-10">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      {/* Card skeleton */}
      <div
        className={`w-full ${isMobile ? "mt-4" : "md:w-5/12"} ${
          !isMobile && index % 2 === 0 ? "md:ml-8" : !isMobile ? "md:mr-8" : ""
        }`}
      >
        <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-sky-100 dark:border-gray-700 shadow-sm">
          <div className="flex gap-2 mb-2">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
})

interface TimelineOPTProps {
  timelineItems?: TimelinePost[]
  timelineLoading?: boolean
}

export function TimelineOPT({ timelineItems, timelineLoading }: TimelineOPTProps) {
  const isMobile = useMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Transform the line height based on scroll progress
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  // State to track which item is being hovered
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // State for timeline data

  // Section intersection observer
  const [sectionRef, isSectionInView] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    once: true,
  })


  // Memoize background elements
  const BackgroundElements = useMemo(
    () => (
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{
            y: [0, 30, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
    ),
    [],
  )

  return (
    <section
      id="qualification"
      className="relative py-24 sm:py-32 overflow-hidden"
      ref={(el) => {
        // Combine refs
        if (el) {
          if (containerRef.current !== el) containerRef.current = el as HTMLDivElement
          if (sectionRef.current !== el) sectionRef.current = el
        }
      }}
    >
      {/* Animated background elements */}
      {BackgroundElements}

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header with enhanced animation */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-indigo-500/10 text-indigo-500 dark:bg-cyan-400/10 dark:text-cyan-400 hover:bg-indigo-500/20 dark:hover:bg-cyan-400/20 border-indigo-500/20 dark:border-cyan-400/20">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Experience & Education
              </Badge>
            </motion.div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Qualification
              </span>
            </h2>

            <motion.div
              className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={isSectionInView ? { width: 80, opacity: 1 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Education and professional milestones through the years
            </p>
          </div>

          {/* Timeline with enhanced animations and interactions */}
          <div className="relative">
            {/* Animated vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
              <motion.div
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-indigo-500 via-cyan-400 to-indigo-500 dark:from-indigo-500/70 dark:via-cyan-400/70 dark:to-indigo-500/70"
                style={{ height: lineHeight }}
              />
            </div>


            {/* Loading state */}
            {timelineLoading && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TimelineItemSkeleton key={index} index={index} isMobile={isMobile} />
                ))}
              </>
            )}

            {/* Timeline items */}
            {!timelineLoading && timelineItems?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No timeline items found.</p>
              </div>
            )}

            {!timelineLoading &&
              timelineItems?.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  index={index}
                  isMobile={isMobile}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                />
              ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
