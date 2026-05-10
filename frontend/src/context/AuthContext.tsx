import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { TipoUsuario } from '../types'

interface AuthState {
  token: string | null
  nome: string | null
  tipoUsuario: TipoUsuario | null
}

interface AuthContextValue extends AuthState {
  login: (token: string, nome: string, tipo: TipoUsuario) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    nome: null,
    tipoUsuario: null,
  })

  const login = (token: string, nome: string, tipoUsuario: TipoUsuario) =>
    setAuth({ token, nome, tipoUsuario })

  const logout = () => setAuth({ token: null, nome: null, tipoUsuario: null })

  return (
    <AuthContext.Provider
      value={{ ...auth, login, logout, isAuthenticated: !!auth.token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
