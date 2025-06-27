"use client"
import { useState, useEffect, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ScrollProgress } from "./ScrollProgress"
import { MyLink } from "./MyLink"
import { usePathname } from "next/navigation"
import { Crown, Menu, X, Home, User, Award, Briefcase, Code, Mail } from "lucide-react"

const Header = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (pathname.startsWith("/admin")) {
    return null
  }

  const navItems = [
    { name: "Home", href: "#home", icon: <Home className="w-4 h-4" /> },
    { name: "About", href: "#about", icon: <User className="w-4 h-4" /> },
    { name: "Qualification", href: "#qualification", icon: <Award className="w-4 h-4" /> },
    { name: "Skills", href: "#skills", icon: <Code className="w-4 h-4" /> },
    { name: "Projects", href: "#projects", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Contact", href: "#contact", icon: <Mail className="w-4 h-4" /> },
  ]

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? "py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/20 dark:border-gray-800/20"
            : "py-4 bg-transparent"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <motion.div
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Mahmoud Matter
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <motion.nav
              className="hidden lg:flex items-center space-x-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <MyLink
                    href={item.href}
                    className="group relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-all duration-300 rounded-full"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </span>
                    <motion.div
                      layoutId="nav-hover"
                    />
                  </MyLink>
                </motion.div>
              ))}
            </motion.nav>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              {/* Admin Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/admin">
                  <motion.button
                    className="group relative px-3 py-2 sm:px-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-300/30 dark:border-pink-400/30 text-purple-700 dark:text-pink-300 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Admin</span>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      layoutId="admin-hover"
                    />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
        <ScrollProgress />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                    Navigation
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <MyLink
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-cyan-400 transition-all duration-300 group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-indigo-500 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </MyLink>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
})

Header.displayName = "Header"

export { Header }
