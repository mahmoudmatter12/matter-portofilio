"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Search, Filter, Calendar, AlertTriangle } from "lucide-react"
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
        ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        EXPIRED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        REVOKED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    }

    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
                        <p className="text-muted-foreground">Manage your professional certifications and credentials.</p>
                    </div>
                    <Button onClick={openCreateForm} className="w-fit">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Certification
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Certifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expired</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Search</CardTitle>
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
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger>
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
                                    <SelectTrigger>
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

                {/* Certifications Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Certifications ({filteredCertifications.length})</CardTitle>
                        <CardDescription>A list of all your certifications with quick actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                                ))}
                            </div>
                        ) : filteredCertifications.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {searchTerm || filterStatus !== "all" || filterIssuer !== "all"
                                        ? "No certifications match your search criteria."
                                        : "No certifications found. Create your first certification!"}
                                </p>
                                {!searchTerm && filterStatus === "all" && filterIssuer === "all" && (
                                    <Button onClick={openCreateForm} className="mt-4">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Certification
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Issuer</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Issue Date</TableHead>
                                            <TableHead>Expiry Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCertifications.map((certification) => (
                                            <TableRow key={certification.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="max-w-48 truncate" title={certification.name}>
                                                            {certification.name}
                                                        </div>
                                                        {certification.credentialId && (
                                                            <div className="text-xs text-muted-foreground mt-1">ID: {certification.credentialId}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-32 truncate" title={certification.issuer}>
                                                        {certification.issuer}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={getStatusBadgeColor(certification.status)}>
                                                            {formatStatusName(certification.status)}
                                                        </Badge>
                                                        {isExpiringSoon(certification.expiryDate) && (
                                                            <AlertTriangle className="h-4 w-4 text-yellow-500">
                                                                <title>Expiring soon</title>
                                                            </AlertTriangle>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(certification.issueDate)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {certification.expiryDate ? (
                                                        <div
                                                            className={`flex items-center gap-1 text-sm ${isExpiringSoon(certification.expiryDate) ? "text-yellow-600" : ""
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
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => setPreviewCertification(certification)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => openEditForm(certification)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setDeletingCertification(certification)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
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
        </div>
    )
}
