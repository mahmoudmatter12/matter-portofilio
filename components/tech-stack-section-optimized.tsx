"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Code, Award, Sparkles, ChevronRight, Plus, Server, Monitor, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { memoryCache } from "@/lib/cache-utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { SiTypescript, SiExpress } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { FaPython } from "react-icons/fa6";
import { FaJava, FaReact, FaHtml5, FaDocker, FaGithub } from "react-icons/fa";
import { RiNextjsFill, RiNodejsLine, RiTailwindCssFill, RiFirebaseFill, RiSupabaseLine } from "react-icons/ri";
import { DiMongodb, DiPostgresql } from "react-icons/di";
import { VscVscode, VscAzureDevops } from "react-icons/vsc";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { FaGolang } from "react-icons/fa6";
import { PiFileCSharp } from "react-icons/pi";
import { PiFileCppBold } from "react-icons/pi";
import { FaCss3 } from "react-icons/fa";
import { FaBootstrap } from "react-icons/fa";
import { SiPostman } from "react-icons/si";


// Enhanced skill data with more metadata
const skillsData = [
    // Languages
    {
      name: "TypeScript",
      icon: <SiTypescript className="w-5 h-5" />,
      category: "lang",
      level: 80,
      color: "from-blue-600 to-blue-700", // TypeScript blue
      description: "Static typing for JavaScript",
      years: 1.5,
    },
    {
      name: "JavaScript",
      icon: <IoLogoJavascript className="w-5 h-5" />,
      category: "lang",
      level: 80,
      color: "from-yellow-300 to-yellow-500", // JS yellow
      description: "Web's primary language",
      years: 2,
    },
    {
      name: "Python",
      icon: <FaPython className="w-5 h-5" />,
      category: "lang",
      level: 70,
      color: "from-yellow-400 to-blue-500", // Python dual-tone
      description: "Data science & automation",
      years: 4,
    },
    {
      name: "Java",
      icon: <FaJava className="w-5 h-5" />,
      category: "lang",
      level: 75,
      color: "from-orange-600 to-red-500", // Java red-orange tone
      description: "Enterprise applications",
      years: 2,
    },
    {
      name: "GoLang",
      icon: <FaGolang className="w-5 h-5" />,
      category: "lang",
      level: 70,
      color: "from-teal-400 to-teal-600", // Go cyan-ish teal
      description: "Efficient and scalable programming for backend systems",
      years: 1,
    },
    {
      name: "C#",
      icon: <PiFileCSharp className="w-5 h-5" />,
      category: "lang",
      level: 70,
      color: "from-purple-700 to-purple-900", // C# / .NET purple
      description: "",
      years: 1,
    },
    {
      name: "C",
      icon: <Code className="w-5 h-5" />,
      category: "lang",
      level: 60,
      color: "from-gray-600 to-gray-700",
      description: "Low-level programming language",
      years: 3,
    },
    {
      name: "C++",
      icon: <PiFileCppBold className="w-5 h-5" />,
      category: "lang",
      level: 65,
      color: "from-blue-700 to-blue-800", // C++ deep blue
      description: "Object-oriented programming",
      years: 2,
    },
  
    // Frontend
    {
      name: "React",
      icon: <FaReact className="w-5 h-5" />,
      category: "frontend",
      level: 80,
      color: "from-cyan-400 to-blue-600", // React neon blue
      description: "UI component library",
      years: 2,
    },
    {
      name: "Next.js",
      icon: <RiNextjsFill className="w-5 h-5" />,
      category: "frontend",
      level: 80,
      color: "from-gray-900 to-black", // Next.js black/gray
      description: "React framework",
      years: 2,
    },
    {
      name: "Tailwind",
      icon: <RiTailwindCssFill className="w-5 h-5" />,
      category: "frontend",
      level: 80,
      color: "from-teal-400 to-teal-600", // Tailwind teal
      description: "Utility-first CSS",
      years: 2,
    },
    {
      name: "HTML5",
      icon: <FaHtml5 className="w-5 h-5" />,
      category: "frontend",
      level: 90,
      color: "from-orange-500 to-red-500", // HTML5 orange
      description: "Markup language for web pages",
      years: 3,
    },
    {
      name: "CSS",
      icon: <FaCss3 className="w-5 h-5" />,
      category: "frontend",
      level: 90,
      color: "from-blue-500 to-blue-700", // CSS3 blue
      description: "Styling",
      years: 3,
    },
    {
      name: "Bootstrap",
      icon: <FaBootstrap className="w-5 h-5" />,
      category: "frontend",
      level: 90,
      color: "from-purple-600 to-purple-800", // Bootstrap purple
      description: "Utility-classes for CSS",
      years: 2,
    },
  
    // Backend
    {
      name: "Node.js",
      icon: <RiNodejsLine className="w-5 h-5" />,
      category: "backend",
      level: 80,
      color: "from-green-500 to-green-700", // Node.js green
      description: "JavaScript runtime",
      years: 2,
    },
    {
      name: "Express",
      icon: <SiExpress className="w-5 h-5" />,
      category: "backend",
      level: 85,
      color: "from-gray-700 to-black", // Express gray/black
      description: "Web framework for Node.js",
      years: 2,
    },
    {
      name: "REST API",
      icon: <Server className="w-5 h-5" />,
      category: "backend",
      level: 90,
      color: "from-indigo-500 to-indigo-700",
      description: "RESTful architecture",
      years: 2,
    },
  
    // Databases
    {
      name: "MongoDB",
      icon: <DiMongodb className="w-5 h-5" />,
      category: "db",
      level: 60,
      color: "from-green-700 to-green-800", // MongoDB dark green
      description: "NoSQL database",
      years: 1,
    },
    {
      name: "PostgreSQL",
      icon: <DiPostgresql className="w-5 h-5" />,
      category: "db",
      level: 80,
      color: "from-blue-700 to-indigo-700", // PostgreSQL blue
      description: "Relational database",
      years: 2,
    },
    {
      name: "Firebase",
      icon: <RiFirebaseFill className="w-5 h-5" />,
      category: "db",
      level: 90,
      color: "from-yellow-400 to-orange-500", // Firebase yellow-orange
      description: "Backend-as-a-service",
      years: 4,
    },
    {
      name: "Supabase",
      icon: <RiSupabaseLine className="w-5 h-5" />,
      category: "db",
      level: 50,
      color: "from-emerald-500 to-emerald-700", // Supabase green
      description: "Open-source Firebase alternative",
      years: 0.5,
    },
  
    // DevOps
    {
      name: "Docker",
      icon: <FaDocker className="w-5 h-5" />,
      category: "devops",
      level: 40,
      color: "from-sky-400 to-sky-600", // Docker blue
      description: "Containerization",
      years: 0.5,
    },
    {
      name: "Git",
      icon: <FaGithub className="w-5 h-5" />,
      category: "devops",
      level: 95,
      color: "from-gray-800 to-black", // GitHub black
      description: "Version control",
      years: 4,
    },
    {
      name: "VS Code",
      icon: <VscVscode className="w-5 h-5" />,
      category: "devops",
      level: 90,
      color: "from-blue-500 to-indigo-600", // VS Code blue
      description: "Code editor",
      years: 6,
    },
    {
      name: "Post Man",
      icon: <SiPostman className="w-5 h-5" />,
      category: "devops",
      level: 80,
      color: "from-orange-500 to-orange-600", // Postman orange
      description: "For testing the APIs",
      years: 1,
    },
  ]
  
  const certifications = [
    {
      title: "AWS Certified",
      issuer: "Amazon Web Services",
      year: "2022",
      icon: <AiFillSafetyCertificate className="w-5 h-5 text-sky-400" />,
      img: "",
      color: "from-orange-500 to-yellow-500",
    },
    {
      title: "Google Cloud",
      issuer: "Google Cloud",
      year: "2023",
      icon: <AiFillSafetyCertificate className="w-5 h-5 text-sky-400" />,
      img: "",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Microsoft Certified",
      issuer: "Microsoft",
      year: "2023",
      icon: <AiFillSafetyCertificate className="w-5 h-5 text-sky-400" />,
      img: "",
      color: "from-purple-500 to-pink-500",
    },
  ]
  
  
  const categoryInfo = {
    lang: {
      name: "Languages",
      icon: <Code className="w-5 h-5 text-sky-400" />,
      description: "Programming languages I'm proficient in",
    },
    frontend: {
      name: "Frontend",
      icon: <Monitor className="w-5 h-5 text-sky-400" />,
      description: "Technologies for building beautiful user interfaces",
    },
    backend: {
      name: "Backend",
      icon: <Server className="w-5 h-5 text-sky-400" />,
      description: "Server-side technologies and APIs",
    },
    db: {
      name: "Databases",
      icon: <Database className="w-5 h-5 text-sky-400" />,
      description: "Data storage and management solutions",
    },
    devops: {
      name: "DevOps",
      icon: <VscAzureDevops className="w-5 h-5 text-sky-400" />,
      description: "Tools for development operations and deployment",
    },
  }
  
  const categoryArr = [
    {
      name: "All",
      value: "all"
    },
    {
      name: "Languages",
      value: "lang"
    },
    {
      name: "Frontend",
      value: "frontend"
    },
    {
      name: "Backend",
      value: "backend"
    },
    {
      name: "Databases",
      value: "db"
    },
    {
      name: "DevOps",
      value: "devops"
    }
  ]
  

// Memoized Hexagon skill component
const SelectedSkill = React.memo(function SelectedSkill({
  skill,
  index,
  onClick,
  isSelected,
}: {
  skill: (typeof skillsData)[0]
  index: number
  onClick: () => void
  isSelected: boolean
}) {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  })

  // Hexagon clip path
  const clipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.5), // Cap the delay to avoid long waits
        type: "spring",
        stiffness: 100,
      }}
      onClick={onClick}
      className={cn("cursor-pointer group relative", isSelected ? "z-10" : "z-0")}
    >
      <div className="relative w-full pb-[115%]">
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300 backdrop-blur-sm border border-white/10 overflow-hidden",
            isSelected ? "scale-110 shadow-lg shadow-sky-500/20" : "hover:scale-105",
          )}
          style={{ clipPath }}
        >
          {/* Background gradient */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-80 transition-opacity",
              skill.color,
            )}
            style={{ clipPath }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm mb-2">{skill.icon}</div>
            <span className="font-medium text-white text-sm">{skill.name}</span>
            <div className="mt-1 w-12 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                transition={{ duration: 1, delay: 0.5 + Math.min(index * 0.05, 0.5) }}
              />
            </div>
          </div>

          {/* Background color */}
          <div className="absolute inset-0 bg-gray-900/80 -z-10" />
        </div>
      </div>
    </motion.div>
  )
})

// Memoized Skill detail card component
const SkillDetailCard = React.memo(function SkillDetailCard({ skill }: { skill: (typeof skillsData)[0] | null }) {
  if (!skill) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${skill.color}`}>{skill.icon}</div>
        <div>
          <h3 className="text-xl font-bold text-white">{skill.name}</h3>
          <p className="text-sky-400 text-sm">{skill.description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Proficiency</span>
            <span className="text-sm font-medium text-white">{skill.level}%</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${skill.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Experience</span>
            <span className="text-sm font-medium text-white">{skill.years} years</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${skill.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${(skill.years / 6) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="sm" className="text-sky-400 border-sky-400/20 hover:bg-sky-400/10">
          <span className="mr-1">Learn more</span>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  )
})

// Memoized Certification card component
const CertificationCard = React.memo(function CertificationCard({
  cert,
  index,
}: { cert: (typeof certifications)[0]; index: number }) {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: Math.min(index * 0.1, 0.5) }}
      whileHover={{ y: -5 }}
      className="group flex flex-col h-full"
    >
      {/* Glowing border container */}
      <div className="relative rounded-2xl overflow-hidden flex-1 flex flex-col">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-2xl opacity-30 blur-sm group-hover:opacity-100 group-hover:blur-md transition duration-500" />

        {/* Main card content */}
        <div className="relative flex-1 flex flex-col rounded-2xl bg-gray-900 overflow-hidden">
          {/* Certificate image - Full width at top */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={cert.img || "/placeholder-certificate.svg"}
              alt={cert.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
            <Badge
              variant="outline"
              className="absolute top-3 right-3 text-xs bg-gray-900/70 border-gray-700 text-gray-300"
            >
              {cert.year}
            </Badge>
          </div>

          {/* Certificate content - Below image */}
          <div className="flex-1 flex flex-col p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${cert.color} flex-shrink-0`}>{cert.icon}</div>
              <div>
                <h4 className="text-lg font-bold text-white">{cert.title}</h4>
                <p className="text-sm text-sky-400">{cert.issuer}</p>
              </div>
            </div>

            {/* Link at bottom */}
            <div className="mt-auto pt-3">
              <div className="flex items-center text-sm text-sky-400 hover:underline cursor-pointer group-hover:translate-x-1 transition-transform">
                <span>View credential</span>
                <ChevronRight className="w-3 h-3 ml-1 group-hover:ml-2 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

// Cache key for filtered skills
const getFilteredSkillsCacheKey = (activeTab: string) => `filteredSkills:${activeTab}`

// Update the TechStackSection component to include the show more functionality
export function TechStackSectionOpt() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSkill, setSelectedSkill] = useState<(typeof skillsData)[0] | null>(null)
  const [visibleSkills, setVisibleSkills] = useState(6)
  const isMobile = useMobile()
  const [sectionRef, isSectionInView] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    once: true,
  })

  // Memoized filtered skills with caching
  const filteredSkills = useMemo(() => {
    const cacheKey = getFilteredSkillsCacheKey(activeTab)
    const cached = memoryCache.get<typeof skillsData>(cacheKey)

    if (cached) {
      return cached
    }

    const filtered = skillsData.filter((skill) => {
      return activeTab === "all" || skill.category === activeTab
    })

    memoryCache.set(cacheKey, filtered, 60 * 60 * 1000) // Cache for 1 hour
    return filtered
  }, [activeTab])

  // Determine how many skills to show
  const displayedSkills = useMemo(() => {
    return isMobile ? filteredSkills.slice(0, visibleSkills) : filteredSkills
  }, [filteredSkills, isMobile, visibleSkills])

  // Reset selected skill when changing tabs
  useEffect(() => {
    setSelectedSkill(null)
    setVisibleSkills(6) // Reset visible skills when changing tabs
  }, [activeTab])

  // Handle showing more skills
  const handleShowMore = useCallback(() => {
    setVisibleSkills((prev) => Math.min(prev + 6, filteredSkills.length))
  }, [filteredSkills.length])

  // Memoize background elements
  const BackgroundElements = useMemo(
    () => (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl opacity-20" />
      </div>
    ),
    [],
  )

  return (
    <section id="skills" ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Animated background */}
      {BackgroundElements}

      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border-sky-400/20">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
            Technical Expertise
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-400 mb-4">
            My Tech Stack
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Tools and technologies I use to build amazing digital experiences
          </p>
        </motion.div>

        {/* Skills Section - Hexagon Grid */}
        <div className="mb-24">
          <div className="flex justify-center mb-8">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-900/50 border border-gray-800 p-1">
                {categoryArr.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="text-xs data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Category description */}
          <AnimatePresence mode="wait">
            {activeTab !== "all" && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-8 p-4 rounded-lg bg-gray-900/50 border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    {categoryInfo[activeTab as keyof typeof categoryInfo].icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {categoryInfo[activeTab as keyof typeof categoryInfo].name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {categoryInfo[activeTab as keyof typeof categoryInfo].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            {/* Hexagon grid using only Tailwind */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <AnimatePresence>
                {displayedSkills.map((skill, index) => (
                  <SelectedSkill
                    key={skill.name}
                    skill={skill}
                    index={index}
                    onClick={() => setSelectedSkill(selectedSkill?.name === skill.name ? null : skill)}
                    isSelected={selectedSkill?.name === skill.name}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Show More Button - Only on mobile when there are more skills to show */}
            {isMobile && visibleSkills < filteredSkills.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex justify-center"
              >
                <button
                  onClick={handleShowMore}
                  className="group relative overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#38bdf8_0%,#0ea5e9_50%,#38bdf8_100%)]" />
                  <span className="inline-flex h-full items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-gray-900/80">
                    <span className="mr-2">Show More</span>
                    <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20">
                      <Plus className="h-3 w-3 text-sky-400" />
                      <span className="absolute inset-0 rounded-full border border-sky-400/50 animate-ping" />
                    </span>
                  </span>
                </button>
              </motion.div>
            )}

            {/* Selected skill detail */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {selectedSkill && <SkillDetailCard key={selectedSkill.name} skill={selectedSkill} />}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <Badge className="bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border-sky-400/20">
              <Award className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              Credentials
            </Badge>
            <h3 className="text-2xl font-semibold text-white">Certifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <CertificationCard key={index} cert={cert} index={index} />
            ))}
            {certifications.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <p className="text-gray-400 text-center">No certifications attached yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
