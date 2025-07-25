"use client"
import { useState, useRef, memo, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MyLink } from "./MyLink"
import { useMobile } from "@/hooks/use-mobile"
import { useProfile } from "@/context/ProfileProvidor"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Monitor,
  Server,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Calendar,
  MapPin,
  Coffee,
  Heart,
  User,
} from "lucide-react"
import { BackgroundBeams } from "./magicui/background-beams"
import { Spotlight } from "./ui/spotlight-new"

const About = memo(() => {
  const isMobile = useMobile()
  const [isHovered, setIsHovered] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const containerRef = useRef<HTMLDivElement>(null)
  const { profile, loading } = useProfile()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Calculate years of experience dynamically
  const yearsOfExperience = useMemo(() => {
    return new Date().getFullYear() - 2023
  }, [])

  // Personal achievements/facts with animations
  const personalFacts = useMemo(
    () => [
      {
        icon: <Code className="w-5 h-5" />,
        text: `${yearsOfExperience}+ years of coding experience`,
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: <Monitor className="w-5 h-5" />,
        text: "10+ successful projects delivered",
        color: "from-green-500 to-emerald-500",
      },
      {
        icon: <Server className="w-5 h-5" />,
        text: "Full-stack development expertise",
        color: "from-purple-500 to-violet-500",
      },
      {
        icon: <Sparkles className="w-5 h-5" />,
        text: "Passionate about clean, efficient code",
        color: "from-orange-500 to-red-500",
      },
    ],
    [yearsOfExperience],
  )

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
      { id: "journey", label: "Journey", icon: <Calendar className="w-4 h-4" /> },
      { id: "interests", label: "Interests", icon: <Heart className="w-4 h-4" /> },
    ],
    [],
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden" ref={containerRef}>
      {/* Enhanced Background Effects - Optimized for mobile */}
      <div className="absolute inset-0">
        {!isMobile && (
          <>
            <BackgroundBeams className="opacity-30" />
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(99, 102, 241, 0.1)" />
          </>
        )}
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-3xl animate-pulse delay-2000" />
      </div>

      <motion.div
        className="container mx-auto px-6 relative z-10"
        style={{ opacity }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-600 dark:bg-cyan-400/10 dark:text-cyan-400 hover:bg-indigo-500/20 dark:hover:bg-cyan-400/20 border-indigo-500/20 dark:border-cyan-400/20 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Get to know me better
            </Badge>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                About Me
              </span>
            </h2>

            <motion.div
              className="h-1 w-24 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 96, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Enhanced Profile Picture */}
            <motion.div
              className="flex justify-center lg:justify-start"
              variants={itemVariants}
              style={{ y: isMobile ? 0 : y }}
            >
              <div
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Decorative rings */}
                <div className="absolute -inset-4 rounded-2xl border border-indigo-500/20 dark:border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute -inset-6 rounded-3xl border border-purple-500/10 dark:border-pink-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100" />

                {/* Main image container */}
                <motion.div
                  className="relative w-[300px] h-[380px] sm:w-[350px] sm:h-[440px] rounded-2xl overflow-hidden border-2 border-indigo-500/30 dark:border-cyan-400/30 shadow-2xl"
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src={profile?.avatar || "/acpc.jpg"}
                    alt={`${profile?.name || "Profile"} photo`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 350px"
                    priority
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Floating info card */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 border border-white/20"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {loading ? "Loading..." : profile?.name || null}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {loading ? "Loading..." : profile?.professions?.[0] || "Full-Stack Developer"}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>Available for opportunities</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 border border-indigo-500/20 dark:border-cyan-400/20"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.1, rotate: 10 }}
                >
                  <Code className="w-5 h-5 text-indigo-500 dark:text-cyan-400" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -left-4 bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 border border-purple-500/20 dark:border-pink-400/20"
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.1, rotate: -10 }}
                >
                  <Coffee className="w-5 h-5 text-purple-500 dark:text-pink-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Enhanced Content */}
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-cyan-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {activeTab === "overview" && (
                    <>
                      <div className="space-y-4">
                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                          {loading
                            ? "Loading..."
                            : profile?.about ||
                            `I'm a passionate developer with ${yearsOfExperience}+ years of experience crafting digital experiences. My journey in tech started when I built my first website at 15, and I've been hooked ever since.`}
                        </p>

                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                          I specialize in modern web technologies like{" "}
                          <span className="text-indigo-600 dark:text-cyan-400 font-semibold">Next.js</span>,{" "}
                          <span className="text-indigo-600 dark:text-cyan-400 font-semibold">React</span>, and{" "}
                          <span className="text-indigo-600 dark:text-cyan-400 font-semibold">Tailwind CSS</span>, with a
                          strong focus on creating performant, accessible, and visually stunning applications.
                        </p>
                      </div>

                      {/* Personal facts grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {personalFacts.map((fact, index) => (
                          <motion.div
                            key={index}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-cyan-400/20 hover:shadow-lg"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${fact.color} p-0.5`}>
                              <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center">
                                <div className={`text-transparent bg-gradient-to-r ${fact.color} bg-clip-text`}>
                                  {fact.icon}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                              {fact.text}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === "journey" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My Development Journey</h3>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Started Coding (2023)</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              Began my journey with HTML, CSS, and JavaScript
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Full-Stack Development</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              Mastered React, Node.js, and database technologies
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Present Day</h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              Building amazing projects and helping others learn
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "interests" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Beyond Coding</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {["🎮 Gaming", "📚 Reading", "🎵 Music", "☕ Coffee", "🌱 Learning", "🚀 Innovation"].map(
                          (interest, index) => (
                            <motion.div
                              key={index}
                              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center hover:bg-indigo-50 dark:hover:bg-gray-800/50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{interest}</span>
                            </motion.div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Call to action buttons */}
              <motion.div
                className="flex flex-wrap gap-4 pt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <MyLink
                  href="#contact"
                  className="group px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-600 text-white hover:shadow-xl hover:shadow-indigo-500/25 dark:hover:shadow-cyan-500/25 transition-all duration-300 inline-flex items-center gap-2 font-medium"
                >
                  <span>Lets connect</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MyLink>

                <MyLink
                  href={
                    profile?.CV || "https://drive.google.com/file/d/1tNdQaAuuFpFNnjGXgVgypPbthZT5MIOH/view?usp=sharing"
                  }
                  className="group px-8 py-3 rounded-full border-2 border-indigo-500 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-gray-800/50 transition-all duration-300 inline-flex items-center gap-2 font-medium"
                  target="_blank"
                >
                  <span>View CV</span>
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </MyLink>
              </motion.div>

              {/* Status indicator */}
              <motion.div
                className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Currently open to new opportunities
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
})

About.displayName = "About"

export { About }
