/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  RefreshCcw,
  Award,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { CertificationForm } from "@/components/admin/certificates/certification-form"
import { CertificationPreview } from "@/components/admin/certificates/certification-preview"
import { motion, AnimatePresence } from "framer-motion"

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

function getStatusBadgeColor(status: CertificationStatus): string {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20",
    EXPIRED: "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20",
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20",
    REVOKED: "bg-gray-500/20 text-gray-400 border-gray-500/30 shadow-gray-500/20",
  }
  return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

function formatStatusName(status: CertificationStatus): string {
  return status.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function isExpiringSoon(expiryDate?: Date): boolean {
  if (!expiryDate) return false
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  return new Date(expiryDate) <= thirtyDaysFromNow && new Date(expiryDate) > now
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export default function CertificationsAdminPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterIssuer, setFilterIssuer] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [deletingCertification, setDeletingCertification] = useState<Certification | null>(null)
  const [previewCertification, setPreviewCertification] = useState<Certification | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const { toast } = useToast()

  // Fetch certifications
  const fetchCertifications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/certifications")
      if (!response.ok) {
        throw new Error("Failed to fetch certifications")
      }
      const data = await response.json()
      setCertifications(data)
    } catch (error) {
      console.error("Error fetching certifications:", error)
      toast({
        title: "Error",
        description: "Failed to fetch certifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertifications()
  }, [])

  // Get unique issuers for filter
  const uniqueIssuers = Array.from(new Set(certifications.map((cert) => cert.issuer))).sort()

  // Filter and search certifications
  const filteredCertifications = certifications.filter((certification) => {
    const matchesSearch =
      certification.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || certification.status === filterStatus
    const matchesIssuer = filterIssuer === "all" || certification.issuer === filterIssuer

    return matchesSearch && matchesStatus && matchesIssuer
  })

  // Handle create certification
  const handleCreateCertification = async (
    certificationData: Omit<Certification, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      setFormLoading(true)
      const response = await fetch("/api/certifications/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certificationData),
      })

      if (!response.ok) {
        throw new Error("Failed to create certification")
      }

      const newCertification = await response.json()
      setCertifications([...certifications, newCertification])
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Certification created successfully",
      })
    } catch (error) {
      console.error("Error creating certification:", error)
      toast({
        title: "Error",
        description: "Failed to create certification",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Handle edit certification
  const handleEditCertification = async (certificationData: Omit<Certification, "id" | "createdAt" | "updatedAt">) => {
    if (!editingCertification) return

    try {
      setFormLoading(true)
      const response = await fetch(`/api/certifications/${editingCertification.id}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certificationData),
      })

      if (!response.ok) {
        throw new Error("Failed to update certification")
      }

      const updatedCertification = await response.json()
      setCertifications(
        certifications.map((cert) => (cert.id === editingCertification.id ? updatedCertification : cert)),
      )
      setEditingCertification(null)
      setIsFormOpen(false)
      toast({
        title: "Success",
        description: "Certification updated successfully",
      })
    } catch (error) {
      console.error("Error updating certification:", error)
      toast({
        title: "Error",
        description: "Failed to update certification",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Handle delete certification
  const handleDeleteCertification = async (certification: Certification) => {
    try {
      const response = await fetch(`/api/certifications/${certification.id}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete certification")
      }

      setCertifications(certifications.filter((c) => c.id !== certification.id))
      setDeletingCertification(null)
      toast({
        title: "Success",
        description: "Certification deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting certification:", error)
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      })
    }
  }

  // Handle form submission
  const handleFormSubmit = (certificationData: Omit<Certification, "id" | "createdAt" | "updatedAt">) => {
    if (editingCertification) {
      handleEditCertification(certificationData)
    } else {
      handleCreateCertification(certificationData)
    }
  }

  // handle refresh
  const handleRefresh = () => {
    fetchCertifications()
    setSearchTerm("")
    setFilterStatus("all")
  }

  // Open create form
  const openCreateForm = () => {
    setEditingCertification(null)
    setIsFormOpen(true)
  }

  // Open edit form
  const openEditForm = (certification: Certification) => {
    setEditingCertification(certification)
    setIsFormOpen(true)
  }

  // Close form
  const closeForm = () => {
    setIsFormOpen(false)
    setEditingCertification(null)
  }

  // Calculate statistics
  const stats = {
    total: certifications.length,
    active: certifications.filter((c) => c.status === CertificationStatus.ACTIVE).length,
    expired: certifications.filter((c) => c.status === CertificationStatus.EXPIRED).length,
    expiringSoon: certifications.filter((c) => isExpiringSoon(c.expiryDate)).length,
  }

  return (
    <motion.div
      className="p-6 min-h-screen  "
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="space-y-6 ">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
              Certifications
            </h1>
            <p className="text-muted-foreground text-lg">Manage your professional certifications and credentials.</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={openCreateForm}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Certification
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50 bg-transparent"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6" variants={containerVariants}>
          {[
            { title: "Total Certifications", value: stats.total, icon: Award, gradient: "from-blue-500 to-cyan-500" },
            { title: "Active", value: stats.active, icon: TrendingUp, gradient: "from-emerald-500 to-teal-500" },
            { title: "Expired", value: stats.expired, icon: AlertTriangle, gradient: "from-red-500 to-pink-500" },
            {
              title: "Expiring Soon",
              value: stats.expiringSoon,
              icon: Calendar,
              gradient: "from-yellow-500 to-orange-500",
            },
          ].map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <motion.div
                    className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                Filter & Search
              </CardTitle>
              <CardDescription>Find specific certifications using filters and search.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search certifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.values(CertificationStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatStatusName(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterIssuer} onValueChange={setFilterIssuer}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by issuer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Issuers</SelectItem>
                      {uniqueIssuers.map((issuer) => (
                        <SelectItem key={issuer} value={issuer}>
                          {issuer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications Table */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Certifications ({filteredCertifications.length})
              </CardTitle>
              <CardDescription>A list of all your certifications with quick actions.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
              ) : filteredCertifications.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-4">
                    {searchTerm || filterStatus !== "all" || filterIssuer !== "all"
                      ? "No certifications match your search criteria."
                      : "No certifications found. Create your first certification!"}
                  </p>
                  {!searchTerm && filterStatus === "all" && filterIssuer === "all" && (
                    <Button
                      onClick={openCreateForm}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Certification
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="rounded-lg border border-purple-100 dark:border-purple-900/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Issuer</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Issue Date</TableHead>
                        <TableHead className="font-semibold">Expiry Date</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredCertifications.map((certification, index) => (
                          <motion.tr
                            key={certification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors duration-200"
                          >
                            <TableCell className="font-medium">
                              <div>
                                <div className="max-w-48 truncate font-semibold" title={certification.name}>
                                  {certification.name}
                                </div>
                                {certification.credentialId && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    ID: {certification.credentialId}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-32 truncate font-medium" title={certification.issuer}>
                                {certification.issuer}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusBadgeColor(certification.status)}>
                                  {formatStatusName(certification.status)}
                                </Badge>
                                {isExpiringSoon(certification.expiryDate) && (
                                  <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                                  >
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  </motion.div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {formatDate(certification.issueDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {certification.expiryDate ? (
                                <div
                                  className={`flex items-center gap-1 text-sm ${isExpiringSoon(certification.expiryDate) ? "text-yellow-600 font-medium" : ""
                                    }`}
                                >
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(certification.expiryDate)}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">No expiry</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPreviewCertification(certification)}
                                    className="hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditForm(certification)}
                                    className="hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeletingCertification(certification)}
                                    className="hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Form Modal */}
      <CertificationForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={editingCertification}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingCertification}
        onClose={() => setDeletingCertification(null)}
        onConfirm={() => deletingCertification && handleDeleteCertification(deletingCertification)}
        title={deletingCertification?.name || ""}
      />

      {/* Preview Modal */}
      <CertificationPreview
        isOpen={!!previewCertification}
        onClose={() => setPreviewCertification(null)}
        certification={previewCertification}
      />
    </motion.div>
  )
}
