"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import Alert from "@/components/alert"

type AlertType = "success" | "error" | "info"

interface AlertContextProps {
  showAlert: (title: string, message: string, type: AlertType) => void
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<
    Array<{
      id: string
      title: string
      message: string
      type: AlertType
    }>
  >([])

  const showAlert = (title: string, message: string, type: AlertType) => {
    const id = Math.random().toString(36).substring(2, 9)
    setAlerts((prev) => [...prev, { id, title, message, type }])
  }

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}

