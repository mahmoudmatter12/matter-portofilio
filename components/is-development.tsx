"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Construction, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge" 

export interface IsDevelopmentProps {
  id: string
  isUnderDev: boolean
  dueDate: Date
}

interface IDevelopmentSectionProps{
  devStatus: IsDevelopmentProps | null
  loading: boolean
}

function IsDevelopment({ devStatus, loading }: IDevelopmentSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  // Calculate time remaining
  useEffect(() => {
    if (!devStatus?.dueDate || !devStatus.isUnderDev) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const dueTime = new Date(devStatus.dueDate).getTime()
      const difference = dueTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft(null)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [devStatus])

  // Don't render if not under development or loading
  if (loading || !devStatus?.isUnderDev) {
    return null
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <AnimatePresence>
      <>
        <motion.div
          key={devStatus?.id || "is-dev"}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-cyan-700/95 to-sky-700/95 opacity-10 mx-12 md:mx-25 max-w-full backdrop-blur-md border-b border-orange-200/20"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* Left Section - Status Info */}
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="p-2 bg-white/20 rounded-full"
                >
                  <Construction className="h-5 w-5 text-white" />
                </motion.div>

                <div className="text-center sm:text-left">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-2">
                    Under Development
                  </Badge>
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    Portfolio is currently under development
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm">Working hard to bring you an amazing experience!</p>
                </div>
              </div>

              {/* Right Section - Countdown Timer and Due Date */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {timeLeft && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-white" />
                    <div className="flex items-center gap-2 text-white text-sm font-mono">
                      <div className="text-center">
                        <div className="font-bold">{timeLeft.days}</div>
                        <div className="text-xs opacity-80">days</div>
                      </div>
                      <span className="opacity-60">:</span>
                      <div className="text-center">
                        <div className="font-bold">{timeLeft.hours.toString().padStart(2, "0")}</div>
                        <div className="text-xs opacity-80">hrs</div>
                      </div>
                      <span className="opacity-60">:</span>
                      <div className="text-center">
                        <div className="font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</div>
                        <div className="text-xs opacity-80">min</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-white text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>ETA: {formatDate(devStatus.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Spacer to prevent content overlap */}
        <div className="h-16 sm:h-20" />
      </>
    </AnimatePresence>
  )
}

export default IsDevelopment
