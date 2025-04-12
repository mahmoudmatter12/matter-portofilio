"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Rocket, ArrowRight, Satellite } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -left-[20%] -top-[20%] h-[60%] w-[60%] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-[20%] -bottom-[20%] h-[60%] w-[60%] rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      {/* Animated satellite */}
      <motion.div
        animate={{
          rotate: 360,
          x: ["0%", "5%", "0%", "-5%", "0%"],
          y: ["0%", "10%", "20%", "10%", "0%"],
        }}
        transition={{
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
          x: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute left-1/4 top-1/4 z-0 text-sky-400/30"
      >
        <Satellite className="h-16 w-16" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center justify-center rounded-full bg-sky-500/10 px-6 py-2 text-sm font-medium text-sky-400 ring-1 ring-inset ring-sky-400/20"
        >
          <Rocket className="mr-2 h-4 w-4" />
          404 Error
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl"
        >
          Lost in <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Space</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-gray-400"
        >
          The page youre looking for doesnt exist or has been moved. Lets get you back on track!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <Button asChild className="group bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:from-sky-600 hover:to-cyan-500">
            <Link href="/">
              Return Home
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Grid pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-sky-400/10"></div>
          <div className="h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transform bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      </div>

      {/* Floating stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -20],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute h-0.5 w-0.5 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}