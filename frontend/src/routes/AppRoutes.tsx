import { Routes, Route, Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import type { TipoUsuario } from '../types'
import ProtectedRoute from './ProtectedRoute'
import Layout from '../components/Layout'
import LoginPage from '../pages/LoginPage'
import MapaPage from '../pages/MapaPage'
import DashboardPage from '../pages/DashboardPage'
import ProjetoPage from '../pages/ProjetoPage'
import ProjetosListPage from '../pages/ProjetosListPage'
import GestaoUsuariosPage from '../pages/GestaoUsuariosPage'
import GestaoSalasPage from '../pages/GestaoSalasPage'
import GestaoDisciplinasPage from '../pages/GestaoDisciplinasPage'

const guard = (minRole: TipoUsuario, page: ReactElement) => (
  <ProtectedRoute minRole={minRole}>{page}</ProtectedRoute>
)

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={guard('ALUNO', <Layout />)}>
        <Route path="/" element={<Navigate to="/mapa" replace />} />
        <Route path="/mapa" element={<MapaPage />} />
        <Route path="/dashboard" element={guard('PROFESSOR', <DashboardPage />)} />
        <Route path="/projetos" element={<ProjetosListPage />} />
        <Route path="/projetos/:id" element={<ProjetoPage />} />
        <Route path="/admin/usuarios" element={guard('GESTOR', <GestaoUsuariosPage />)} />
        <Route path="/admin/salas" element={guard('GESTOR', <GestaoSalasPage />)} />
        <Route path="/admin/disciplinas" element={guard('GESTOR', <GestaoDisciplinasPage />)} />
      </Route>
      <Route path="*" element={<Navigate to="/mapa" replace />} />
    </Routes>
  )
}
