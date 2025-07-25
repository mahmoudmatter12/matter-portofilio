"use client"

import { useState, useEffect, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Construction, Calendar, X, ChevronDown, ChevronUp, Clock, Zap, Target, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
        data-dev-banner
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-400 bg-gradient-to-r from-orange-500/95 via-red-500/95 to-pink-500/95 backdrop-blur-md border-b border-white/20 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Main Content */}
            <div className="flex items-center gap-4 flex-1">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="p-2 bg-white/20 rounded-lg backdrop-blur-sm shadow-sm"
              >
                <Construction className="h-5 w-5 text-white" />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm font-medium">
                    <Zap className="w-3 h-3 mr-1" />
                    Under Development
                  </Badge>
                  <span className="text-white font-semibold text-sm sm:text-base">
                    Portfolio is currently under development
                  </span>
                </div>

                <div className="flex items-center gap-4 text-white/90 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>ETA: {devStatus.dueDate.toLocaleDateString()}</span>
                  </div>

                  {/* Enhanced Compact Countdown */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <div className="flex gap-1">
                      {timeLeft.days > 0 && (
                        <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
                          {timeLeft.days}d
                        </span>
                      )}
                      <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
                        {timeLeft.hours}h
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
                        {timeLeft.minutes}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/30 backdrop-blur-sm"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="p-2 bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/30 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Expanded Content */}
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
                  {/* Enhanced Progress Section */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      <Target className="w-4 h-4" />
                      Development Progress
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/90 text-sm">
                        <span>Overall Completion</span>
                        <span className="font-semibold">{Math.round(calculateProgress())}%</span>
                      </div>
                      <div className="relative">
                        <div className="h-3 bg-white/20 border border-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                            style={{ width: `${calculateProgress()}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${calculateProgress()}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Detailed Countdown */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time Remaining
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Days", value: timeLeft.days, icon: <Calendar className="w-3 h-3" /> },
                        { label: "Hours", value: timeLeft.hours, icon: <Clock className="w-3 h-3" /> },
                        { label: "Minutes", value: timeLeft.minutes, icon: <Clock className="w-3 h-3" /> },
                        { label: "Seconds", value: timeLeft.seconds, icon: <Clock className="w-3 h-3" /> },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ scale: 0, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-colors"
                        >
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {item.icon}
                            <span className="text-white/80 text-xs font-medium">{item.label}</span>
                          </div>
                          <div className="text-white font-bold text-xl">
                            {item.value.toString().padStart(2, "0")}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Message Section */}
                <motion.div
                  className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg">
                      <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h5 className="text-white font-semibold mb-1">🚀 Exciting Updates Coming Soon!</h5>
                      <p className="text-white/90 text-sm leading-relaxed">
                        Working hard to bring you an amazing experience! The portfolio is being enhanced with new
                        features, improved performance, and better user experience. Thank you for your patience!
                      </p>
                    </div>
                  </div>
                </motion.div>
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
