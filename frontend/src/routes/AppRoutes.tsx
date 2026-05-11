import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/mapa" replace />} />
      <Route
        path="/mapa"
        element={
          <ProtectedRoute minRole="ALUNO">
            <Layout><MapaPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute minRole="PROFESSOR">
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projetos"
        element={
          <ProtectedRoute minRole="TUTOR">
            <Layout><ProjetosListPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projetos/:id"
        element={
          <ProtectedRoute minRole="TUTOR">
            <Layout><ProjetoPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute minRole="GESTOR">
            <Layout><GestaoUsuariosPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/salas"
        element={
          <ProtectedRoute minRole="GESTOR">
            <Layout><GestaoSalasPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/disciplinas"
        element={
          <ProtectedRoute minRole="GESTOR">
            <Layout><GestaoDisciplinasPage /></Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
