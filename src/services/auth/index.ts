import { httpClient } from "@/configs/axios"

export const signInWithEmail = async (email: string, password: string) => {
  const response = await httpClient.post("/auth/sign-in", { email, password })
  return response.data
}

export const signInWithGoogle = async () => {
  const response = await httpClient.get("/auth/google/sign-in")
  return response.data
}

export const signInWithFacebook = async () => {
  const response = await httpClient.post("/auth/facebook/sign-in")
  return response.data
}