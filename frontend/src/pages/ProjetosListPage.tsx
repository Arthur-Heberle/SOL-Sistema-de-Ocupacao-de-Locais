import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projetoService } from '../services/projetoService'
import { usuarioService } from '../services/usuarioService'
import { useAuth } from '../context/AuthContext'
import FormProjetoComponent from '../components/FormProjetoComponent'
import type { ProjetoDTO } from '../types'

export default function ProjetosListPage() {
  const { nome, tipoUsuario } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [projetos, setProjetos] = useState<ProjetoDTO[]>(() => filtrarProjetos())

  function filtrarProjetos(): ProjetoDTO[] {
    const todos = projetoService.listar()
    if (tipoUsuario === 'GESTOR') return todos
    const usuario = usuarioService.listar().find(u => u.nome === nome)
    if (!usuario) return []
    if (tipoUsuario === 'PROFESSOR') return todos.filter(p => p.idTutor === usuario.id)
    return todos.filter(p =>
      projetoService.membros(p.id).some(m => m.idUsuario === usuario.id)
    )
  }

  const recarregar = () => setProjetos(filtrarProjetos())

  const categoriaLabel: Record<string, string> = {
    ENSINO: 'Ensino', PESQUISA: 'Pesquisa', EXTENSAO: 'Extensão', GESTAO: 'Gestão',
  }

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1>Projetos</h1>
          <p style={{ color: '#666', marginTop: 4 }}>Projetos vinculados à sua conta</p>
        </div>
        {(tipoUsuario === 'PROFESSOR' || tipoUsuario === 'GESTOR') && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '8px 16px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            {showForm ? 'Cancelar' : '+ Novo Projeto'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: '#f9f9f9', border: '1px solid #ddd', borderRadius: 6, padding: 20, marginBottom: 24 }}>
          <h2 style={{ marginBottom: 16, fontSize: 16 }}>Registrar Novo Projeto</h2>
          <FormProjetoComponent onCriado={() => { recarregar(); setShowForm(false) }} />
        </div>
      )}

      {projetos.length === 0 ? (
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: 24, borderRadius: 6, color: '#6c757d', textAlign: 'center' }}>
          Nenhum projeto encontrado para sua conta.
          {(tipoUsuario === 'PROFESSOR' || tipoUsuario === 'GESTOR') && (
            <> Clique em <strong>+ Novo Projeto</strong> para começar.</>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projetos.map(p => (
            <Link key={p.id} to={`/projetos/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{ border: '1px solid #ddd', borderRadius: 6, padding: '14px 18px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ff')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.nome}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
                    {categoriaLabel[p.categoria]} · {p.descricao.slice(0, 80)}{p.descricao.length > 80 ? '…' : ''}
                  </div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                  background: p.aprovado ? '#d4edda' : '#fff3cd',
                  color: p.aprovado ? '#155724' : '#856404',
                }}>
                  {p.aprovado ? 'Aprovado' : 'Pendente'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
