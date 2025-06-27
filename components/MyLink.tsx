"use client"
import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { smoothScroll } from '@/lib/smooth-scroll'

interface MyLinkProps {
  className?: string
  children: React.ReactNode
  href: string
  target?: string
  rel?: string
  onClick?: () => void
  active?: boolean
}

export function MyLink({
  className,
  children,
  href,
  target,
  rel,
  onClick,
  active = false
}: MyLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      smoothScroll(href)
    }
    onClick?.()
  }

  return (
    <Link
      className={cn(
        "transition-colors duration-200",
        "text-gray-800 hover:text-indigo-800",
        "dark:text-gray-200 dark:hover:text-cyan-400",
        active ? "text-indigo-600 dark:text-cyan-400 font-medium" : "",
        "hover:underline hover:decoration-2 hover:decoration-indigo-500 dark:hover:decoration-cyan-400",
        "hover:underline-offset-4",
        className
      )}
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}