"use client"
import { useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MyLink } from "./MyLink"
import { useMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Code, Monitor, Server, Sparkles, ArrowRight,  ExternalLink } from "lucide-react"

export function About() {
    const isMobile = useMobile()
    const [isHovered, setIsHovered] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    })

    const y = useTransform(scrollYProgress, [0, 1], [100, -100])

    // Calculate years of experience dynamically
    const yearsOfExperience = new Date().getFullYear() - 2023

    // Personal achievements/facts
    const personalFacts = [
        { icon: <Code className="w-4 h-4" />, text: `${yearsOfExperience}+ years of coding experience` },
        { icon: <Monitor className="w-4 h-4" />, text: "10+ successful projects delivered" },
        { icon: <Server className="w-4 h-4" />, text: "Full-stack development expertise" },
        { icon: <Sparkles className="w-4 h-4" />, text: "Passionate about clean, efficient code" },
    ]

    return (
        <section id="about" className="relative py-24 sm:py-32 overflow-hidden" ref={containerRef}>
            {/* Enhanced floating background elements */}
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl animate-float-slow" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-float" />
            <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl animate-float-slow" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Section Header with enhanced animation */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Badge className="mb-4 bg-indigo-500/10 text-indigo-500 dark:bg-cyan-400/10 dark:text-cyan-400 hover:bg-indigo-500/20 dark:hover:bg-cyan-400/20 border-indigo-500/20 dark:border-cyan-400/20">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Get to know me
                        </Badge>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                                About Me
                            </span>
                        </h2>
                        <motion.div
                            className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                            initial={{ width: 0, opacity: 0 }}
                            whileInView={{ width: 80, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />
                    </motion.div>

                    {/* Content Grid - Responsive layout */}
                    <div className={`grid ${isMobile ? "grid-cols-1 gap-10" : "md:grid-cols-2 gap-12"} items-start`}>
                        {/* Left Column - Enhanced Profile Picture */}
                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ y: isMobile ? 0 : y }}
                        >
                            <div
                                className="relative group"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {/* Decorative elements */}
                                <div className="absolute -inset-4 rounded-2xl border border-indigo-500/20 dark:border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Main image container */}
                                <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] rounded-2xl overflow-hidden border-2 border-indigo-500/20 dark:border-cyan-400/20 shadow-lg transition-all duration-500 group-hover:border-indigo-500/50 dark:group-hover:border-cyan-400/50 group-hover:shadow-indigo-500/10 dark:group-hover:shadow-cyan-400/10">
                                    <Image
                                        src="/acpc.jpg" // Your image path
                                        alt="Mahmoud Gamal Talat matter"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 320px"
                                        priority
                                    />

                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Image caption that appears on hover */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 p-4 text-white"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <p className="text-sm font-medium">Mahmoud Gamal Talat</p>
                                                <p className="text-xs text-gray-300">Full-Stack Developer</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Floating badges */}
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 border border-indigo-500/20 dark:border-cyan-400/20"
                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                >
                                    <Code className="w-5 h-5 text-indigo-500 dark:text-cyan-400" />
                                </motion.div>

                                <motion.div
                                    className="absolute -bottom-2 -left-4 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 border border-indigo-500/20 dark:border-cyan-400/20"
                                    initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                >
                                    <Monitor className="w-5 h-5 text-indigo-500 dark:text-cyan-400" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Column - Enhanced Text Content */}
                        <div className="md:col-span-1">
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <motion.p
                                    className="text-lg leading-8 text-gray-600 dark:text-gray-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    I&apos;m a passionate developer with {yearsOfExperience}+ years of experience crafting digital
                                    experiences. My journey in tech started when I built my first website at 15, and I&apos;ve been hooked
                                    ever since.
                                </motion.p>

                                <motion.p
                                    className="text-lg leading-8 text-gray-600 dark:text-gray-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    I specialize in modern web technologies like{" "}
                                    <span className="text-indigo-600 dark:text-cyan-400 font-medium">Next.js</span>,{" "}
                                    <span className="text-indigo-600 dark:text-cyan-400 font-medium">React</span>, and{" "}
                                    <span className="text-indigo-600 dark:text-cyan-400 font-medium">Tailwind CSS</span>, with a strong
                                    focus on creating performant, accessible, and visually stunning applications.
                                </motion.p>

                                {/* Personal facts/achievements */}
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                >
                                    {personalFacts.map((fact, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-indigo-500 dark:text-cyan-400">
                                                {fact.icon}
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300">{fact.text}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Call to action buttons */}
                                <motion.div
                                    className="flex flex-wrap gap-4 pt-4"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.7, duration: 0.6 }}
                                >
                                    <MyLink
                                        href="#contact"
                                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-cyan-500/20 transition-all inline-flex items-center gap-2"
                                    >
                                        <span>Let&apos;s connect</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </MyLink>

                                    <MyLink
                                        href="https://drive.google.com/file/d/1tNdQaAuuFpFNnjGXgVgypPbthZT5MIOH/view?usp=sharing"
                                        className="px-6 py-2.5 rounded-full border-2 border-indigo-500 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-gray-800/50 transition-all inline-flex items-center gap-2"
                                        target="_blank"
                                    >
                                        <span>View CV</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </MyLink>
                                </motion.div>

                                {/* Social proof or additional info */}
                                <motion.div
                                    className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <span>Currently open to new opportunities</span>
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
