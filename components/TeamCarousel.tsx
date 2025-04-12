"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, Github, Linkedin, Twitter, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DynamicPoster } from "./SafeSVGViewer"

// Team member data structure
type TeamMember = {
  id: number
  name: string
  placHolder: string
  role: string
  image: string
  bio: string
  skills: string[]
  links: {
    portfolio?: string
    github?: string
    linkedin?: string
    twitter?: string
  }
}

// Sample team data
const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Yahia khaild",
    placHolder: "Yahia Khalid",
    role: "Lead Fullstack Developer",
    image: "", // Replace with actual image path
    bio: "Passionate about creating beautiful, responsive interfaces with a focus on accessibility and performance.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    links: {
      portfolio: "https://alexjohnson.dev",
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
    },
  },
  {
    id: 2,
    name: "Mohmed Ibrahim",
    placHolder: "M-Ibrahim",
    role: "Full stack Developer",
    image: "", // Replace with actual image path
    bio: "Creative designer with an eye for detail and a passion for creating intuitive user experiences.",
    skills: ["Figma", "Adobe XD", "UI Design", "User Research"],
    links: {
      portfolio: "https://sarahchen.design",
      github: "https://github.com/sarahchen",
      linkedin: "https://linkedin.com/in/sarahchen",
    },
  },
  {
    id: 3,
    name: "Ahmed Khairy",
    placHolder: "Ahmed Khairy",
    role: "Full stack developer",
    image: "", // Replace with actual image path
    bio: "Experienced in building scalable backend systems and APIs with a focus on performance and security.",
    skills: ["Node.js", "Express", "MongoDB", "GraphQL"],
    links: {
      github: "https://github.com/michaelrodriguez",
      linkedin: "https://linkedin.com/in/michaelrodriguez",
      twitter: "https://twitter.com/michaelrodriguez",
    },
  },
]

export function TeamCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })
  const controls = useAnimation()

  // Start animation when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, isInView])

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, autoplay])

  const handlePrev = () => {
    setDirection("left")
    setActiveIndex((prev) => (prev === 0 ? teamData.length - 1 : prev - 1))
    // Pause autoplay briefly when manually navigating
    setAutoplay(false)
    setTimeout(() => setAutoplay(true), 10000)
  }

  const handleNext = () => {
    setDirection("right")
    setActiveIndex((prev) => (prev === teamData.length - 1 ? 0 : prev + 1))
    // Pause autoplay briefly when manually navigating
    setAutoplay(false)
    setTimeout(() => setAutoplay(true), 10000)
  }

  // Calculate indices for visible cards
  const getPrevIndex = (index: number) => (index === 0 ? teamData.length - 1 : index - 1)
  const getNextIndex = (index: number) => (index === teamData.length - 1 ? 0 : index + 1)

  // Animation variants
  const cardVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === "right" ? 45 : -45,
      zIndex: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      zIndex: 10,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === "right" ? -45 : 45,
      zIndex: 0,
      transition: {
        duration: 0.5,
      },
    }),
    prev: {
      x: -200,
      opacity: 0.7,
      scale: 0.85,
      rotateY: 15,
      zIndex: 5,
      filter: "blur(2px)",
      transition: {
        duration: 0.5,
      },
    },
    next: {
      x: 200,
      opacity: 0.7,
      scale: 0.85,
      rotateY: -15,
      zIndex: 5,
      filter: "blur(2px)",
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="team" ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"
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
          className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl"
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
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-500 dark:bg-cyan-400/10 dark:text-cyan-400 hover:bg-indigo-500/20 dark:hover:bg-cyan-400/20 border-indigo-500/20 dark:border-cyan-400/20">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Collaboration
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Meet My Team
              </span>
            </h2>
            <motion.div
              className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={isInView ? { width: 80, opacity: 1 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Talented professionals I collaborate with to deliver exceptional results
            </p>
          </div>

          {/* 3D Carousel */}
          <div className="relative h-[600px] sm:h-[500px] perspective-1000">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center items-center">
              {/* Previous button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 sm:left-8 z-20 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md"
                onClick={handlePrev}
                aria-label="Previous team member"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Carousel */}
              <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
                {/* Previous card (blurred) */}
                <motion.div
                  key={`prev-${getPrevIndex(activeIndex)}`}
                  custom={direction}
                  variants={cardVariants}
                  initial="prev"
                  animate="prev"
                  className="absolute w-full max-w-md"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TeamMemberCard member={teamData[getPrevIndex(activeIndex)]} />
                </motion.div>

                {/* Active card */}
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute w-full max-w-md"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <TeamMemberCard member={teamData[activeIndex]} isActive />
                  </motion.div>
                </AnimatePresence>

                {/* Next card (blurred) */}
                <motion.div
                  key={`next-${getNextIndex(activeIndex)}`}
                  custom={direction}
                  variants={cardVariants}
                  initial="next"
                  animate="next"
                  className="absolute w-full max-w-md"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TeamMemberCard member={teamData[getNextIndex(activeIndex)]} />
                </motion.div>
              </div>

              {/* Next button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 sm:right-8 z-20 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-md"
                onClick={handleNext}
                aria-label="Next team member"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
              {teamData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeIndex ? "right" : "left")
                    setActiveIndex(index)
                    setAutoplay(false)
                    setTimeout(() => setAutoplay(true), 10000)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === activeIndex
                      ? "w-8 bg-indigo-500 dark:bg-cyan-400"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-indigo-300 dark:hover:bg-cyan-600",
                  )}
                  aria-label={`Go to team member ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Team member card component
function TeamMemberCard({ member, isActive = false }: { member: TeamMember; isActive?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300 h-full",
        isActive ? "shadow-xl" : "",
      )}
    >
      {/* Glowing border effect */}
      <div
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-xl opacity-0 blur-sm transition-opacity duration-300",
          isActive ? "opacity-100" : "",
        )}
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden h-full flex flex-col">
        {/* Image container with overlay */}
        <div className="relative h-48 sm:h-56 overflow-hidden rounded-lg border border-gray-800">
          {/* Conditional rendering */}
          {member.image ? (
            <>
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 384px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60" />
            </>
          ) : (
            <div className="absolute inset-0 -translate-y-8">
              <DynamicPoster
              name={member.placHolder}
              subtitle={member.role}
              className="h-full w-full object-cover"
              width={470} // Match your Image component's max size
              height={460} // Approximately matches h-48 sm:h-56
              />
              <div className="absolute  translate-y-8 inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-70" />
            </div>
          )}


          {/* Name and role overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-cyan-300 font-medium">{member.role}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{member.bio}</p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {member.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-cyan-400 border-indigo-200 dark:border-gray-600"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {member.links.portfolio && (
              <a
                href={member.links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                aria-label={`${member.name}'s portfolio`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {member.links.github && (
              <a
                href={member.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                aria-label={`${member.name}'s GitHub`}
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {member.links.linkedin && (
              <a
                href={member.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                aria-label={`${member.name}'s LinkedIn`}
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {member.links.twitter && (
              <a
                href={member.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                aria-label={`${member.name}'s Twitter`}
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
