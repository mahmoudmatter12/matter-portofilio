"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Construction, Save, Calendar, AlertTriangle, CheckCircle, Loader2, Settings, Clock, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"

interface IsDevelopmentProps {
  id: string
  isUnderDev: boolean
  dueDate: Date
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

  const getDaysUntilDue = () => {
    const now = new Date()
    const due = new Date(devStatus.dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
              Development Status
            </h1>
            <p className="text-muted-foreground text-lg">Control the development banner displayed on your portfolio</p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {loading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
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
          </motion.div>
        </motion.div>

        {/* Current Status Overview */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${devStatus.isUnderDev ? "from-orange-500/10 to-red-500/10" : "from-emerald-500/10 to-teal-500/10"}`}
            />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3">
                {loading ? (
                  <Skeleton className="h-6 w-6 rounded-full" />
                ) : (
                  <motion.div
                    className={`p-2 rounded-lg ${devStatus.isUnderDev ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"} shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {devStatus.isUnderDev ? (
                      <AlertTriangle className="h-5 w-5 text-white" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-white" />
                    )}
                  </motion.div>
                )}
                <span className="text-xl font-semibold">Current Status</span>
              </CardTitle>
              <CardDescription className="text-base">
                {loading ? (
                  <Skeleton className="h-4 w-3/4" />
                ) : devStatus.isUnderDev ? (
                  "Your portfolio is currently showing as under development"
                ) : (
                  "Your portfolio is live and fully operational"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap items-center gap-4">
                {loading ? (
                  <Skeleton className="h-6 w-24 rounded-full" />
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Badge
                      className={
                        devStatus.isUnderDev
                          ? "bg-orange-500/20 text-orange-600 border-orange-500/30 shadow-orange-500/20 px-3 py-1"
                          : "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 shadow-emerald-500/20 px-3 py-1"
                      }
                    >
                      {devStatus.isUnderDev ? "Under Development" : "Live"}
                    </Badge>
                  </motion.div>
                )}
                {loading ? (
                  <Skeleton className="h-6 w-32 rounded-full" />
                ) : devStatus.isUnderDev ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2 px-3 py-1 border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                    >
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(devStatus.dueDate).toLocaleDateString()}
                      <span className="text-xs">({getDaysUntilDue()} days)</span>
                    </Badge>
                  </motion.div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Development Settings */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {loading ? (
                  <Skeleton className="h-6 w-6 rounded-full" />
                ) : (
                  <motion.div
                    className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Settings className="h-5 w-5 text-white" />
                  </motion.div>
                )}
                <span className="text-xl font-semibold">Development Settings</span>
              </CardTitle>
              <CardDescription className="text-base">
                {loading ? <Skeleton className="h-4 w-2/3" /> : "Configure the development status and completion date"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <motion.div
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-100 dark:border-purple-900/50"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Construction className="h-4 w-4 text-purple-600" />
                    Development Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {loading ? <Skeleton className="h-4 w-48" /> : "Show development banner on the website"}
                  </p>
                </div>
                {loading ? (
                  <Skeleton className="h-6 w-11 rounded-full" />
                ) : (
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Switch
                      checked={devStatus.isUnderDev}
                      onCheckedChange={(checked) => setDevStatus((prev) => ({ ...prev, isUnderDev: checked }))}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                    />
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="space-y-3"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: devStatus.isUnderDev ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor="dueDate" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  Expected Completion Date
                </Label>
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
                    disabled={!devStatus.isUnderDev}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 disabled:opacity-50"
                  />
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {loading ? (
                    <Skeleton className="h-3 w-3/4" />
                  ) : (
                    "This date will be displayed on the development banner with a countdown timer"
                  )}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        <AnimatePresence>
          {!loading && devStatus.isUnderDev && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Construction className="h-5 w-5 text-white" />
                    </motion.div>
                    Preview
                  </CardTitle>
                  <CardDescription>This is how the development banner will appear on your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="border rounded-xl p-6 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-200 dark:border-orange-800"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                        >
                          <Construction className="h-6 w-6 text-orange-500" />
                        </motion.div>
                        <div className="text-center sm:text-left">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30 mb-2 px-3 py-1">
                              Under Development
                            </Badge>
                          </motion.div>
                          <h3 className="font-semibold text-orange-900 dark:text-orange-100 text-base sm:text-lg">
                            Portfolio is currently under development
                          </h3>
                          <p className="text-sm text-orange-800 dark:text-orange-200">
                            Working hard to bring you an amazing experience!
                          </p>
                        </div>
                      </div>
                      <motion.div
                        className="flex items-center gap-2 text-orange-700 dark:text-orange-300 text-sm bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">ETA: {devStatus.dueDate.toLocaleDateString()}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {getDaysUntilDue()} days
                        </Badge>
                      </motion.div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
