/* eslint-disable @typescript-eslint/no-unused-vars */
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
    User,
    Mail,
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
} from "lucide-react"
import Image from "next/image"
import { profileType } from "@/types/profile"

interface ApiResponse {
    url?: string
    secure_url?: string
    public_id?: string
    error?: string
    message?: string
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
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your personal information and social links</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Basic Information
                        </CardTitle>
                        <CardDescription>Your personal details and professional information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Avatar Upload */}
                        <div>
                            <Label>Profile Avatar</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                    <Image
                                        src={formData.avatar || "/placeholder.svg?height=80&width=80"}
                                        alt="Profile avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={isUploadingAvatar}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        placeholder="City, Country"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                placeholder="Brief description about yourself"
                            />
                        </div>

                        <div>
                            <Label htmlFor="about">About</Label>
                            <Textarea
                                id="about"
                                value={formData.about}
                                onChange={(e) => handleInputChange("about", e.target.value)}
                                placeholder="Detailed description about yourself, your experience, and interests"
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Contact Information
                        </CardTitle>
                        <CardDescription>Your contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Email addresses */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Email Addresses</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("email")}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Email
                                </Button>
                            </div>
                            {formData.email.map((email, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={email}
                                        onChange={(e) => handleArrayChange("email", index, e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("email", index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Phone numbers */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Phone Numbers</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("phone")}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Phone
                                </Button>
                            </div>
                            {(formData.phone ?? []).map((phone, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={phone}
                                            onChange={(e) => handleArrayChange("phone", index, e.target.value)}
                                            placeholder="+1 (555) 123-4567"
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("phone", index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Professional Information
                        </CardTitle>
                        <CardDescription>Your professional roles and expertise</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Professions/Roles</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("professions")}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Profession
                                </Button>
                            </div>
                            {(formData.professions ?? []).map((profession, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={profession}
                                        onChange={(e) => handleArrayChange("professions", index, e.target.value)}
                                        placeholder="e.g., Full Stack Developer"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeArrayItem("professions", index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* CV Upload */}
                        <div>
                            <Label>CV/Resume</Label>
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => cvInputRef.current?.click()}
                                        disabled={isUploadingCV}
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
                                    {formData.CV && (
                                        <Button type="button" variant="ghost" onClick={() => window.open(formData.CV, "_blank")}>
                                            <FileText className="h-4 w-4 mr-2" />
                                            View Current CV
                                        </Button>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">Upload your CV/Resume (PDF only, max 10MB)</p>
                                <input ref={cvInputRef} type="file" accept=".pdf" onChange={handleCVUpload} className="hidden" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Social Links
                        </CardTitle>
                        <CardDescription>Your online presence and social media profiles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="github">GitHub</Label>
                                <div className="relative">
                                    <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="github"
                                        value={formData.github}
                                        onChange={(e) => handleInputChange("github", e.target.value)}
                                        placeholder="https://github.com/username"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="linkedin"
                                        value={formData.linkedin}
                                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="facebook">Facebook</Label>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="facebook"
                                        value={formData.facebook}
                                        onChange={(e) => handleInputChange("facebook", e.target.value)}
                                        placeholder="https://facebook.com/username"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="instagram">Instagram</Label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="instagram"
                                        value={formData.instagram}
                                        onChange={(e) => handleInputChange("instagram", e.target.value)}
                                        placeholder="https://instagram.com/username"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
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
                </div>
            </form>
        </div>
    )
}
