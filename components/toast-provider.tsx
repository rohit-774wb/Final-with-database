"use client"

import { CheckCircle2, X, XCircle } from "lucide-react"
import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error"
interface Toast {
  id: number
  type: ToastType
  message: string
}

const ToastContext = createContext<((message: string, type?: ToastType) => void) | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, type, message }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 items-start gap-3 rounded-xl border bg-card p-3 text-sm text-card-foreground shadow-lift",
            )}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            )}
            <p className="flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx
}
