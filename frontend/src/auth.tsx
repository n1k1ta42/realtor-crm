import { queryClient } from '@/main.tsx'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export interface AuthContext {
  isAuthenticated: boolean
  setTokenToLS: (token: string) => void
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContext | null>(null)

export const KEY = 'auth.token'

function getStoredToken() {
  return localStorage.getItem(KEY)
}

function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(KEY, token)
  } else {
    localStorage.removeItem(KEY)
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(getStoredToken())
  const isAuthenticated = !!token

  const logout = useCallback(() => {
    setStoredToken(null)
    setToken(null)
    queryClient.cancelQueries()
  }, [])

  const setTokenToLS = useCallback((token: string) => {
    setStoredToken(token)
    setToken(token)
  }, [])

  useEffect(() => {
    setToken(getStoredToken())
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, setTokenToLS, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
