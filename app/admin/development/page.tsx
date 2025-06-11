"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Construction, Save, Calendar, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface IsDevelopmentProps {
    id: string
    isUnderDev: boolean
    dueDate: Date
}

export default function DevelopmentPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    const [devStatus, setDevStatus] = useState<IsDevelopmentProps>({
        id: "",
        isUnderDev: false,
        dueDate: new Date(),
    })

    useEffect(() => {
        const fetchDevStatus = async () => {
            try {
                const response = await fetch("/api/development-status")
                if (response.ok) {
                    const data = await response.json()
                    setDevStatus({
                        ...data[0],
                        dueDate: new Date(data[0].dueDate),
                    })
                }
            } catch (error) {
                console.error("Error fetching development status:", error)
                toast({
                    title: "Error",
                    description: "Failed to load development status",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchDevStatus()
    }, [toast])

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch(`/api/development-status/${devStatus.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...devStatus,
                    dueDate: devStatus.dueDate.toISOString(),
                }),
            })

            if (response.ok) {
                const updatedData = await response.json()
                setDevStatus({
                    ...updatedData,
                    dueDate: new Date(updatedData.dueDate),
                })
                toast({
                    title: "Success",
                    description: "Development status updated successfully",
                })
            } else {
                throw new Error("Failed to save development status")
            }
        } catch (error) {
            console.error("Error saving development status:", error)
            toast({
                title: "Error",
                description: "Failed to save development status. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const formatDateForInput = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="justify-between flex items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Development Status</h1>
                    <p className="text-muted-foreground">Control the development banner displayed on your portfolio</p>
                </div>
                {/* Save Button */}
                <div className="flex justify-end">
                    {loading ? (
                        <Skeleton className="h-10 w-32" />
                    ) : (
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Current Status Overview */}
            <Card className="bg-sky-700/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {loading ? (
                            <Skeleton className="h-5 w-5 rounded-full" />
                        ) : devStatus.isUnderDev ? (
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                        ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        Current Status
                    </CardTitle>
                    <CardDescription className="text-white/80">
                        {loading ? (
                            <Skeleton className="h-4 w-3/4" />
                        ) : devStatus.isUnderDev ? (
                            "Your portfolio is currently showing as under development"
                        ) : (
                            "Your portfolio is live and fully operational"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {loading ? (
                            <Skeleton className="h-6 w-24 rounded-full" />
                        ) : (
                            <Badge
                                className={
                                    devStatus.isUnderDev
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                }
                            >
                                {devStatus.isUnderDev ? "Under Development" : "Live"}
                            </Badge>
                        )}
                        {loading ? (
                            <Skeleton className="h-6 w-32 rounded-full" />
                        ) : devStatus.isUnderDev ? (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(devStatus.dueDate).toLocaleDateString()}
                            </Badge>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            {/* Development Settings */}
            <Card className="bg-sky-700/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {loading ? <Skeleton className="h-5 w-5 rounded-full" /> : <Construction className="h-5 w-5" />}
                        Development Settings
                    </CardTitle>
                    <CardDescription>
                        {loading ? <Skeleton className="h-4 w-2/3" /> : "Configure the development status and completion date"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Development Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                {loading ? <Skeleton className="h-4 w-48" /> : "Show development banner on the website"}
                            </p>
                        </div>
                        {loading ? (
                            <Skeleton className="h-6 w-11 rounded-full" />
                        ) : (
                            <Switch
                                checked={devStatus.isUnderDev}
                                onCheckedChange={(checked) => setDevStatus((prev) => ({ ...prev, isUnderDev: checked }))}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Expected Completion Date</Label>
                        {loading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Input
                                id="dueDate"
                                type="datetime-local"
                                value={formatDateForInput(devStatus.dueDate)}
                                onChange={(e) =>
                                    setDevStatus((prev) => ({
                                        ...prev,
                                        dueDate: new Date(e.target.value),
                                    }))
                                }
                            />
                        )}
                        <p className="text-xs text-muted-foreground">
                            {loading ? (
                                <Skeleton className="h-3 w-3/4" />
                            ) : (
                                "This date will be displayed on the development banner with a countdown timer"
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            {loading ? (
                <Card className="bg-sky-700/20">
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-3/4" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </CardContent>
                </Card>
            ) : devStatus.isUnderDev ? (
                <Card className="bg-sky-700/20">
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>This is how the development banner will appear on your website</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Construction className="h-5 w-5 text-orange-500" />
                                    <div className="text-center sm:text-left">
                                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 mb-2">
                                            Under Development
                                        </Badge>
                                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 text-sm sm:text-base">
                                            Portfolio is currently under development
                                        </h3>
                                        <p className="text-sm text-orange-800 dark:text-orange-200">
                                            Working hard to bring you an amazing experience!
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span>ETA: {devStatus.dueDate.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : null}

        </div>
    )
}