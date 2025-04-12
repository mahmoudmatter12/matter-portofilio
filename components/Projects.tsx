"use client"
import React from "react"
import { motion } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"
import { MyLink } from "./MyLink"
// import Image from "next/image"
import { projects } from "@/lib/constants"

export function Projects() {
  
  return (
    <section id="projects" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl animate-float" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="group relative overflow-hidden rounded-xl border border-sky-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-indigo-300 dark:hover:border-cyan-400 transition-all"
              >
                {/* Project Image */}
                {/* <div className="h-48 overflow-hidden">
                  <Image 
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div> */}

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100/50 dark:bg-gray-700 text-indigo-700 dark:text-cyan-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
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
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mt-12"
          >
            <MyLink
              href="https://github.com/yourusername?tab=repositories"
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