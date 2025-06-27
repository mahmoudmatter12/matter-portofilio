"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProfile } from "@/context/ProfileProvidor"
import { useToast } from "@/hooks/use-toast"
import {
    Loader2,
    Save,
    MapPin,
    Phone,
    Briefcase,
    Globe,
    Github,
    Linkedin,
    Facebook,
    Instagram,
    FileText,
    Plus,
    X,
    Upload,
    ImageIcon,
    UserCircle,
    Contact,
    Link,
} from "lucide-react"
import Image from "next/image"
import type { profileType } from "@/types/profile"
import { motion, AnimatePresence } from "framer-motion"

interface ApiResponse {
    url?: string
    secure_url?: string
    public_id?: string
    error?: string
    message?: string
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

export default function ProfilePage() {
    const { profile, loading, updateProfile } = useProfile()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [isUploadingCV, setIsUploadingCV] = useState(false)
    const avatarInputRef = useRef<HTMLInputElement>(null)
    const cvInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState<profileType>({
        id: "",
        name: "",
        email: [],
        location: "",
        bio: "",
        phone: [],
        professions: [],
        about: "",
        avatar: "",
        website: "",
        github: "",
        linkedin: "",
        facebook: "",
        instagram: "",
        CV: "",
    })

    // Update form data when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                id: profile.id || "",
                name: profile.name || "",
                email: profile.email || [],
                location: profile.location || "",
                bio: profile.bio || "",
                phone: profile.phone || [],
                professions: profile.professions || [],
                about: profile.about || "",
                avatar: profile.avatar || "",
                website: profile.website || "",
                github: profile.github || "",
                linkedin: profile.linkedin || "",
                facebook: profile.facebook || "",
                instagram: profile.instagram || "",
                CV: profile.CV || "",
            })
        }
    }, [profile])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleArrayChange = (field: string, index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: Array.isArray(prev[field as keyof typeof prev])
                ? (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => (i === index ? value : item))
                : prev[field as keyof typeof prev],
        }))
    }

    const addArrayItem = (field: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: Array.isArray(prev[field as keyof typeof prev])
                ? [...(prev[field as keyof typeof prev] as string[]), ""]
                : [""],
        }))
    }

    const removeArrayItem = (field: string, index: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: Array.isArray(prev[field as keyof typeof prev])
                ? (prev[field as keyof typeof prev] as string[]).filter((_: string, i: number) => i !== index)
                : prev[field as keyof typeof prev],
        }))
    }

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Error",
                description: "Please select a valid image file.",
                variant: "destructive",
            })
            return
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "Image size should be less than 5MB.",
                variant: "destructive",
            })
            return
        }

        setIsUploadingAvatar(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload/pic", {
                method: "POST",
                body: formData,
            })

            const result: ApiResponse = await response.json()

            if (result.error) {
                throw new Error(result.error)
            }

            const imageUrl = result.secure_url || result.url
            if (imageUrl) {
                setFormData((prev) => ({
                    ...prev,
                    avatar: imageUrl,
                }))
                toast({
                    title: "Success",
                    description: "Avatar uploaded successfully!",
                })
            }
        } catch (error) {
            console.log("Avatar upload error:", error)
            toast({
                title: "Error",
                description: "Failed to upload avatar. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (file.type !== "application/pdf") {
            toast({
                title: "Error",
                description: "Please select a PDF file for your CV.",
                variant: "destructive",
            })
            return
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "CV file size should be less than 10MB.",
                variant: "destructive",
            })
            return
        }

        setIsUploadingCV(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload/cv", {
                method: "POST",
                body: formData,
            })

            const result: ApiResponse = await response.json()

            if (result.error) {
                throw new Error(result.error)
            }

            const cvUrl = result.secure_url || result.url
            if (cvUrl) {
                setFormData((prev) => ({
                    ...prev,
                    CV: cvUrl,
                }))
                toast({
                    title: "Success",
                    description: "CV uploaded successfully!",
                })
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: "Failed to upload CV. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsUploadingCV(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Filter out empty strings from arrays
            const cleanedData = {
                ...formData,
                id: profile?.id || "no profile", // Ensure we send the existing profile ID
                email: formData.email.filter((email) => email.trim() !== ""),
                phone: (formData.phone ?? []).filter((phone) => phone.trim() !== ""),
                professions: (formData.professions ?? []).filter((profession) => profession.trim() !== ""),
            }
            console.log("Submitting profile data:", cleanedData)
            await updateProfile(cleanedData)
            toast({
                title: "Success",
                description: "Profile updated successfully!",
            })
        } catch (error) {
            console.log(error)

            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen  ">
                <motion.div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
            </div>
        )
    }

    return (
        <motion.div
            className="p-6 min-h-screen  "
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="space-y-6">
                <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
                            Profile Settings
                        </h1>
                        <p className="text-muted-foreground text-lg">Manage your personal information and social links</p>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <motion.div
                                        className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <UserCircle className="h-5 w-5 text-white" />
                                    </motion.div>
                                    <span className="text-xl font-semibold">Basic Information</span>
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Your personal details and professional information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar Upload */}
                                <div>
                                    <Label className="text-base font-medium">Profile Avatar</Label>
                                    <div className="flex items-center gap-6 mt-3">
                                        <motion.div
                                            className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200 dark:border-purple-800 shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Image
                                                src={formData.avatar || "/placeholder.svg?height=96&width=96"}
                                                alt="Profile avatar"
                                                fill
                                                className="object-cover"
                                            />
                                        </motion.div>
                                        <div className="space-y-3">
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => avatarInputRef.current?.click()}
                                                    disabled={isUploadingAvatar}
                                                    className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50"
                                                >
                                                    {isUploadingAvatar ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="h-4 w-4 mr-2" />
                                                            Upload Avatar
                                                        </>
                                                    )}
                                                </Button>
                                            </motion.div>
                                            <p className="text-sm text-muted-foreground">Upload a profile picture (JPG, PNG, max 5MB)</p>
                                        </div>
                                        <input
                                            ref={avatarInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name" className="text-base font-medium">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Your full name"
                                            className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="location" className="text-base font-medium">
                                            Location
                                        </Label>
                                        <div className="relative mt-2">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                value={formData.location}
                                                onChange={(e) => handleInputChange("location", e.target.value)}
                                                placeholder="City, Country"
                                                className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="bio" className="text-base font-medium">
                                        Bio
                                    </Label>
                                    <Input
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange("bio", e.target.value)}
                                        placeholder="Brief description about yourself"
                                        className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="about" className="text-base font-medium">
                                        About
                                    </Label>
                                    <Textarea
                                        id="about"
                                        value={formData.about}
                                        onChange={(e) => handleInputChange("about", e.target.value)}
                                        placeholder="Detailed description about yourself, your experience, and interests"
                                        rows={4}
                                        className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <motion.div
                                        className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Contact className="h-5 w-5 text-white" />
                                    </motion.div>
                                    <span className="text-xl font-semibold">Contact Information</span>
                                </CardTitle>
                                <CardDescription className="text-base">Your contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Email addresses */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-base font-medium">Email Addresses</Label>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addArrayItem("email")}
                                                className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Email
                                            </Button>
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {formData.email.map((email, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex gap-2 mb-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Input
                                                    value={email}
                                                    onChange={(e) => handleArrayChange("email", index, e.target.value)}
                                                    placeholder="email@example.com"
                                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                                />
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeArrayItem("email", index)}
                                                        className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Phone numbers */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-base font-medium">Phone Numbers</Label>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addArrayItem("phone")}
                                                className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Phone
                                            </Button>
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {(formData.phone ?? []).map((phone, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex gap-2 mb-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative flex-1">
                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        value={phone}
                                                        onChange={(e) => handleArrayChange("phone", index, e.target.value)}
                                                        placeholder="+1 (555) 123-4567"
                                                        className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                                    />
                                                </div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeArrayItem("phone", index)}
                                                        className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Professional Information */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <motion.div
                                        className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Briefcase className="h-5 w-5 text-white" />
                                    </motion.div>
                                    <span className="text-xl font-semibold">Professional Information</span>
                                </CardTitle>
                                <CardDescription className="text-base">Your professional roles and expertise</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-base font-medium">Professions/Roles</Label>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addArrayItem("professions")}
                                                className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Profession
                                            </Button>
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {(formData.professions ?? []).map((profession, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex gap-2 mb-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Input
                                                    value={profession}
                                                    onChange={(e) => handleArrayChange("professions", index, e.target.value)}
                                                    placeholder="e.g., Full Stack Developer"
                                                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                                />
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeArrayItem("professions", index)}
                                                        className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* CV Upload */}
                                <div>
                                    <Label className="text-base font-medium">CV/Resume</Label>
                                    <div className="space-y-3 mt-3">
                                        <div className="flex items-center gap-4">
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => cvInputRef.current?.click()}
                                                    disabled={isUploadingCV}
                                                    className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50"
                                                >
                                                    {isUploadingCV ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Upload CV
                                                        </>
                                                    )}
                                                </Button>
                                            </motion.div>
                                            {formData.CV && (
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => window.open(formData.CV, "_blank")}
                                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/50"
                                                    >
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        View Current CV
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Upload your CV/Resume (PDF only, max 10MB)</p>
                                        <input ref={cvInputRef} type="file" accept=".pdf" onChange={handleCVUpload} className="hidden" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <motion.div
                                        className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Link className="h-5 w-5 text-white" />
                                    </motion.div>
                                    <span className="text-xl font-semibold">Social Links</span>
                                </CardTitle>
                                <CardDescription className="text-base">Your online presence and social media profiles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="website" className="text-base font-medium">
                                            Website
                                        </Label>
                                        <div className="relative mt-2">
                                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="website"
                                                value={formData.website}
                                                onChange={(e) => handleInputChange("website", e.target.value)}
                                                placeholder="https://yourwebsite.com"
                                                className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="github" className="text-base font-medium">
                                            GitHub
                                        </Label>
                                        <div className="relative mt-2">
                                            <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="github"
                                                value={formData.github}
                                                onChange={(e) => handleInputChange("github", e.target.value)}
                                                placeholder="https://github.com/username"
                                                className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="linkedin" className="text-base font-medium">
                                            LinkedIn
                                        </Label>
                                        <div className="relative mt-2">
                                            <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="linkedin"
                                                value={formData.linkedin}
                                                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                                                placeholder="https://linkedin.com/in/username"
                                                className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="facebook" className="text-base font-medium">
                                            Facebook
                                        </Label>
                                        <div className="relative mt-2">
                                            <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="facebook"
                                                value={formData.facebook}
                                                onChange={(e) => handleInputChange("facebook", e.target.value)}
                                                placeholder="https://facebook.com/username"
                                                className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="instagram" className="text-base font-medium">
                                            Instagram
                                        </Label>
                                        <div className="relative mt-2">
                                            <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="instagram"
                                                value={formData.instagram}
                                                onChange={(e) => handleInputChange("instagram", e.target.value)}
                                                placeholder="https://instagram.com/username"
                                                className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div className="flex justify-end" variants={itemVariants}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Profile
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                </form>
            </div>
        </motion.div>
    )
}
