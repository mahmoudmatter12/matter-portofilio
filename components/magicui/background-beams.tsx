"use client"
import { cn } from "@/lib/utils"
import { memo } from "react"

interface BackgroundBeamsProps {
  className?: string
}

const BackgroundBeams = memo(({ className }: BackgroundBeamsProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]",
        className,
      )}
    />
  )
})

BackgroundBeams.displayName = "BackgroundBeams"

export { BackgroundBeams }
