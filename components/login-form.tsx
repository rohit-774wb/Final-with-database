"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { ChevronDown, X } from "lucide-react"
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
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", role: "student" as "student" | "owner" })
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  function close() {
    if (window.history.length > 1) router.back()
    else router.push("/")
  }

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
      <form onSubmit={submit} className="card-surface relative w-full max-w-sm space-y-4 p-6">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
        <h1 className="pr-8 text-2xl font-extrabold">{mode === "signin" ? "Sign in" : "Create an account"}</h1>
        {mode === "signup" && (
          <>
            <label className="block text-sm font-semibold">
              Name
              <input required value={form.name} onChange={set("name")} className={input} />
            </label>
            <label className="block text-sm font-semibold">
              Phone
              <input
                required
                inputMode="tel"
                placeholder="With country code, e.g. 919876543210"
                value={form.phone}
                onChange={set("phone")}
                className={input}
              />
            </label>
            <label className="block text-sm font-semibold">
              I am a
              <div className="relative">
                <select
                  value={form.role}
                  onChange={set("role")}
                  className={`${input} cursor-pointer appearance-none pr-9`}
                >
                  <option value="student">Student</option>
                  <option value="owner">Owner (PG, tiffin or books)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
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
            className="cursor-pointer font-semibold text-primary underline underline-offset-4"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  )
}
