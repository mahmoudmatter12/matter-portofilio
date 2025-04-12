"use client"
import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { GraduationCap, Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"

export function Timeline() {
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

  const timelineItems = [
    {
      title: "Bachelor's in Computer Science",
      institution: "Tech University",
      location: "San Francisco, CA",
      year: "2018 - 2022",
      description:
        "Specialized in Web Development and Human-Computer Interaction. Graduated with honors and completed a thesis on responsive design patterns.",
      icon: <GraduationCap className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />,
      type: "education",
      link: "#",
    },
    {
      title: "Frontend Developer Intern",
      institution: "Digital Solutions Inc.",
      location: "New York, NY",
      year: "Summer 2021",
      description:
        "Developed responsive UIs using React and implemented accessibility features. Worked on a team of 5 developers to deliver a client dashboard application.",
      icon: <Briefcase className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />,
      type: "work",
      link: "#",
    },
    {
      title: "Master's in Software Engineering",
      institution: "Advanced Tech Institute",
      location: "Boston, MA",
      year: "2022 - 2024",
      description:
        "Focus on scalable architecture and cloud computing. Conducted research on serverless architectures and contributed to open-source projects.",
      icon: <GraduationCap className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />,
      type: "education",
      link: "#",
    },
    {
      title: "Full Stack Developer",
      institution: "Innovatech",
      location: "Remote",
      year: "2022 - Present",
      description:
        "Leading development of Next.js applications with TypeScript and GraphQL. Managing a team of developers and implementing CI/CD pipelines for streamlined deployment.",
      icon: <Briefcase className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />,
      type: "work",
      link: "#",
    },
    {
      title: "Senior Developer",
      institution: "TechForward",
      location: "Seattle, WA",
      year: "2005 - Present",
      description:
        "Architecting scalable solutions for enterprise clients. Implementing microservices architecture and mentoring junior developers on best practices.",
      icon: <Briefcase className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />,
      type: "work",
      link: "#",
    },
  ]

  return (
    <section id="timeline" className="relative py-24 sm:py-32 overflow-hidden" ref={containerRef}>
      {/* Animated background elements */}
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

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header with enhanced animation */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-indigo-500/10 text-indigo-500 dark:bg-cyan-400/10 dark:text-cyan-400 hover:bg-indigo-500/20 dark:hover:bg-cyan-400/20 border-indigo-500/20 dark:border-cyan-400/20">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Experience & Education
              </Badge>
            </motion.div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                My Journey
              </span>
            </h2>

            <motion.div
              className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true }}
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

            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                      hoveredIndex === index
                        ? "border-indigo-500 dark:border-cyan-400"
                        : "border-indigo-300 dark:border-cyan-600"
                    } flex items-center justify-center transition-colors duration-300`}
                  >
                    {item.icon}
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
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          item.type === "education"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-cyan-400"
                            : "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
                        }`}
                      >
                        {item.type === "education" ? "Education" : "Work"}
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
                    <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-cyan-400 mb-1">
                      {item.institution}
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {item.location}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>

                    {/* Link */}
                    <div className="mt-4 flex justify-end">
                      <a
                        href={item.link}
                        className="inline-flex items-center text-xs text-indigo-600 dark:text-cyan-400 hover:underline group-hover:translate-x-1 transition-transform"
                      >
                        Learn more
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
