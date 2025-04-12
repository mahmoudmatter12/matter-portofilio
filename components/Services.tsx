"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Code, LayoutTemplate, Smartphone, BarChart2, Cpu, Zap, ArrowRight, CheckCircle, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null)


  // State to track which service is being hovered
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const services = [
    {
      icon: <Code className="h-8 w-8 text-indigo-500 dark:text-cyan-400" />,
      title: "Web Development",
      description:
        "Custom websites built with modern technologies like Next.js and Tailwind CSS for optimal performance and SEO.",
      highlights: ["Responsive Design", "SEO Optimized", "Fast Loading"],
      color: "from-indigo-500 to-blue-600",
    },
    {
      icon: <LayoutTemplate className="h-8 w-8 text-indigo-500 dark:text-cyan-400" />,
      title: "UI/UX Design",
      description: "Beautiful interfaces with intuitive user experiences that drive engagement and conversions.",
      highlights: ["User Research", "Prototyping", "Design Systems"],
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-indigo-500 dark:text-cyan-400" />,
      title: "Mobile Development",
      description: "Cross-platform mobile apps that work seamlessly on iOS and Android.",
      highlights: ["React Native", "Performance Tuning", "Native Features"],
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-indigo-500 dark:text-cyan-400" />,
      title: "Data Visualization",
      description: "Interactive dashboards and charts that make complex data understandable.",
      highlights: ["D3.js", "Chart.js", "Custom Solutions"],
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: <Cpu className="h-8 w-8 text-indigo-500 dark:text-cyan-400" />,
      title: "API Development",
      description: "Robust backend services and RESTful APIs to power your applications.",
      highlights: ["Node.js", "GraphQL", "Authentication"],
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-500 dark:text-cyan-400" />,
      title: "Performance Optimization",
      description: "Make your existing applications faster and more efficient.",
      highlights: ["Lighthouse 100%", "Bundle Analysis", "Caching Strategies"],
      color: "from-rose-500 to-pink-600",
    },
  ]

  return (
    <section id="services" className="relative py-24 sm:py-32 overflow-hidden" ref={containerRef}>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 -right-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{
            y: [0, 30, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header with enhanced animation */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-indigo-500/10 text-indigo-500 dark:bg-cyan-400/10 dark:text-cyan-400 hover:bg-indigo-500/20 dark:hover:bg-cyan-400/20 border-indigo-500/20 dark:border-cyan-400/20">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                What I Offer
              </Badge>
            </motion.div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                My Services
              </span>
            </h2>

            <motion.div
              className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>

          {/* Services Grid with enhanced animations and interactions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative overflow-hidden rounded-xl border border-sky-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 hover:border-indigo-300 dark:hover:border-cyan-400 transition-all"
              >
                {/* Animated gradient background */}
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Glowing border effect on hover */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-xl opacity-30 blur-sm" />
                  </motion.div>
                )}

                {/* Icon with animated background */}
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-lg bg-indigo-100/50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-gray-700/80 transition-colors">
                    {service.icon}
                  </div>
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>

                {/* Highlights with animated checkmarks */}
                <ul className="space-y-2 mb-4">
                  {service.highlights.map((highlight, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <CheckCircle className="h-4 w-4 text-indigo-500 dark:text-cyan-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{highlight}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Learn more link with animation */}
                <div className="mt-auto pt-2">
                  <motion.a
                    href="#"
                    className="inline-flex items-center text-sm text-indigo-600 dark:text-cyan-400 hover:underline group-hover:translate-x-1 transition-transform"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
