"use client"
import { useState, useEffect, useMemo, memo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MyLink } from "./MyLink"
import { useMobile } from "@/hooks/use-mobile"
import { useProfile } from "@/context/ProfileProvidor"
import {
  ArrowDown,
  Download,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  Coffee,
  Code,
  Palette,
  Zap,
} from "lucide-react"
import AnimatedProfessions from "@/components/ui/animated-professions"
import { BackgroundBeams } from "./magicui/background-beams"
import { Spotlight } from "./ui/spotlight-new"

const HeroSection = memo(() => {
  const isMobile = useMobile()
  const { profile, loading } = useProfile()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Memoized floating elements for performance
  const floatingElements = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: Math.random() * 100 + 50,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        x: Math.random() * 100,
        y: Math.random() * 100,
      })),
    [],
  )

  // Memoized social links
  const socialLinks = useMemo(
    () => [
      {
        icon: <Github className="w-5 h-5" />,
        href: profile?.github || "https://github.com/mahmoudgamal92",
        label: "GitHub",
        color: "hover:text-gray-900 dark:hover:text-white",
      },
      {
        icon: <Linkedin className="w-5 h-5" />,
        href: profile?.linkedin || "https://linkedin.com/in/mahmoud-gamal-92",
        label: "LinkedIn",
        color: "hover:text-blue-600",
      },
    ],
    [profile?.github, profile?.linkedin],
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <BackgroundBeams className="opacity-40" />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(99, 102, 241, 0.)" />

        {/* Floating background elements */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 blur-xl"
            style={{
              width: element.size,
              height: element.size,
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: element.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: element.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Interactive cursor effect */}
      <motion.div
        className="fixed pointer-events-none z-10 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 blur-sm"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      <div className="container mx-auto px-6 relative z-20">
        <motion.div className="max-w-7xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
          <div className={`grid ${isMobile ? "grid-cols-1 gap-12" : "lg:grid-cols-2 gap-16"} items-center`}>
            {/* Left Column - Text Content */}
            <motion.div className={`space-y-8 ${isMobile ? "text-center" : "lg:text-left"}`} variants={itemVariants}>
              {/* Greeting Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 dark:border-cyan-400/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                >
                  👋
                </motion.div>
                <span className="text-sm font-medium text-indigo-600 dark:text-cyan-400">Hello, Im</span>
              </motion.div>

              {/* Name */}
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
                variants={itemVariants}
              >
                <motion.span
                  className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {loading ? "Loading..." : profile?.name || "Mahmoud"}
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {loading ? "Loading..." : null}
                </motion.span>
              </motion.h1>

              {/* Animated Professions */}
              <motion.div className="text-xl sm:text-2xl lg:text-3xl" variants={itemVariants}>
                <AnimatedProfessions
                  professions={profile?.professions || ["Full-Stack Developer", "UI/UX Designer", "Problem Solver"]}
                  className="justify-center lg:justify-start"
                />
              </motion.div>

              {/* Bio */}
              <motion.p
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
                variants={itemVariants}
              >
                {loading
                  ? "Loading..."
                  : profile?.bio ||
                  "Passionate about creating exceptional digital experiences through clean code and innovative design. Let's build something amazing together!"}
              </motion.p>

              {/* Personal Info Cards */}
              <motion.div className="flex flex-wrap gap-4 justify-center lg:justify-start" variants={itemVariants}>
                {[
                  { icon: <MapPin className="w-4 h-4" />, text: "Egypt", color: "from-green-500 to-emerald-500" },
                  { icon: <Calendar className="w-4 h-4" />, text: "Available", color: "from-blue-500 to-cyan-500" },
                  { icon: <Coffee className="w-4 h-4" />, text: "Coffee Lover", color: "from-amber-500 to-orange-500" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className={`p-1 rounded-full bg-gradient-to-r ${item.color}`}>
                      <div className="text-white">{item.icon}</div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div className="flex flex-wrap gap-4 justify-center lg:justify-start" variants={itemVariants}>
                <MyLink
                  href="#contact"
                  className="group px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-600 text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/25 dark:hover:shadow-cyan-500/25 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Get In Touch</span>
                  <motion.div
                    className="w-5 h-5"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                  </motion.div>
                </MyLink>

                <MyLink
                  href={
                    profile?.CV || "https://drive.google.com/file/d/1tNdQaAuuFpFNnjGXgVgypPbthZT5MIOH/view?usp=sharing"
                  }
                  target="_blank"
                  className="group px-8 py-4 rounded-full border-2 border-indigo-500 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-gray-800/50 font-semibold transition-all duration-300 inline-flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download CV</span>
                </MyLink>
              </motion.div>

              {/* Social Links */}
              <motion.div className="flex gap-4 justify-center lg:justify-start" variants={itemVariants}>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-300 shadow-sm hover:shadow-lg`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Profile Picture */}
            <motion.div className="flex justify-center lg:justify-end" variants={itemVariants}>
              <div className="relative group">
                {/* Animated glow effect */}
                <motion.div
                  className="absolute -inset-8 rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-cyan-500/30 blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Floating particles */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + (i % 3) * 30}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Main profile image */}
                <motion.div
                  className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-4 border-white/50 dark:border-gray-800/50 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    y: {
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                    scale: {
                      duration: 0.3,
                    },
                  }}
                >
                  <Image
                    src={profile?.avatar || "/acpc.jpg"}
                    alt={`${profile?.name || "Profile"} photo`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 450px"
                    priority
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>

                {/* Floating skill badges */}
                {[
                  { icon: <Code className="w-4 h-4" />, label: "Code", position: "top-4 right-4" },
                  { icon: <Palette className="w-4 h-4" />, label: "Design", position: "bottom-4 left-4" },
                  { icon: <Zap className="w-4 h-4" />, label: "Fast", position: "top-1/2 -left-4" },
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${badge.position} bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.2 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div className="text-indigo-500 dark:text-cyan-400">{badge.icon}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <MyLink href="#about" className="flex items-center gap-2">
              <motion.div
                className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className="text-sm font-medium">Scroll to explore</span>
                <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
                  <motion.div
                    className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
              </motion.div>
            </MyLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})

HeroSection.displayName = "HeroSection"

export default HeroSection
