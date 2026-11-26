"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { ToastProvider } from "@/components/toast-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  )
}
