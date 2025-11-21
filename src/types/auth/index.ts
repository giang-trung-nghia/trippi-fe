/**
 * Common Authentication Types
 * Used across the application for auth-related functionality
 */

export type SignInMethod = "email" | "google" | "facebook"

export type UserProfile = {
  id: string
  name: string
  email: string
  avatarUrl?: string
  method?: SignInMethod
}

export type SignInResponse = {
  accessToken: string
  user: UserProfile
}

export type RefreshTokenResponse = {
  accessToken: string
}

