import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { TipoUsuario } from '../types'

const ROLE_RANK: Record<TipoUsuario, number> = {
  ALUNO: 1,
  PROFESSOR: 2,
  TUTOR: 3,
  GESTOR: 4,
}

interface Props {
  children: React.ReactElement
  minRole: TipoUsuario
}

export default function ProtectedRoute({ children, minRole }: Props) {
  const { isAuthenticated, tipoUsuario } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!tipoUsuario || ROLE_RANK[tipoUsuario] < ROLE_RANK[minRole])
    return <Navigate to="/mapa" replace />
  return children
}
