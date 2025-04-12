"use client"
import { useState, useEffect } from "react"
import React from "react"
import { FaTimeline } from "react-icons/fa6";
import { SiSkillshare } from "react-icons/si";
import { MdMiscellaneousServices } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { FaSquareUpwork } from "react-icons/fa6";
import { FaRegArrowAltCircleLeft, FaWhatsapp } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion"
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Home,
  User,
  Folder,
  ChevronRight,
  X,
  ChevronDown,
  ChevronLeft,
} from "lucide-react"

export function FloatingSocialDock() {
  const [expanded, setExpanded] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [activeHash, setActiveHash] = useState("")

  const smoothScroll = (targetId: string) => {
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      setActiveHash(targetId)

      // Update URL without page reload
      window.history.pushState(null, "", targetId)
    }
  }

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash)
    }

    const handleScroll = () => {
      // Get all sections
      const sections = document.querySelectorAll("section[id]")

      // Find the section that is currently in view
      let currentSection = ""
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        const sectionHeight = section.getBoundingClientRect().height

        // If the section is in the viewport (with some buffer)
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
          currentSection = `#${section.id}`
        }
      })

      if (currentSection && currentSection !== activeHash) {
        setActiveHash(currentSection)
        // Update URL without page reload
        window.history.replaceState(null, "", currentSection)
      }
    }

    // Set initial hash
    if (typeof window !== "undefined") {
      setActiveHash(window.location.hash)
      window.addEventListener("hashchange", handleHashChange)
      window.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("hashchange", handleHashChange)
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [activeHash])

  const links = [
    {
      title: "Home",
      icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "#home",
    },
    {
      title: "About",
      icon: <User className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "#about",
    },
    {
      title: "Timeline",
      icon: <FaTimeline className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "#timeline",
    },
    {
      title: "Skills",
      icon: <SiSkillshare className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "#skills",
    },
    {
      title: "Projects",
      icon: <Folder className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "#projects",
    },
    {
      title: "Services",
      icon: <MdMiscellaneousServices className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "#services",
    },
    {
      title: "Team",
      icon: <AiOutlineTeam className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "#team",
    },
    {
      title: "Contact",
      icon: <Mail className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "#contact",
    },
  ]

  const socialLinks = [
    {
      title: "GitHub",
      icon: <Github className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "https://github.com/mahmoudmatter12",
    },
    {
      title: "LinkedIn",
      icon: <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "https://linkedin.com/in/mahmoudmatter",
    },
    {
      title: "Instagram",
      icon: <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "https://www.instagram.com/mahmoud_mater_",
    },
    {
      title: "WhatsApp",
      icon: <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "https://wa.me/+201100108253",
    },
    {
      title: "Upwork",
      icon: <FaSquareUpwork className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "https://www.upwork.com/freelancers/~01d16f0d4d25be61d2",
    },
  ]

  return (
    <>
      {/* Mobile Toggle Button (hidden on desktop) */}
      <div className="fixed top-15 sm:top-auto sm:hidden right-6 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setHidden(!hidden)}
          className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg opacity-40 "
        >
          {hidden ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <X className="h-4 w-4 sm:h-5 sm:w-5" />}
        </motion.button>
      </div>

      <div className="fixed top-15 sm:top-auto bottom-6 right-6 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setHidden(!hidden)}
          className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg opacity-40 hover:opacity-100 transition-opacity duration-300"
        >
          {hidden ? <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" /> : <X className="h-4 w-4 sm:h-5 sm:w-5" />}
        </motion.button>
      </div>

      {/* Main Dock (hidden on mobile when toggled) */}
      <AnimatePresence>
        {!hidden && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`
              fixed bottom-6 left-1/2 -translate-x-1/2 z-50
              hidden sm:flex items-center justify-center
            `}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                ],
                transition: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
              }}
              className={`
                bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
                border border-sky-100 dark:border-gray-700
                rounded-full shadow-lg p-2 flex items-center
                transition-all duration-300
                ${expanded ? "px-6" : "px-2"}
              `}
            >
              <div className="flex items-center gap-1">
                {links.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => smoothScroll(item.href)}
                    className={`
                      p-3 rounded-full flex items-center justify-center
                      transition-colors
                      ${activeHash === item.href || (item.href === "#home" && activeHash === "")
                        ? "bg-gradient-to-r from-indigo-500/20 to-cyan-400/20"
                        : "hover:bg-indigo-100/50 dark:hover:bg-gray-700"
                      }
                    `}
                    aria-label={item.title}
                  >
                    <div className="relative group">
                      {React.cloneElement(item.icon, {
                        className: `h-4 w-4 sm:h-5 sm:w-5 ${activeHash === item.href || (item.href === "#home" && activeHash === "")
                            ? "text-indigo-600 dark:text-cyan-400"
                            : "text-indigo-500 dark:text-cyan-400"
                          }`,
                      })}
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.title}
                      </span>
                    </div>
                  </motion.button>
                ))}

                {/* Social links */}
                <motion.div
                  animate={{ rotate: expanded ? 180 : 180 }}
                  className="h-10 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"
                />

                <motion.button
                  whileHover={{ rotate: expanded ? -90 : 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setExpanded(!expanded)}
                  className="p-3 rounded-full hover:bg-indigo-100/50 dark:hover:bg-gray-700 text-indigo-500 dark:text-cyan-400"
                >
                  {expanded ? <FaRegArrowAltCircleLeft /> : <FaRegArrowAltCircleRight />  }
                </motion.button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="flex overflow-hidden"
                    >
                      {socialLinks.map((item, index) => (
                        <motion.a
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full hover:bg-indigo-100/50 dark:hover:bg-gray-700"
                          aria-label={item.title}
                        >
                          <div className="relative group">
                            {React.cloneElement(item.icon, {
                              className: "h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 dark:text-cyan-400",
                            })}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {item.title}
                            </span>
                          </div>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Compact Version */}
      <AnimatePresence>
        {!hidden && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex max-w-[95vw] sm:hidden overflow-auto custom-scrollbar"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                ],
                transition: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
              }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-sky-100 dark:border-gray-700 rounded-full shadow-lg p-2"
            >
              <div className="flex items-center gap-1">
                {links.map((item, index) => (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      smoothScroll(item.href)
                      setExpanded(false)
                    }}
                    className={`
                      p-3 rounded-full flex items-center justify-center
                      ${activeHash === item.href || (item.href === "#home" && activeHash === "")
                        ? "bg-gradient-to-r from-indigo-500/20 to-cyan-400/20"
                        : "hover:bg-indigo-100/50 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {React.cloneElement(item.icon, {
                      className: `h-4 w-4 sm:h-5 sm:w-5 ${activeHash === item.href || (item.href === "#home" && activeHash === "")
                          ? "text-indigo-600 dark:text-cyan-400"
                          : "text-indigo-500 dark:text-cyan-400"
                        }`,
                    })}
                  </motion.button>
                ))}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setExpanded(!expanded)}
                  className="p-3 rounded-full hover:bg-indigo-100/50 dark:hover:bg-gray-700"
                >
                  <ChevronRight
                    className={`h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 dark:text-cyan-400 transition-transform ${expanded ? "rotate-90" : ""
                      }`}
                  />
                </motion.button>
              </div>

              {/* Expanded mobile menu */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 flex flex-wrap justify-center gap-1">
                      {socialLinks.map((item, index) => (
                        <motion.a
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full hover:bg-indigo-100/50 dark:hover:bg-gray-700"
                        >
                          {React.cloneElement(item.icon, {
                            className: "h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 dark:text-cyan-400",
                          })}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
