"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Services } from "@/components/Services"
import { Contact } from "@/components/Contact"
import { Hero } from "@/components/HeroSection"
import { About } from "@/components/AboutSection"
import { SpaceLoader } from "@/components/Loader"
import { Footer } from "@/components/Footer"
import { TeamCarousel } from "@/components/TeamCarousel"
import { ProjectsOpt } from "@/components/ProjectsOpimites"
import { TechStackSectionOpt } from "@/components/tech-stack-section-optimized"
import { TimelineOPT } from "@/components/timeline-optimized"

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
          <TimelineOPT />
          <TechStackSectionOpt />
          <ProjectsOpt />
          <Services />
          <TeamCarousel />
          <Contact />
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
