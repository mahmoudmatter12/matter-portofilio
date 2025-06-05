import { CertificationStatus } from "@prisma/client"

export interface Certification {
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