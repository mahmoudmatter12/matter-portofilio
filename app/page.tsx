"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Projects } from "@/components/Projects"
import { Timeline } from "@/components/Timeline"
import { Services } from "@/components/Services"
import { Contact } from "@/components/Contact"
import { Hero } from "@/components/HeroSection"
import { About } from "@/components/AboutSection"
import { TechStackSection } from "@/components/SkillsAndCertifications"
import { SpaceLoader } from "@/components/Loader"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    // Simulate loading for a smoother entry experience
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <SpaceLoader key="loader" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <About />
          <TechStackSection />
          <Projects />
          <Timeline />
          <Services />
          <Contact />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
