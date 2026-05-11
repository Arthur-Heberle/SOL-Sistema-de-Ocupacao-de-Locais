import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { TipoUsuario } from '../types'

interface AuthState {
  token: string | null
  nome: string | null
  tipoUsuario: TipoUsuario | null
  idUsuario: number | null
}

interface AuthContextValue extends AuthState {
  login: (token: string, nome: string, tipo: TipoUsuario, idUsuario: number) => void
  logout: () => void
  isAuthenticated: boolean
}

const AUTH_KEY = 'sol.auth'

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) return JSON.parse(raw) as AuthState
  } catch { /* ignore */ }
  return { token: null, nome: null, tipoUsuario: null, idUsuario: null }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadAuth)

  const login = (token: string, nome: string, tipoUsuario: TipoUsuario, idUsuario: number) => {
    const state = { token, nome, tipoUsuario, idUsuario }
    localStorage.setItem(AUTH_KEY, JSON.stringify(state))
    setAuth(state)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setAuth({ token: null, nome: null, tipoUsuario: null, idUsuario: null })
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isAuthenticated: !!auth.token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
