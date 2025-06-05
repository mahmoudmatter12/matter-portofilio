"use client"
import { useState, useRef } from "react"
import type React from "react"

import { motion, useInView } from "framer-motion"
import { Mail, MessageSquare, Send, ArrowRight, Phone, MapPin, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { toast } from "sonner"

export function NewContact() {
  const isMobile = useMobile()
  const formRef = useRef<HTMLFormElement>(null)
  const isInView = useInView(formRef, { once: true, amount: 0.3 })

  const [contactMethod, setContactMethod] = useState<"email" | "whatsapp">("email")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "", // Added title field for our database schema
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (contactMethod === "email") {
        // Send to our database API endpoint instead of email API
        const response = await fetch("/api/messages/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            title: formData.title,
            details: formData.message, // Map message to details for our database schema
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to send message")
        }
      } else {
        const whatsappUrl = `https://wa.me/+201100108253?text=${encodeURIComponent(
          `Hi, my name is ${formData.name}. ${formData.message}`,
        )}`
        window.open(whatsappUrl, "_blank")
      }

      setSubmitSuccess(true)
      setFormData({ name: "", email: "", title: "", message: "" })
      toast("Message sent successfully!", {
        duration: 3000,
        icon: <Send className="h-4 w-4" />,
        style: {
          backgroundColor: "rgba(40, 167, 69, 0.9)", // green success color with opacity
          color: "rgba(255, 255, 255, 0.9)", // white color with opacity
          borderRadius: "8px",
          padding: "16px",
          fontSize: "16px",
          fontWeight: "500",
          textAlign: "center",
        },
      })
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error: " + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Contact information
  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />,
      title: "Email",
      value: "mahmoodgamal045@gmail.com",
      href: "mailto:mahmoodgamal045@gmail.com",
    },
    {
      icon: <Phone className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />,
      title: "Phone",
      value: "+20 110 010 8253",
      href: "tel:+201100108253",
    },
    {
      icon: <MapPin className="h-5 w-5 text-indigo-500 dark:text-cyan-400" />,
      title: "Location",
      value: "Cairo , Egypt",
      href: "https://maps.google.com?q=Cairo,+Egypt",
    },
  ]

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl"
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
          className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
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
                Get in Touch
              </Badge>
            </motion.div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Lets Connect
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
              Choose your preferred way to reach out to me
            </p>
          </div>

          {/* Contact Grid - Two columns on desktop, one column on mobile */}
          <div className={`grid ${isMobile ? "grid-cols-1 gap-8" : "md:grid-cols-2 gap-12"}`}>
            {/* Left Column - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  I&apos;d love to hear from you
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Whether you have a question, want to start a project, or simply want to connect, feel free to reach
                  out. I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of
                  your vision.
                </p>

                {/* Contact Information Cards */}
                <div className="space-y-4 mb-8">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      className="flex items-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-sky-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-cyan-700 transition-all"
                    >
                      <div className="p-2 rounded-lg bg-indigo-100/50 dark:bg-gray-700 mr-4">{item.icon}</div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</h4>
                        <p className="text-gray-900 dark:text-white font-medium">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Availability Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 backdrop-blur-sm border border-indigo-200/50 dark:border-cyan-400/50 flex items-center"
                >
                  <span className="relative flex h-3 w-3 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p className="text-gray-800 dark:text-white">Currently available for freelance projects</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              ref={formRef as unknown as React.RefObject<HTMLDivElement>}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6 }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-sky-100 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              {/* Contact Method Toggle */}
              <div className="flex border-b border-sky-100 dark:border-gray-700">
                <button
                  onClick={() => setContactMethod("email")}
                  className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${
                    contactMethod === "email"
                      ? "text-indigo-600 dark:text-cyan-400 bg-indigo-50/50 dark:bg-gray-700"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <Mail className="h-5 w-5" />
                  Email Me
                </button>
                <button
                  onClick={() => setContactMethod("whatsapp")}
                  className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${
                    contactMethod === "whatsapp"
                      ? "text-indigo-600 dark:text-cyan-400 bg-indigo-50/50 dark:bg-gray-700"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp
                </button>
              </div>

              {/* Form Area */}
              <div className="p-6 sm:p-8">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                      <svg
                        className="h-6 w-6 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {contactMethod === "email"
                        ? "I'll get back to you via email soon."
                        : "Check your WhatsApp to continue our conversation."}
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 dark:hover:text-cyan-300"
                    >
                      Send another message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-sky-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>

                      {contactMethod === "email" && (
                        <>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2.5 rounded-lg border border-sky-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all"
                              placeholder="your@email.com"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Subject
                            </label>
                            <input
                              type="text"
                              id="title"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2.5 rounded-lg border border-sky-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all"
                              placeholder="Project Inquiry"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-sky-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="Hi there, I'd like to talk about..."
                        />
                      </div>

                      <div className="pt-2">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center justify-center px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 transition-all ${
                            isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </div>
                          ) : (
                            <>
                              {contactMethod === "email" ? "Send Email" : "Open WhatsApp"}
                              <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
