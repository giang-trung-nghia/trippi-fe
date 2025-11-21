import { httpClient } from "@/configs/axios"
import type { SignInResponse, RefreshTokenResponse } from "@/types/auth"

export const signInWithEmail = async (email: string, password: string): Promise<SignInResponse> => {
  const response = await httpClient.post<SignInResponse>("/auth/sign-in", { email, password }, {
    withCredentials: true
  })
  return response.data
}

export const signInWithGoogle = async (): Promise<SignInResponse> => {
  const response = await httpClient.get<SignInResponse>("/auth/google/sign-in", {
    withCredentials: true
  })
  return response.data
}

export const signInWithFacebook = async (): Promise<SignInResponse> => {
  const response = await httpClient.post<SignInResponse>("/auth/facebook/sign-in", {}, {
    withCredentials: true
  })
  return response.data
}

/**
 * Refresh access token using HTTP-only refresh token cookie
 * Call this when access token expires (401 response)
 */
export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
  const response = await httpClient.post<RefreshTokenResponse>("/auth/refresh", {}, {
    withCredentials: true // Send refresh token cookie
  })
  return response.data
}

export const logout = async (): Promise<void> => {
  await httpClient.post("/auth/logout", {}, {
    withCredentials: true
  })
}

/**
 * Get current user profile using refresh token cookie
 * Call this after OAuth login or on app initialization
 */
export const getMe = async (): Promise<SignInResponse> => {
  const response = await httpClient.get<SignInResponse>("/auth/me", {
    withCredentials: true
  })
  return response.data
}