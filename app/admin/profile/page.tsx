"use client"

import type React from "react"

import { useState } from "react"
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
} from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
    const { profile, loading, updateProfile } = useProfile()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: profile?.name || "",
        email: profile?.email || [],
        location: profile?.location || "",
        bio: profile?.bio || "",
        phone: profile?.phone || [],
        professions: profile?.professions || [],
        about: profile?.about || "",
        avatar: profile?.avatar || "",
        website: profile?.website || "",
        github: profile?.github || "",
        linkedin: profile?.linkedin || "",
        facebook: profile?.facebook || "",
        instagram: profile?.instagram || "",
        CV: profile?.CV || "",
    })
    // Update form data when profile loads
    useState(() => {
        if (profile) {
            setFormData({
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
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleArrayChange = (field: string, index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => (i === index ? value : item)),
        }))
    }

    const addArrayItem = (field: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field as keyof typeof prev], ""],
        }))
    }

    const removeArrayItem = (field: string, index: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field as keyof typeof prev] as string[]).filter((_: string, i: number) => i !== index),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Filter out empty strings from arrays
            const cleanedData = {
                ...formData,
                id: profile?.id, // Ensure we send the existing profile ID
                email: formData.email.filter((email) => email.trim() !== ""),
                phone: formData.phone.filter((phone) => phone.trim() !== ""),
                professions: formData.professions.filter((profession) => profession.trim() !== ""),
            }
            console.log(cleanedData)

            await updateProfile(cleanedData)
            toast({
                title: "Success",
                description: "Profile updated successfully!",
            })
        } catch (error) {
            console.error("Failed to update profile:", error)
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
                        {/* Avatar Preview */}
                        {formData.avatar && (
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                    <Image
                                        src={formData.avatar || "/placeholder.svg"}
                                        alt="Profile avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <Label>Current Avatar</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Update the avatar URL below to change your profile picture
                                    </p>
                                </div>
                            </div>
                        )}

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

                        <div>
                            <Label htmlFor="avatar">Avatar URL</Label>
                            <Input
                                id="avatar"
                                value={formData.avatar}
                                onChange={(e) => handleInputChange("avatar", e.target.value)}
                                placeholder="https://example.com/your-photo.jpg"
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
                            {formData.phone.map((phone, index) => (
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
                            {formData.professions.map((profession, index) => (
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

                        <div>
                            <Label htmlFor="cv">CV/Resume URL</Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="cv"
                                    value={formData.CV}
                                    onChange={(e) => handleInputChange("CV", e.target.value)}
                                    placeholder="https://drive.google.com/file/d/your-cv"
                                    className="pl-10"
                                />
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
