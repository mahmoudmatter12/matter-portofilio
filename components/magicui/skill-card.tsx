"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SkillCardProps {
  name: string
  icon: React.ReactNode
  level: number
  isActive: boolean
  onClick?: () => void
}

export function SkillCard({ name, icon, level, isActive, onClick }: SkillCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "relative p-4 rounded-xl border transition-all cursor-pointer",
        isActive
          ? "bg-gray-900/80 border-primary/50 shadow-lg shadow-primary/10"
          : "bg-gray-900/50 border-gray-800 hover:border-primary/30",
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
        <span className="text-sm font-medium text-center">{name}</span>

        {/* Skill level indicator */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
