import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { projetoService } from '../services/projetoService'
import { useAuth } from '../context/AuthContext'
import HorariosLivresComponent from '../components/HorariosLivresComponent'
import MembrosListComponent from '../components/MembrosListComponent'

export default function ProjetoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tipoUsuario } = useAuth()
  const idNum = Number(id)
  const projetoInicial = projetoService.buscarPorId(idNum)
  const [aprovado, setAprovado] = useState(projetoInicial?.aprovado ?? false)

  if (!projetoInicial) {
    return (
      <main>
        <p style={{ color: '#d9534f' }}>Projeto não encontrado.</p>
        <button onClick={() => navigate('/projetos')} style={{ marginTop: 12, cursor: 'pointer', padding: '6px 14px' }}>
          ← Voltar aos Projetos
        </button>
      </main>
    )
  }

  const handleAprovar = () => {
    projetoService.aprovar(idNum)
    setAprovado(true)
  }

  return (
    <main>
      <button onClick={() => navigate('/projetos')} style={{ marginBottom: 16, cursor: 'pointer', padding: '4px 12px', fontSize: 12 }}>
        ← Projetos
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <h1 style={{ margin: 0 }}>{projetoInicial.nome}</h1>
        {tipoUsuario === 'GESTOR' && !aprovado && (
          <button
            onClick={handleAprovar}
            style={{ background: '#5cb85c', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
          >
            Aprovar Projeto
          </button>
        )}
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Categoria: {projetoInicial.categoria}</p>
      <p style={{ marginBottom: 20, color: '#555' }}>{projetoInicial.descricao}</p>
      {!aprovado ? (
        <div style={{ background: '#fff3cd', border: '1px solid #f0ad4e', padding: 12, borderRadius: 6, marginBottom: 20, fontSize: 13 }}>
          ⏳ Este projeto está aguardando aprovação do Gestor de Salas.
        </div>
      ) : (
        <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', padding: 12, borderRadius: 6, marginBottom: 20, fontSize: 13 }}>
          ✓ Projeto aprovado.
        </div>
      )}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 12 }}>Membros</h2>
        <MembrosListComponent idProjeto={projetoInicial.id} />
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 12 }}>Horários Livres</h2>
        <HorariosLivresComponent idProjeto={projetoInicial.id} />
      </section>
    </main>
  )
}
