"use client"
import { useState, useEffect, memo } from "react"
import { motion } from "framer-motion"

interface AnimatedProfessionsProps {
  professions: string[]
  className?: string
}

const AnimatedProfessions = memo(({ professions, className = "" }: AnimatedProfessionsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (!professions.length) return

    const currentProfession = professions[currentIndex]

    if (isTyping) {
      if (charIndex < currentProfession.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentProfession.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        // Finished typing, wait then start erasing
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(currentProfession.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        // Finished erasing, move to next profession
        const timeout = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % professions.length)
          setIsTyping(true)
        }, 500)
        return () => clearTimeout(timeout)
      }
    }
  }, [currentIndex, charIndex, isTyping, professions])

  const colors = [
    "from-indigo-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-emerald-500 to-teal-400",
    "from-orange-500 to-red-400",
    "from-blue-500 to-indigo-400",
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-gray-600 dark:text-gray-300">I&apos;m a</span>
      <div className="relative min-h-[1.5em] flex items-center">
        <motion.span
          key={currentIndex}
          className={`font-bold bg-gradient-to-r ${colors[currentIndex % colors.length]} bg-clip-text text-transparent`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {displayText}
        </motion.span>
        <motion.span
          className="inline-block w-0.5 h-6 bg-indigo-500 dark:bg-cyan-400 ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      </div>
    </div>
  )
})

AnimatedProfessions.displayName = "AnimatedProfessions"

export default AnimatedProfessions
