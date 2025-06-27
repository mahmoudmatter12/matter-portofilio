"use client"
import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { Award, ExternalLink, Calendar, Building, CheckCircle, AlertTriangle, Clock, Shield } from "lucide-react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Badge } from "@/components/ui/badge"
import { MyLink } from "./MyLink"
import { Certification } from "@/types/certificates"

enum CertificationStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
  REVOKED = "REVOKED",
}

// Get status color and icon
function getStatusInfo(status: CertificationStatus): { color: string; icon: React.ReactNode; label: string } {
  switch (status) {
    case CertificationStatus.ACTIVE:
      return {
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle className="h-3 w-3" />,
        label: "Active",
      }
    case CertificationStatus.EXPIRED:
      return {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: <AlertTriangle className="h-3 w-3" />,
        label: "Expired",
      }
    case CertificationStatus.PENDING:
      return {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: <Clock className="h-3 w-3" />,
        label: "Pending",
      }
    case CertificationStatus.REVOKED:
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        icon: <Shield className="h-3 w-3" />,
        label: "Revoked",
      }
    default:
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        icon: <Clock className="h-3 w-3" />,
        label: "Unknown",
      }
  }
}

// Format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Check if certification is expiring soon (within 30 days)
function isExpiringSoon(expiryDate?: Date): boolean {
  if (!expiryDate) return false
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  return new Date(expiryDate) <= thirtyDaysFromNow && new Date(expiryDate) > now
}

// Loading skeleton for certification card
const CertificationCardSkeleton = React.memo(({ index }: { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="group relative p-6 rounded-xl border border-sky-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
        </div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
      </div>
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
      </div>
    </motion.div>
  )
})

CertificationCardSkeleton.displayName = "CertificationCardSkeleton"

// Certification card component
const CertificationCard = React.memo(({ certification, index }: { certification: Certification; index: number }) => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  })

  const statusInfo = getStatusInfo(certification.status as CertificationStatus)
  const expiringSoon = isExpiringSoon(certification.expiryDate)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="group relative p-6 rounded-xl border border-sky-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-indigo-300 dark:hover:border-cyan-400 transition-all overflow-hidden"
    >
      {/* Certification content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Certificate icon */}
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg">
            <Award className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{certification.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <Building className="h-3 w-3" />
              {certification.issuer}
            </p>
          </div>
          {/* Status badge */}
          <Badge className={statusInfo.color}>
            {statusInfo.icon}
            <span className="ml-1">{statusInfo.label}</span>
          </Badge>
        </div>

        {/* Description */}
        {certification.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{certification.description}</p>
        )}

        {/* Skills */}
        {certification.skills && certification.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {certification.skills.slice(0, 3).map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {certification.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{certification.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Dates and actions */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Issued {formatDate(certification.issueDate)}</span>
          </div>
          {certification.expiryDate && (
            <div className={`flex items-center gap-1 ${expiringSoon ? "text-yellow-600 dark:text-yellow-400" : ""}`}>
              <Calendar className="h-3 w-3" />
              <span>Expires {formatDate(certification.expiryDate)}</span>
            </div>
          )}
        </div>

        {/* Credential info */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            {certification.credentialId && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">ID:</span> {certification.credentialId}
              </div>
            )}
            {certification.credentialUrl && (
              <MyLink
                href={certification.credentialUrl}
                target="_blank"
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-cyan-400 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Verify
              </MyLink>
            )}
          </div>
        </div>

        {/* Expiring soon warning */}
        {expiringSoon && (
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Expires soon
            </p>
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
})

CertificationCard.displayName = "CertificationCard"

// Status section component
const StatusSection = React.memo(
  ({
    status,
    certifications,
    index,
  }: {
    status: CertificationStatus
    certifications: Certification[]
    index: number
  }) => {
    const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      once: true,
    })

    const statusInfo = getStatusInfo(status)

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.1 * index, duration: 0.6 }}
        className="mb-12"
      >
        {/* Status header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg">
            {statusInfo.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{statusInfo.label} Certifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{certifications.length} certifications</p>
          </div>
        </div>

        {/* Certifications grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((certification, certIndex) => (
            <CertificationCard key={certification.id} certification={certification} index={certIndex} />
          ))}
        </div>
      </motion.div>
    )
  },
)

StatusSection.displayName = "StatusSection"

interface CertificationsOptProps {
  certifications: Certification[]
  loading: boolean
}

export function CertificationsOpt({ certifications, loading }: CertificationsOptProps) {
  // Group certifications by status
  const certificationsByStatus = useMemo(() => {
    const grouped = certifications.reduce(
      (acc, certification) => {
        if (!acc[certification.status]) {
          acc[certification.status] = []
        }
        acc[certification.status].push(certification)
        return acc
      },
      {} as Record<CertificationStatus, Certification[]>,
    )

    // Sort certifications within each status by issue date (newest first)
    Object.keys(grouped).forEach((status) => {
      grouped[status as CertificationStatus].sort(
        (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
      )
    })

    return grouped
  }, [certifications])

  // Memoize the background elements
  const BackgroundElements = useMemo(
    () => (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl animate-float" />
      </div>
    ),
    [],
  )

  // Section intersection observer
  const [sectionRef, isSectionInView] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    once: true,
  })

  // Get statistics
  const stats = useMemo(() => {
    const total = certifications.length
    const active = certifications.filter((c) => c.status === CertificationStatus.ACTIVE).length
    const expiringSoon = certifications.filter((c) => isExpiringSoon(c.expiryDate)).length
    const expired = certifications.filter((c) => c.status === CertificationStatus.EXPIRED).length

    return { total, active, expiringSoon, expired }
  }, [certifications])

  return (
    <section id="certifications" className="relative py-24 sm:py-32 overflow-hidden" ref={sectionRef}>
      {/* Background elements */}
      {BackgroundElements}

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Certifications & Credentials
              </span>
            </h2>
            <div className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Professional certifications and credentials that validate my expertise
            </p>

            {/* Quick stats */}
            {!loading && stats.total > 0 && (
              <div className="mt-8 flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-cyan-400">{stats.total}</div>
                  <div className="text-gray-500 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <div className="text-gray-500 dark:text-gray-400">Active</div>
                </div>
                {stats.expiringSoon > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
                    <div className="text-gray-500 dark:text-gray-400">Expiring Soon</div>
                  </div>
                )}
              </div>
            )}
          </div>

         

          {/* Loading state */}
          {loading && (
            <div className="space-y-12">
              {Array.from({ length: 2 }).map((_, statusIndex) => (
                <div key={statusIndex}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    <div>
                      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, certIndex) => (
                      <CertificationCardSkeleton key={certIndex} index={certIndex} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && certifications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No certifications found.</p>
            </div>
          )}

          {/* Certifications by status */}
          {!loading && certifications.length > 0 && (
            <div className="space-y-8">
              {/* Show active certifications first, then others */}
              {[CertificationStatus.ACTIVE, CertificationStatus.PENDING, CertificationStatus.EXPIRED].map(
                (status, index) => {
                  const statusCertifications = certificationsByStatus[status]
                  if (!statusCertifications || statusCertifications.length === 0) return null

                  return (
                    <StatusSection key={status} status={status} certifications={statusCertifications} index={index} />
                  )
                },
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
