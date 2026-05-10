import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { TipoUsuario } from '../types'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Dev shortcut: pick a role to simulate login without backend
  const simulateLogin = (role: TipoUsuario) => {
    login('dev-token', `Dev ${role}`, role)
    navigate('/mapa')
  }

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1>S.O.L. — Login</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>Sistema de Ocupação de Locais — UTFPR</p>
      {/* TODO: connect to POST /auth/login */}
      <form onSubmit={e => e.preventDefault()}>
        <div style={{ marginBottom: 12 }}>
          <label>Email institucional<br />
            <input type="email" placeholder="usuario@utfpr.edu.br" style={{ width: '100%', padding: 8 }} />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Senha<br />
            <input type="password" style={{ width: '100%', padding: 8 }} />
          </label>
        </div>
        <button type="submit" style={{ width: '100%', padding: 10 }}>Entrar</button>
      </form>
      <hr style={{ margin: '24px 0' }} />
      <p style={{ fontSize: 12, color: '#999' }}>Dev shortcuts (backend not connected):</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['ALUNO', 'PROFESSOR', 'TUTOR', 'GESTOR'] as TipoUsuario[]).map(role => (
          <button key={role} onClick={() => simulateLogin(role)} style={{ fontSize: 11, padding: '4px 8px' }}>
            Login as {role}
          </button>
        ))}
      </div>
    </main>
  )
}
