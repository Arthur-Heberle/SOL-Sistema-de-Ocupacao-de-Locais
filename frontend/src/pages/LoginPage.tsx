import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as mockLogin } from '../services/authService'
import type { TipoUsuario } from '../types'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const entrar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    const resultado = mockLogin(email, senha)
    setCarregando(false)
    if (!resultado.ok) { setErro(resultado.erro ?? 'Erro ao fazer login.'); return }
    login(resultado.token!, resultado.nome!, resultado.tipoUsuario!)
    navigate(resultado.tipoUsuario === 'GESTOR' ? '/dashboard' : '/mapa')
  }

  const simular = (role: TipoUsuario) => {
    const emails: Record<TipoUsuario, string> = {
      GESTOR: 'gestor@utfpr.edu.br',
      PROFESSOR: 'ana@utfpr.edu.br',
      TUTOR: 'carlos@utfpr.edu.br',
      ALUNO: 'maria@utfpr.edu.br',
    }
    const resultado = mockLogin(emails[role], '123456')
    if (resultado.ok) {
      login(resultado.token!, resultado.nome!, resultado.tipoUsuario!)
      navigate('/mapa')
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1 style={{ marginBottom: 4 }}>S.O.L.</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Sistema de Ocupação de Locais — UTFPR</p>
      <form onSubmit={entrar}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13 }}>E-mail institucional<br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 9, marginTop: 4 }} placeholder="usuario@utfpr.edu.br" required />
          </label>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13 }}>Senha<br />
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} style={{ width: '100%', padding: 9, marginTop: 4 }} required />
          </label>
        </div>
        {erro && <p style={{ color: '#d9534f', fontSize: 13, marginBottom: 10 }}>{erro}</p>}
        <button type="submit" disabled={carregando} style={{ width: '100%', padding: 11, background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 15 }}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <hr style={{ margin: '20px 0' }} />
      <p style={{ fontSize: 11, color: '#999', marginBottom: 8 }}>Acesso rápido (modo de desenvolvimento):</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(['GESTOR', 'PROFESSOR', 'TUTOR', 'ALUNO'] as TipoUsuario[]).map(role => (
          <button key={role} onClick={() => simular(role)} style={{ fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>{role}</button>
        ))}
      </div>
      <p style={{ fontSize: 10, color: '#bbb', marginTop: 8 }}>Senha padrão: 123456</p>
    </main>
  )
}
