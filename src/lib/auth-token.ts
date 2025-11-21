/**
 * Token management utilities for handling access tokens in localStorage
 */

const ACCESS_TOKEN_KEY = 'accessToken';

export const tokenManager = {
  setAccessToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  },

  removeAccessToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  },

  hasAccessToken: (): boolean => {
    return !!tokenManager.getAccessToken();
  },
};

