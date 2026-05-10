import { useState } from 'react'
import type { UsuarioDTO, TipoUsuario } from '../types'
import { usuarioService } from '../services/usuarioService'

const TIPOS: TipoUsuario[] = ['ALUNO', 'PROFESSOR', 'TUTOR', 'GESTOR']

export default function GestaoUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>(() => usuarioService.listar())
  const [mostraForm, setMostraForm] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [tipo, setTipo] = useState<TipoUsuario>('ALUNO')
  const [erro, setErro] = useState('')

  const recarregar = () => setUsuarios(usuarioService.listar())

  const criar = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!nome.trim() || !email.trim()) { setErro('Preencha todos os campos.'); return }
    if (usuarioService.listar().some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setErro('E-mail já cadastrado.'); return
    }
    usuarioService.criar({ nome: nome.trim(), email: email.trim().toLowerCase(), tipoUsuario: tipo, ativo: true })
    recarregar()
    setMostraForm(false)
    setNome(''); setEmail(''); setTipo('ALUNO')
  }

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Gestão de Usuários</h1>
        <button onClick={() => setMostraForm(!mostraForm)} style={{ padding: '8px 16px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {mostraForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>
      {mostraForm && (
        <form onSubmit={criar} style={{ background: '#f9f9f9', padding: 16, borderRadius: 6, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={{ fontSize: 13 }}>Nome<br /><input value={nome} onChange={e => setNome(e.target.value)} style={{ padding: 7, width: 200 }} /></label>
          <label style={{ fontSize: 13 }}>E-mail<br /><input value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 7, width: 220 }} /></label>
          <label style={{ fontSize: 13 }}>Perfil<br />
            <select value={tipo} onChange={e => setTipo(e.target.value as TipoUsuario)} style={{ padding: 7 }}>
              {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
          <button type="submit" style={{ padding: '7px 16px', background: '#5cb85c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Salvar</button>
          {erro && <span style={{ color: '#d9534f', fontSize: 12 }}>{erro}</span>}
        </form>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: '#fff' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>E-mail</th>
            <th style={{ padding: '10px 12px' }}>Perfil</th>
            <th style={{ padding: '10px 12px' }}>Status</th>
            <th style={{ padding: '10px 12px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, i) => (
            <tr key={u.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              <td style={{ border: '1px solid #eee', padding: '8px 12px' }}>{u.nome}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px' }}>{u.email}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>{u.tipoUsuario}</td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>
                <span style={{ background: u.ativo ? '#d4edda' : '#f8d7da', color: u.ativo ? '#155724' : '#721c24', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
                  {u.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td style={{ border: '1px solid #eee', padding: '8px 12px', textAlign: 'center' }}>
                <button onClick={() => { usuarioService.toggleAtivo(u.id); recarregar() }} style={{ fontSize: 11, padding: '3px 10px', cursor: 'pointer', background: u.ativo ? '#f0ad4e' : '#5cb85c', color: '#fff', border: 'none', borderRadius: 3 }}>
                  {u.ativo ? 'Desativar' : 'Ativar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
