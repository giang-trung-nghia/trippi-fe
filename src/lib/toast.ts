/**
 * Toast notification configuration and utilities
 */

import { toast as toastify, ToastOptions, TypeOptions } from "react-toastify"

/**
 * Default toast options
 */
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

/**
 * Custom toast utility with predefined options
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return toastify.success(message, { ...defaultOptions, ...options })
  },

  error: (message: string, options?: ToastOptions) => {
    return toastify.error(message, { ...defaultOptions, ...options })
  },

  info: (message: string, options?: ToastOptions) => {
    return toastify.info(message, { ...defaultOptions, ...options })
  },

  warning: (message: string, options?: ToastOptions) => {
    return toastify.warning(message, { ...defaultOptions, ...options })
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      pending: string
      success: string
      error: string
    },
    options?: ToastOptions
  ) => {
    return toastify.promise(
      promise,
      {
        pending: messages.pending,
        success: messages.success,
        error: messages.error,
      },
      { ...defaultOptions, ...options }
    )
  },

  dismiss: (toastId?: string | number) => {
    return toastify.dismiss(toastId)
  },

  loading: (message: string, options?: ToastOptions) => {
    return toastify.loading(message, { ...defaultOptions, ...options })
  },

  update: (
    toastId: string | number,
    options: ToastOptions & { render?: string; type?: TypeOptions }
  ) => {
    return toastify.update(toastId, options)
  },
}

