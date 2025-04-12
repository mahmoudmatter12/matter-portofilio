"use client"
import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingDockProps {
    items: {
        title: string
        icon: React.ReactNode
        href: string
    }[]
    className?: string
    itemClassName?: string
    mobilePosition?: "top" | "bottom"
}

export function FloatingDock({
    items,
    className,
    itemClassName }: FloatingDockProps) {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
                "rounded-full shadow-lg p-2 flex items-center justify-center",
                className
            )}
        >
            <div className="flex items-center gap-1">
                {items.map((item, index) => (
                    <motion.a
                        key={index}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={cn(
                            "p-3 rounded-full flex items-center justify-center transition-colors",
                            itemClassName
                        )}
                        aria-label={item.title}
                    >
                        <div className="relative group">
                            {item.icon}
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {item.title}
                            </span>
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.div>
    )
}