"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ScrollProgress } from "./ScrollProgress"
import { MyLink } from "./MyLink"
import { usePathname } from "next/navigation"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
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

  if (pathname.startsWith("/admin")) {
    return;
  }
  const navItems = [
    { name: "About", href: "#about" },
    // { name: "Experience", href: "#experience" },
    // { name: "Education", href: "#education" },
    // { name: "Achievements", href: "#achievements" },
    // { name: "Certifications", href: "#certifications" },
    // { name: "Testimonials", href: "#testimonials" },
    // { name: "Awards", href: "#awards" },
    // { name: "Publications", href: "#publications" },
    // { name: "Languages", href: "#languages" },
    // { name: "Interests", href: "#interests" },
    // { name: "Hobbies", href: "#hobbies" },
    // { name: "Volunteer", href: "#volunteer" },
    // { name: "Courses", href: "#courses" },
    // { name: "References", href: "#references" },
    // { name: "Soft Skills", href: "#soft-skills" },
    // { name: "Hard Skills", href: "#hard-skills" },
    // { name: "Technical Skills", href: "#technical-skills" },
    // { name: "Professional Skills", href: "#professional-skills" },
    // { name: "Personal Projects", href: "#personal-projects" },
    // { name: "Open Source", href: "#open-source" },
    // { name: "Contributions", href: "#contributions" },
    // { name: "Community", href: "#community" },
    // { name: "Mentorship", href: "#mentorship" },
    // { name: "Workshops", href: "#workshops" },
    // { name: "Conferences", href: "#conferences" },
    // { name: "Meetups", href: "#meetups" },
    // { name: "Hackathons", href: "#hackathons" },
    // { name: "Competitions", href: "#competitions" },
    // { name: "Challenges", href: "#challenges" },
    // { name: "Collaborations", href: "#collaborations" },
    // { name: "Networking", href: "#networking" },
    // { name: "Partnerships", href: "#partnerships" },
    // { name: "Sponsorships", href: "#sponsorships" },
    // { name: "Grants", href: "#grants" },
    // { name: "Fellowships", href: "#fellowships" },
    // { name: "Internships", href: "#internships" },
    // { name: "Apprenticeships", href: "#apprenticeships" },
    // { name: "Mentoring", href: "#mentoring" },
    // { name: "Coaching", href: "#coaching" },
    // { name: "Training", href: "#training" },
    // { name: "Workshops", href: "#workshops" },
    // { name: "Seminars", href: "#seminars" },
    // { name: "Webinars", href: "#webinars" },
    // { name: "Podcasts", href: "#podcasts" },
    // { name: "Blogs", href: "#blogs" },
    // { name: "Articles", href: "#articles" },
    // { name: "Books", href: "#books" },
    // { name: "Research", href: "#research" },
    // { name: "Public Speaking", href: "#public-speaking" },
    // { name: "Presentations", href: "#presentations" },
    // { name: "Workshops", href: "#workshops" },
    // { name: "Training", href: "#training" },
    // { name: "Certifications", href: "#certifications" },
    // { name: "Courses", href: "#courses" },
    // { name: "Online Courses", href: "#online-courses" },
    // { name: "E-learning", href: "#e-learning" },
    // { name: "Self-study", href: "#self-study" },
    // { name: "Online Learning", href: "#online-learning" },
    { name: "Qualification", href: "#qualification" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Services", href: "#services" },
    // { name: "Team", href: "#team" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "py-5 bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* <motion.img
              src="/logo.png"
              alt="Logo"
              width={30}
              height={30}
              className="m-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            /> */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent"
            >
              Mahmoud Matter
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-1"
          >
            {navItems.map((item, index) => (
              <MyLink
                key={index}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
              >
                {item.name}
              </MyLink>
            ))}
          </motion.nav>
        </div>
      </div>
      <ScrollProgress />
    </header>
  )
}
