"use client"

import { useState, useEffect, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Construction, Calendar, X, ChevronDown, ChevronUp, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DevelopmentStatus {
  id: string
  isUnderDev: boolean
  dueDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const IsDevelopment = memo(() => {
  const [devStatus, setDevStatus] = useState<DevelopmentStatus | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("dev-banner-dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
      setLoading(false)
      return
    }

    const fetchDevStatus = async () => {
      try {
        const response = await fetch("/api/development-status")
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setDevStatus({
              ...data[0],
              dueDate: new Date(data[0].dueDate),
            })
          }
        }
      } catch (error) {
        console.error("Error fetching development status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDevStatus()
  }, [])

  useEffect(() => {
    if (!devStatus?.isUnderDev || !devStatus.dueDate) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = devStatus.dueDate.getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [devStatus])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem("dev-banner-dismissed", "true")
  }

  const calculateProgress = () => {
    if (!devStatus?.dueDate) return 0

    const start = new Date("2024-01-01").getTime() // Assumed start date
    const end = devStatus.dueDate.getTime()
    const now = new Date().getTime()

    const total = end - start
    const elapsed = now - start

    return Math.min(Math.max((elapsed / total) * 100, 0), 100)
  }

  if (loading || isDismissed || !devStatus?.isUnderDev) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500/95 via-red-500/95 to-pink-500/95 backdrop-blur-md border-b border-white/20 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Main Content */}
            <div className="flex items-center gap-4 flex-1">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
              >
                <Construction className="h-5 w-5 text-white" />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">Under Development</Badge>
                  <span className="text-white font-semibold text-sm sm:text-base">
                    Portfolio is currently under development
                  </span>
                </div>

                <div className="flex items-center gap-4 text-white/90 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>ETA: {devStatus.dueDate.toLocaleDateString()}</span>
                  </div>

                  {/* Compact Countdown */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <div className="flex gap-1">
                      {timeLeft.days > 0 && (
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">{timeLeft.days}d</span>
                      )}
                      <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">{timeLeft.hours}h</span>
                      <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">{timeLeft.minutes}m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-white" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-white" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-white/20 pt-4 pb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progress Section */}
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      Development Progress
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-white/90 text-sm">
                        <span>Overall Completion</span>
                        <span>{Math.round(calculateProgress())}%</span>
                      </div>
                      <progress value={calculateProgress()} className="h-2 bg-white/20" />
                    </div>
                  </div>

                  {/* Detailed Countdown */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">Time Remaining</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Days", value: timeLeft.days },
                        { label: "Hours", value: timeLeft.hours },
                        { label: "Minutes", value: timeLeft.minutes },
                        { label: "Seconds", value: timeLeft.seconds },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                        >
                          <div className="text-white font-bold text-lg">{item.value.toString().padStart(2, "0")}</div>
                          <div className="text-white/80 text-xs">{item.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-white/90 text-sm">
                    🚀 Working hard to bring you an amazing experience! The portfolio is being enhanced with new
                    features, improved performance, and better user experience. Thank you for your patience!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

IsDevelopment.displayName = "IsDevelopment"

export default IsDevelopment
