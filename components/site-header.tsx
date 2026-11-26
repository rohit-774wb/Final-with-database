"use client"

import Link from "next/link"
import { GraduationCap, LogOut, Plus, ShieldCheck, UserRound } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/toast-provider"

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth()
  const toast = useToast()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-4" />
          </span>
          Campus Helper
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/listings"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Browse
          </Link>
          {user && (
            <Link href="/listings/new" className={buttonVariants({ variant: "outline" })}>
              <Plus /> <span className="hidden sm:inline">Post</span>
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className={buttonVariants({ variant: "outline" })}>
              <ShieldCheck /> <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          {user ? (
            <Button
              variant="outline"
              onClick={async () => {
                await signOut()
                toast("Signed out.")
              }}
            >
              <LogOut /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          ) : (
            <Link href="/login" className={buttonVariants()}>
              <UserRound /> Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
