"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Rocket, Satellite, Plane } from "lucide-react"

export function SpaceLoader() {
  const [isExploring, setIsExploring] = useState(true)
  const [isFound, setIsFound] = useState(false)

  useEffect(() => {
    // Phase 1: Exploring space animation
    const exploreTimer = setTimeout(() => {
      setIsExploring(false)
    }, 3000)

    // Phase 2: Found animation
    const foundTimer = setTimeout(() => {
      setIsFound(true)
    }, 4000)

    return () => {
      clearTimeout(exploreTimer)
      clearTimeout(foundTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center from-[#111827] via-[#1F2937] to-[#17263d] z-[999] overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Phase 1: Exploring Space */}
        {isExploring && (
          <motion.div
            key="exploring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-8 text-sky-400"
            >
              <Rocket className="h-16 w-16" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-medium text-gray-300 mb-4"
            >
              Exploring the cosmos...
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-1 bg-gradient-to-r from-indigo-500/30 via-sky-400/70 to-cyan-400/30 rounded-full"
            />
          </motion.div>
        )}

        {/* Phase 2: Transition */}
        {!isExploring && !isFound && (
          <motion.div
            key="transition"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="mb-6 text-cyan-400 mx-auto"
            >
              <Satellite className="h-20 w-20" />
            </motion.div>
            <motion.p className="text-gray-400">
              Scanning space-time continuum...
            </motion.p>
          </motion.div>
        )}

        {/* Phase 3: Found! */}
        {isFound && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="mb-6"
            >
              <div className="relative">
                <Plane className="h-24 w-24 text-sky-400 mx-auto" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Satellite className="h-8 w-8 text-cyan-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent mb-2"
            >
              Found in Space!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 mb-6"
            >
              Welcome to my cosmic portfolio
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="h-1 w-40 bg-gradient-to-r from-sky-400/30 to-cyan-400/30 rounded-full mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}