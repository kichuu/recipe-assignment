"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function useAuth(requireAuth = true) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const isAuthenticated = !!token

    if (requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }

    if (!requireAuth && isAuthenticated) {
      router.push("/")
    }
  }, [requireAuth, router, pathname])

  return { isAuthenticated: typeof window !== "undefined" && !!localStorage.getItem("token") }
}

