"use client"

import React, { useState, useCallback, createContext, useContext } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  action?: React.ReactNode
  duration?: number
}

type ToastContextType = {
  toast: (props: Omit<ToastProps, "id">) => string
  dismiss: (id: string) => void
  toasts: ToastProps[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Toast Component
function Toast({ id, title, description, variant = "default", action, onDismiss }: ToastProps & { onDismiss: (id: string) => void }) {
  const variantStyles = {
    default: "bg-white border-gray-200 text-gray-900",
    destructive: "bg-red-50 border-red-200 text-red-900",
    success: "bg-green-50 border-green-200 text-green-900"
  }

  const iconStyles = {
    default: <Info className="w-5 h-5 text-blue-500" />,
    destructive: <AlertCircle className="w-5 h-5 text-red-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />
  }

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md w-full
      transform transition-all duration-300 ease-in-out
      ${variantStyles[variant]}
    `}>
      {iconStyles[variant]}
      
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-semibold text-sm mb-1">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
        {action && (
          <div className="mt-2">{action}</div>
        )}
      </div>
      
      <button
        onClick={() => onDismiss(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast Container
function ToastContainer({ toasts, onDismiss }: { toasts: ToastProps[], onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// Toast Provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, variant = "default", action, duration = 5000 }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant, action, duration }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto-dismiss after specified duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
      }, duration)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}