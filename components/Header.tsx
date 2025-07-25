"use client"
import { useState, useEffect, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ScrollProgress } from "./ScrollProgress"
import { usePathname } from "next/navigation"
import { useDevBanner } from "@/hooks/use-dev-banner"
import {
  Crown,
  Menu,
  X,
  Home,
  User,
  Award,
  Briefcase,
  Code,
  Mail,
  Sparkles,
  ChevronRight,
  Github,
  Linkedin,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"

const Header = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const hasDevBanner = useDevBanner()
  const pathname = usePathname()
  const isAdminPanel = pathname.startsWith("/admin")

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

  // Don't render header on admin panel
  if (isAdminPanel) {
    return null
  }

  const navItems = [
    { name: "Home", href: "#home", icon: <Home className="w-4 h-4" />, description: "Welcome to my portfolio" },
    { name: "About", href: "#about", icon: <User className="w-4 h-4" />, description: "Learn more about me" },
    { name: "Qualification", href: "#qualification", icon: <Award className="w-4 h-4" />, description: "My experience & education" },
    { name: "Skills", href: "#skills", icon: <Code className="w-4 h-4" />, description: "Technical expertise" },
    { name: "Projects", href: "#projects", icon: <Briefcase className="w-4 h-4" />, description: "Featured work" },
    { name: "Contact", href: "#contact", icon: <Mail className="w-4 h-4" />, description: "Get in touch" },
  ]

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/mahmoudgamal92", icon: <Github className="w-4 h-4" /> },
    { name: "LinkedIn", href: "https://linkedin.com/in/mahmoud-gamal-92", icon: <Linkedin className="w-4 h-4" /> },
  ]

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${hasDevBanner ? "top-16" : "top-0"
          } ${isScrolled
            ? "py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/20 dark:border-gray-800/20"
            : "py-4 bg-transparent"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center group">
              <motion.div
                className="relative flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <motion.div
                    className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 blur-sm"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <motion.div
                    className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    Mahmoud Matter
                  </motion.div>
                  <motion.div
                    className="text-xs text-gray-500 dark:text-gray-400 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Full-Stack Developer
                  </motion.div>
                </div>
              </motion.div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <motion.nav
              className="hidden lg:flex items-center space-x-2"
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
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="group relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-all duration-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  >
                    <Link href={item.href}>
                      <span className="relative z-10 flex items-center gap-2">
                        <span className="text-indigo-500 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        {item.name}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        layoutId="nav-hover"
                      />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </motion.nav>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              {/* Enhanced Admin Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="group relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-300/30 dark:border-pink-400/30 text-purple-700 dark:text-pink-300 hover:from-purple-500/20 hover:to-pink-500/20 shadow-sm hover:shadow-lg"
                >
                  <Link href="/admin">
                    <Crown className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              </motion.div>

              {/* Enhanced Mobile Menu using Sheet */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:hidden"
              >
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-lg"
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
                    </Button>
                  </SheetTrigger>

                  <SheetContent side="right" className="w-80 sm:w-96 p-0">
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <SheetTitle className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                              Navigation
                            </SheetTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Explore my portfolio
                            </p>
                          </div>
                        </div>
                      </SheetHeader>

                      {/* Navigation Items */}
                      <div className="flex-1 p-6">
                        <nav className="space-y-2">
                          {navItems.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 px-4 py-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-cyan-400 transition-all duration-300 group border border-transparent hover:border-indigo-200 dark:hover:border-cyan-400/20"
                                asChild
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Link href={item.href}>
                                  <span className="text-indigo-500 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                  </span>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.description}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition-colors" />
                                </Link>
                              </Button>
                            </motion.div>
                          ))}
                        </nav>
                      </div>

                      {/* Footer */}
                      <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 dark:border-cyan-400/20">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin Access</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Manage your portfolio</p>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Connect with me</p>
                          <div className="flex gap-2">
                            {socialLinks.map((social, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                              >
                                <Button
                                  variant="outline"
                                  size="icon"
                                  asChild
                                  className="w-10 h-10 rounded-full"
                                >
                                  <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-cyan-400"
                                  >
                                    {social.icon}
                                  </a>
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions</p>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-600"
                              asChild
                            >
                              <Link href="#contact">
                                <Mail className="w-4 h-4" />
                                Contact
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              asChild
                            >
                              <a
                                href="https://drive.google.com/file/d/1tNdQaAuuFpFNnjGXgVgypPbthZT5MIOH/view?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="w-4 h-4" />
                                CV
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </motion.div>
            </div>
          </div>
        </div>
        <ScrollProgress />
      </motion.header>
    </>
  )
})

Header.displayName = "Header"

export { Header }
