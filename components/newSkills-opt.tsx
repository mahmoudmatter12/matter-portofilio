"use client"
import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { Code, Database, Server, Smartphone, Palette, Wrench, Globe, Zap } from "lucide-react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Skill } from "@/types/skills"

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

// Format category name
function formatCategoryName(category: SkillCategory): string {
  return category
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

// Loading skeleton for skill card
const SkillCardSkeleton = React.memo(({ index }: { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="group relative p-4 rounded-xl border border-sky-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
        </div>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
    </motion.div>
  )
})

SkillCardSkeleton.displayName = "SkillCardSkeleton"

// Skill card component
const SkillCard = React.memo(({ skill, index }: { skill: Skill; index: number }) => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  })

  const levelInfo = getLevelInfo(skill.level as SkillLevel)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="group relative p-4 rounded-xl border border-sky-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-indigo-300 dark:hover:border-cyan-400 transition-all overflow-hidden"
    >
      {/* Skill content */}
      <div className="relative z-10">
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
            <motion.div
              className={`h-2 rounded-full ${levelInfo.color}`}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${levelInfo.percentage}%` } : { width: 0 }}
              transition={{ delay: 0.1 * index + 0.3, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Years of experience */}
        {skill.yearsOfExperience && (
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? "s" : ""} experience
          </p>
        )}

        {/* Description */}
        {skill.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{skill.description}</p>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
})

SkillCard.displayName = "SkillCard"

// Category section component
const CategorySection = React.memo(
  ({ category, skills, index }: { category: SkillCategory; skills: Skill[]; index: number }) => {
    const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      once: true,
    })

    const categoryColor = getCategoryColor(category)

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.1 * index, duration: 0.6 }}
        className="mb-12"
      >
        {/* Category header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryColor} text-white shadow-lg`}>
            {getCategoryIcon(category)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{formatCategoryName(category)}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{skills.length} skills</p>
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {skills.map((skill, skillIndex) => (
            <SkillCard key={skill.id} skill={skill} index={skillIndex} />
          ))}
        </div>
      </motion.div>
    )
  },
)

CategorySection.displayName = "CategorySection"

interface SkillsOptProps {  // No props needed for this component
  skills?: Skill[] | null
  skillloading: boolean
}
export function SkillsOpt({ skills, skillloading }: SkillsOptProps) {
  
  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped = skills?.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
      },
      {} as Record<SkillCategory, Skill[]>,
    )

    // Sort skills within each category by level (Expert first) and then by name
    if (grouped) {
      Object.keys(grouped).forEach((category) => {
        grouped[category as SkillCategory].sort((a, b) => {
          const levelOrder = { EXPERT: 4, ADVANCED: 3, INTERMEDIATE: 2, BEGINNER: 1 }
          const levelDiff = levelOrder[b.level] - levelOrder[a.level]
          if (levelDiff !== 0) return levelDiff
          return a.name.localeCompare(b.name)
        })
      })
    }

    return grouped
  }, [skills])

  // Memoize the background elements
  const BackgroundElements = useMemo(
    () => (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl animate-float" />
      </div>
    ),
    [],
  )

  // Section intersection observer
  const [sectionRef, isSectionInView] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    once: true,
  })

  return (
    <section id="skills" className="relative py-24 sm:py-32 overflow-hidden" ref={sectionRef}>
      {/* Background elements */}
      {BackgroundElements}

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Skills & Technologies
              </span>
            </h2>
            <div className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Technologies and tools I work with, organized by expertise level and experience
            </p>
          </div>


          {/* Loading state */}
          {skillloading&& (
            <div className="space-y-12">
              {Array.from({ length: 3 }).map((_, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    <div>
                      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 6 }).map((_, skillIndex) => (
                      <SkillCardSkeleton key={skillIndex} index={skillIndex} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!skillloading && skills?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No skills found.</p>
            </div>
          )}

          {/* Skills by category */}
          {!skillloading && (skills?.length ?? 0) > 0 && (
            <div className="space-y-8">
              {Object.entries(skillsByCategory ?? {}).map(([category, categorySkills], index) => (
                <CategorySection
                  key={category}
                  category={category as SkillCategory}
                  skills={categorySkills}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
