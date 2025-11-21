/**
 * Custom hook for making authenticated API calls
 * Automatically includes access token from localStorage in Authorization header
 */

import { httpClient } from "@/configs/axios"
import { AxiosRequestConfig } from "axios"

export const useApi = () => {
  const get = async <T = any>(url: string, config?: AxiosRequestConfig) => {
    const response = await httpClient.get<T>(url, config)
    return response.data
  }

  const post = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const response = await httpClient.post<T>(url, data, config)
    return response.data
  }

  const put = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const response = await httpClient.put<T>(url, data, config)
    return response.data
  }

  const patch = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const response = await httpClient.patch<T>(url, data, config)
    return response.data
  }

  const del = async <T = any>(url: string, config?: AxiosRequestConfig) => {
    const response = await httpClient.delete<T>(url, config)
    return response.data
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
  }
}

