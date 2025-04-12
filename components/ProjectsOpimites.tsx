"use client"
import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"
import { MyLink } from "./MyLink"
import Image from "next/image"
import { projects } from "@/lib/constants"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface Project {
  title: string
  description: string
  image?: string
  github: string
  live?: string
  tags: string[]
}

// Optimized ProjectCard component
const ProjectCard = React.memo(({ project, index }: { project: Project; index: number }) => {
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
          loading="lazy" // Add lazy loading
          placeholder="blur" // Add blur placeholder
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=" // Simple SVG placeholder
        />
      </div>

      {/* Project Content - Below the image */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag: string, tagIndex: number) => (
              <span
                key={tagIndex}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100/50 dark:bg-gray-700 text-indigo-700 dark:text-cyan-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-4 mt-auto">
          <MyLink
            href={project.github}
            target="_blank"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400"
          >
            <Github className="h-4 w-4" />
            <span>Code</span>
          </MyLink>
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

export function ProjectsOpt() {
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
          className="max-w-4xl mx-auto"
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

          {/* Projects Grid - Updated layout with virtualization for large lists */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
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
        </motion.div>
      </div>
    </section>
  )
}
