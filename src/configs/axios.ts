import axios from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1"

export const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Placeholder interceptors so we can extend with auth, token decoding, etc.
httpClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

