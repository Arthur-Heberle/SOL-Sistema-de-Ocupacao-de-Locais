import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { projetoService } from '../services/projetoService'
import HorariosLivresComponent from '../components/HorariosLivresComponent'
import MembrosListComponent from '../components/MembrosListComponent'

export default function ProjetoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const idNum = Number(id)
  const [projeto] = useState(() => projetoService.buscarPorId(idNum))

  if (!projeto) {
    return (
      <main>
        <p style={{ color: '#d9534f' }}>Projeto não encontrado.</p>
        <button onClick={() => navigate('/projetos')} style={{ marginTop: 12, cursor: 'pointer', padding: '6px 14px' }}>
          ← Voltar aos Projetos
        </button>
      </main>
    )
  }

  return (
    <main>
      <button onClick={() => navigate('/projetos')} style={{ marginBottom: 16, cursor: 'pointer', padding: '4px 12px', fontSize: 12 }}>
        ← Projetos
      </button>
      <h1>{projeto.nome}</h1>
      <p style={{ color: '#666', marginBottom: 4 }}>Categoria: {projeto.categoria}</p>
      <p style={{ marginBottom: 20, color: '#555' }}>{projeto.descricao}</p>
      {!projeto.aprovado && (
        <div style={{ background: '#fff3cd', border: '1px solid #f0ad4e', padding: 12, borderRadius: 6, marginBottom: 20, fontSize: 13 }}>
          ⏳ Este projeto está aguardando aprovação do Gestor de Salas.
        </div>
      )}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 12 }}>Membros</h2>
        <MembrosListComponent idProjeto={projeto.id} />
      </section>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 12 }}>Horários Livres</h2>
        <HorariosLivresComponent idProjeto={projeto.id} />
      </section>
    </main>
  )
}
