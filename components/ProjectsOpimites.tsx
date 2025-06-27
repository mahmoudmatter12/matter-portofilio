"use client"
import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { Github, ExternalLink, CheckCircle, Award } from "lucide-react"
import { MyLink } from "./MyLink"
import Image from "next/image"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Project } from "@/types/projects"

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



// Loading skeleton component
const ProjectCardSkeleton = React.memo(({ index }: { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="group flex flex-col rounded-xl border border-sky-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Image skeleton */}
      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />

          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            ))}
          </div>

          {/* Features skeleton */}
          <div className="mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-24" />
            <div className="space-y-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Links skeleton */}
        <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
})

ProjectCardSkeleton.displayName = "ProjectCardSkeleton"

// Optimized ProjectCard component
const ProjectCard = React.memo(({ project, index }: { project: Project; index: number }) => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  })

  // Format tags for display
  const formatTag = (tag: ProjectTags) => {
    return tag.replace(/_/g, " ")
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="group flex flex-col rounded-xl border border-sky-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-indigo-300 dark:hover:border-cyan-400 transition-all overflow-hidden"
    >
      {/* Project Image - Now at the top */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={project.image || "/placeholder-project.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
        />
      </div>

      {/* Project Content - Below the image */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, tagIndex: number) => (
              <span
                key={tagIndex}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100/50 dark:bg-gray-700 text-indigo-700 dark:text-cyan-400"
              >
                {formatTag(tag as ProjectTags)}
              </span>
            ))}
          </div>

          {/* Features - New section */}
          {project.features && project.features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-cyan-400" />
                Key Features
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {project.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-indigo-500 dark:text-cyan-400 mr-1.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {project.features.length > 3 && (
                  <li className="text-xs text-indigo-500 dark:text-cyan-400 italic">
                    +{project.features.length - 3} more features
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Achievements - New section */}
          {project.achievements && project.achievements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                <Award className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-cyan-400" />
                Achievements
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {project.achievements.slice(0, 2).map((achievement, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-indigo-500 dark:text-cyan-400 mr-1.5">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
                {project.achievements.length > 2 && (
                  <li className="text-xs text-indigo-500 dark:text-cyan-400 italic">
                    +{project.achievements.length - 2} more achievements
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          {project.github && (
            <MyLink
              href={project.github}
              target="_blank"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400"
            >
              <Github className="h-4 w-4" />
              <span>Code</span>
            </MyLink>
          )}
          {project.live && (
            <MyLink
              href={project.live}
              target="_blank"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </MyLink>
          )}
        </div>
      </div>
    </motion.div>
  )
})

ProjectCard.displayName = "ProjectCard"

interface ProjectsOptProps {
  projects: Project[]
  loading: boolean
}

export function ProjectsOpt({ projects, loading}: ProjectsOptProps) {

  // Memoize the background elements to prevent unnecessary re-renders
  const BackgroundElements = useMemo(
    () => (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl animate-float" />
      </div>
    ),
    [],
  )

  // Use a single intersection observer for the section
  const [sectionRef, isSectionInView] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    once: true,
  })

  return (
    <section id="projects" className="relative py-24 sm:py-32 overflow-hidden" ref={sectionRef}>
      {/* Background elements */}
      {BackgroundElements}

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto" // Increased max-width to accommodate larger cards
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <div className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Some of my recent work with code and live demos
            </p>
          </div>

          {/* Error state
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 dark:text-red-400 font-medium">Failed to load projects</p>
                <p className="text-red-500 dark:text-red-300 text-sm mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )} */}

          {/* Loading state */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProjectCardSkeleton key={index} index={index} />
              ))}
            </div>
          )}

          {/* Projects Grid - Updated layout with fewer columns for larger cards */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
            </div>
          )}

          {!loading  && projects.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>

              {/* View All Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isSectionInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mt-12"
              >
                <MyLink
                  href="https://github.com/mahmoudmatter12?tab=repositories"
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 rounded-full border-2 border-indigo-500 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-gray-800/50 transition-all"
                >
                  <Github className="h-5 w-5 mr-2" />
                  View All on GitHub
                </MyLink>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
