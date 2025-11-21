"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/use-user-store"

/**
 * Auth Initializer
 * Initializes authentication state on app load
 * Calls /auth/me if no access token but potentially has refresh token
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useUserStore((state) => state.initialize)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    initialize().finally(() => setIsInitialized(true))
  }, [initialize])

  // Show loading only on first mount
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return <>{children}</>
}

