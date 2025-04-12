"use client"
import { useState, useEffect, useMemo } from "react"
import { motion, useAnimation } from "framer-motion"
import { Spotlight } from "./ui/spotlight-new"
import { MyLink } from "./MyLink"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import { ArrowDown, Github, Linkedin, Twitter, ExternalLink } from "lucide-react"

export function Hero() {
  const isMobile = useMobile()
  const controls = useAnimation()
  const [typedText, setTypedText] = useState("")
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const phrases = useMemo(() => ["Full Stack Developer", "UI/UX Enthusiast", "Problem Solver"], [])

  // Typing animation effect
  useEffect(() => {
    let isMounted = true
    const phrase = phrases[currentPhraseIndex]
    let index = 0
    let typingInterval: NodeJS.Timeout

    // Type the current phrase
    const typePhrase = () => {
      typingInterval = setInterval(() => {
        if (!isMounted) return

        if (index < phrase.length) {
          setTypedText(phrase.substring(0, index + 1))
          index++
        } else {
          clearInterval(typingInterval)

          // Wait before erasing
          setTimeout(() => {
            if (!isMounted) return
            erasePhrase()
          }, 2000)
        }
      }, 100)
    }

    // Erase the current phrase
    const erasePhrase = () => {
      index = phrase.length
      typingInterval = setInterval(() => {
        if (!isMounted) return

        if (index > 0) {
          setTypedText(phrase.substring(0, index - 1))
          index--
        } else {
          clearInterval(typingInterval)

          // Move to next phrase
          setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        }
      }, 50)
    }

    typePhrase()

    return () => {
      isMounted = false
      clearInterval(typingInterval)
    }
  }, [currentPhraseIndex, phrases])

  // Start animations when component mounts
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    })
  }, [controls])

  // Particle animation for floating elements
  const floatingElements = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 16) + 8, // 8-24px
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    duration: Math.random() * 10 + 10, // 10-20s
    delay: Math.random() * 5,
  }))

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Spotlight Background */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(200, 100%, 85%, 0.15) 0%, hsla(190, 100%, 70%, 0.1) 50%, hsla(190, 100%, 60%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(200, 100%, 85%, 0.12) 0%, hsla(190, 100%, 70%, 0.08) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(200, 100%, 85%, 0.08) 0%, hsla(190, 100%, 60%, 0.05) 80%, transparent 100%)"
        duration={10}
      />

      {/* Floating elements using Framer Motion instead of global CSS */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 blur-xl"
            style={{
              width: el.size,
              height: el.size,
              left: el.x,
              top: el.y,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: el.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: el.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={controls} className="max-w-4xl">
          {/* Social links */}
          <motion.div
            className="flex justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {[
              { icon: <Github className="w-5 h-5" />, href: "https://github.com/yourusername" },
              { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/in/yourusername" },
              { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/yourusername" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-cyan-400 transition-all"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Title with enhanced animation */}
          <div className="relative">
            <motion.h1
              className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Hello, I&apos;m
              </span>{" "}
              <span className="text-gray-900 dark:text-white">Mahmoud Matter</span>
            </motion.h1>

            {/* Animated underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mt-2 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: isMobile ? "80%" : "50%" }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>

          {/* Animated typing effect */}
          <motion.div
            className="h-12 mt-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <span>{typedText}</span>
              <span className="ml-1 w-1 h-8 bg-indigo-500 dark:bg-cyan-400 animate-pulse" />
            </h2>
          </motion.div>

          {/* Subtitle with enhanced animation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            A passionate developer building digital experiences with modern web technologies. Specializing in creating
            beautiful, functional, and user-friendly applications.
          </motion.p>

          {/* CTA Buttons with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#projects"
                className="group relative px-8 py-3 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-cyan-400/30 transition-all inline-flex items-center gap-2"
              >
                <span>View My Work</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MyLink
                href="#contact"
                className="px-8 py-3 rounded-full border-2 border-indigo-500 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-gray-800/50 transition-all"
              >
                Contact Me
              </MyLink>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            className="flex flex-col items-center"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll Down</span>
            <ArrowDown className="w-5 h-5 text-indigo-500 dark:text-cyan-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
