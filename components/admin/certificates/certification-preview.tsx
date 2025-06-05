"use client"

import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Building, Calendar, ExternalLink, CheckCircle, AlertTriangle, Clock, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

enum CertificationStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
  REVOKED = "REVOKED",
}

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  credentialId?: string
  credentialUrl?: string
  description?: string
  skills: string[]
  status: CertificationStatus
  createdAt: Date
  updatedAt: Date
}

interface CertificationPreviewProps {
  isOpen: boolean
  onClose: () => void
  certification: Certification | null
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

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function isExpiringSoon(expiryDate?: Date): boolean {
  if (!expiryDate) return false
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  return new Date(expiryDate) <= thirtyDaysFromNow && new Date(expiryDate) > now
}

export function CertificationPreview({ isOpen, onClose, certification }: CertificationPreviewProps) {
  if (!certification) return null

  const statusInfo = getStatusInfo(certification.status)
  const expiringSoon = isExpiringSoon(certification.expiryDate)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Certification Preview</DialogTitle>
          <DialogDescription>This is how your certification will appear on the frontend.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certification Card Preview */}
          <Card>
            <CardContent className="p-6">
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
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{certification.description}</p>
              )}

              {/* Skills */}
              {certification.skills && certification.skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Related Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {certification.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates and actions */}
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Issued {formatDate(certification.issueDate)}</span>
                </div>
                {certification.expiryDate && (
                  <div
                    className={`flex items-center gap-1 ${expiringSoon ? "text-yellow-600 dark:text-yellow-400" : ""}`}
                  >
                    <Calendar className="h-3 w-3" />
                    <span>Expires {formatDate(certification.expiryDate)}</span>
                  </div>
                )}
              </div>

              {/* Credential info */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  {certification.credentialId && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Credential ID:</span> {certification.credentialId}
                    </div>
                  )}
                  {certification.credentialUrl && (
                    <Link
                      href={certification.credentialUrl}
                      target="_blank"
                      className="flex items-center gap-1 text-xs text-indigo-600 dark:text-cyan-400 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Verify Credential
                    </Link>
                  )}
                </div>
              </div>

              {/* Expiring soon warning */}
              {expiringSoon && (
                <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs text-yellow-800 dark:text-yellow-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    This certification expires soon
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certification Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Status</h4>
              <Badge className={statusInfo.color}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.label}</span>
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Validity</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {certification.expiryDate ? `Valid until ${formatDate(certification.expiryDate)}` : "No expiration"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
