import { create } from "zustand"
import { persist } from "zustand/middleware"
import { tokenManager } from "@/lib/auth-token"
import { logout as logoutService } from "@/services/auth"
import type { UserProfile, SignInResponse } from "@/types/auth"

type UserState = {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  signIn: (data: SignInResponse) => void
  signOut: () => Promise<void>
  updateProfile: (profile: Partial<UserProfile>) => void
  initialize: () => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      /**
       * Initialize auth state from token
       * If no access token exists, try to get one using refresh token cookie
       */
      initialize: async () => {
        const hasToken = tokenManager.hasAccessToken()
        const state = get()
        
        // If we have a token and user data, user is authenticated
        if (hasToken && state.user) {
          set({ isAuthenticated: true, isLoading: false })
          return
        }
        
        // If token exists but no user data - clear token
        if (hasToken && !state.user) {
          tokenManager.removeAccessToken()
        }
        
        // Try to get user profile using refresh token cookie
        // This handles: OAuth redirects, page refreshes, or returning users
        try {
          const { getMe } = await import("@/services/auth")
          const data = await getMe()
          
          // Store access token and user data
          tokenManager.setAccessToken(data.accessToken)
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          // No valid refresh token - user needs to sign in
          set({ isAuthenticated: false, isLoading: false, user: null })
        }
      },

      /**
       * Sign in: Store access token and user data
       */
      signIn: (data: SignInResponse) => {
        tokenManager.setAccessToken(data.accessToken)
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      /**
       * Sign out: Clear tokens and user data
       */
      signOut: async () => {
        try {
          await logoutService()
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          tokenManager.removeAccessToken()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      /**
       * Update user profile
       */
      updateProfile: (profile: Partial<UserProfile>) => {
        set((state) =>
          state.user
            ? {
                user: { ...state.user, ...profile } as UserProfile,
                isAuthenticated: true,
              }
            : state
        )
      },

      /**
       * Set loading state
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
)

