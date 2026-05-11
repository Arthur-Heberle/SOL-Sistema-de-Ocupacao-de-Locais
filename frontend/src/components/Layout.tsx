import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { projetoService } from '../services/projetoService'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { nome, tipoUsuario, logout, isAuthenticated, idUsuario } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const canSeeProjetos = tipoUsuario && (
    ['TUTOR', 'PROFESSOR', 'GESTOR'].includes(tipoUsuario) ||
    (idUsuario !== null && projetoService.isMembro(idUsuario))
  )

  return (
    <>
      <nav style={{ padding: '8px 16px', background: '#1a1a2e', color: '#fff', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <strong>SOL</strong>
        <Link to="/mapa" style={{ color: '#fff' }}>Mapa</Link>
        {tipoUsuario && ['PROFESSOR', 'GESTOR'].includes(tipoUsuario) && (
          <Link to="/dashboard" style={{ color: '#fff' }}>Dashboard</Link>
        )}
        {canSeeProjetos && (
          <Link to="/projetos" style={{ color: '#fff' }}>Projetos</Link>
        )}
        {tipoUsuario === 'GESTOR' && (
          <>
            <Link to="/admin/usuarios" style={{ color: '#fff' }}>Usuários</Link>
            <Link to="/admin/salas" style={{ color: '#fff' }}>Salas</Link>
            <Link to="/admin/disciplinas" style={{ color: '#fff' }}>Disciplinas</Link>
          </>
        )}
        {isAuthenticated && (
          <span style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {nome} ({tipoUsuario})
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Sair</button>
          </span>
        )}
      </nav>
      <div style={{ padding: '16px' }}>{children}</div>
    </>
  )
}
