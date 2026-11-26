"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { getSupabase } from "@/lib/supabase"
import type { User } from "@/lib/types"

interface SignUpInput {
  name: string
  phone: string
  email: string
  password: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  /** Returns true when the user must confirm their email before signing in. */
  signUp: (input: SignUpInput) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authId, setAuthId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    supabase.auth.getSession().then(({ data }) => {
      setAuthId(data.session?.user.id ?? null)
      if (!data.session) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthId(session?.user.id ?? null)
      if (!session) {
        setUser(null)
        setLoading(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!authId) return
    let active = true
    getSupabase()
      .from("profiles")
      .select("id,name,email,phone,role")
      .eq("id", authId)
      .single()
      .then(({ data }) => {
        if (!active) return
        setUser(data ? { ...data, savedListings: [] } : null)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [authId])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  }, [])

  const signUp = useCallback(async ({ name, phone, email, password }: SignUpInput) => {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    })
    if (error) throw new Error(error.message)
    return !data.session
  }, [])

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut()
  }, [])

  const value = useMemo(
    () => ({ user, loading, isAdmin: user?.role === "admin", signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
