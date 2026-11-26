"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/toast-provider"

const input =
  "mt-1 h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"

export function LoginForm() {
  const { signIn, signUp } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" })
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === "signin") {
        await signIn(form.email, form.password)
        toast("Signed in.")
        router.push("/")
      } else {
        const needsConfirm = await signUp({ ...form, phone: form.phone.replace(/\D/g, "") })
        if (needsConfirm) {
          toast("Account created. Check your email to confirm, then sign in.")
          setMode("signin")
        } else {
          toast("Account created.")
          router.push("/")
        }
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-page flex justify-center py-12">
      <form onSubmit={submit} className="card-surface w-full max-w-sm space-y-4 p-6">
        <h1 className="text-2xl font-extrabold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        {mode === "signup" && (
          <>
            <label className="block text-sm font-semibold">
              Full name
              <input required value={form.name} onChange={set("name")} className={input} />
            </label>
            <label className="block text-sm font-semibold">
              WhatsApp number (with country code)
              <input required inputMode="tel" placeholder="919876543210" value={form.phone} onChange={set("phone")} className={input} />
            </label>
          </>
        )}
        <label className="block text-sm font-semibold">
          Email
          <input required type="email" autoComplete="email" value={form.email} onChange={set("email")} className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            required
            type="password"
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={form.password}
            onChange={set("password")}
            className={input}
          />
        </label>
        <Button type="submit" size="lg" disabled={busy} className="h-10 w-full">
          {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="cursor-pointer font-semibold text-primary"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  )
}
