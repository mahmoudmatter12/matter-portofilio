"use client"
import { motion } from "framer-motion"
import { Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { MyLink } from "./MyLink"
import { BackgroundBeams } from "./magicui/background-beams"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const socialLinks = [
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:your@email.com"
    },
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/yourusername"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com/in/yourprofile"
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com/yourhandle"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com/yourprofile"
    }
  ]

  return (
    <footer className="relative border-t border-gray-800 bg-gray-900 overflow-hidden">
      <BackgroundBeams className="opacity-10" />

      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Left section - Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                Mahmoud Matter
              </span>
            </h3>
            <p className="text-gray-400 mb-6">
              Full-stack developer creating modern web experiences with cutting-edge technologies.
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                  className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gradient-to-r from-sky-500/20 to-cyan-500/20 transition-all"
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right section - Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Navigation",
                links: [
                  { name: "Home", href: "#home" },
                  { name: "About", href: "#about" },
                  { name: "Projects", href: "#projects" },
                  { name: "Contact", href: "#contact" }
                ]
              },
              {
                title: "Resources",
                links: [
                  { name: "Blog", href: "#blog" },
                  { name: "GitHub", href: "https://github.com/yourusername" },
                  { name: "Resume", href: "/resume.pdf" },
                  { name: "Uses", href: "#uses" }
                ]
              },
              {
                title: "Legal",
                links: [
                  { name: "Privacy", href: "#privacy" },
                  { name: "Terms", href: "#terms" },
                  { name: "Cookies", href: "#cookies" }
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="space-y-4"
              >
                <h4 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * linkIndex, duration: 0.5 }}
                    >
                      <MyLink
                        href={link.href}
                        className="text-gray-400 hover:text-sky-400 transition-colors text-sm"
                      >
                        {link.name}
                      </MyLink>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-sm">
            © {currentYear} Mahmoud Matter. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sky-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12.5 7h-1v6h1V7zm0 7h-1v1h1v-1z" />
              </svg>
            </motion.div>
            <span className="text-gray-500 text-sm">using Next.js</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}