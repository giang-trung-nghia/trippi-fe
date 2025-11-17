import { create } from "zustand"

export type SignInMethod = "email" | "google" | "facebook"

export type UserProfile = {
  id?: string
  name?: string
  email?: string
  avatarUrl?: string
  method?: SignInMethod
}

type UserState = {
  user: UserProfile | null
  isSignedIn: boolean
  signIn: (profile: UserProfile) => void
  signOut: () => void
  updateProfile: (profile: Partial<UserProfile>) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isSignedIn: false,
  signIn: (profile) => set({ user: profile, isSignedIn: true }),
  signOut: () => set({ user: null, isSignedIn: false }),
  updateProfile: (profile) =>
    set((state) =>
      state.user
        ? { user: { ...state.user, ...profile }, isSignedIn: true }
        : state
    ),
}))

