import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { projetoService } from '../services/projetoService'
import FormProjetoComponent from '../components/FormProjetoComponent'
import HorariosLivresComponent from '../components/HorariosLivresComponent'
import MembrosListComponent from '../components/MembrosListComponent'

export default function ProjetoPage() {
  const { id } = useParams()
  const idNum = id ? Number(id) : null
  const [projeto, setProjeto] = useState(() => idNum ? projetoService.buscarPorId(idNum) : undefined)

  if (!projeto) {
    return (
      <main>
        <h1>Registrar Novo Projeto</h1>
        <p style={{ color: '#666', marginBottom: 20 }}>Preencha os dados abaixo. O projeto ficará pendente até aprovação do Gestor de Salas.</p>
        <FormProjetoComponent onCriado={() => {
          if (idNum) setProjeto(projetoService.buscarPorId(idNum))
        }} />
      </main>
    )
  }

  return (
    <main>
      <h1>{projeto.nome}</h1>
      <p style={{ color: '#666', marginBottom: 4 }}>Categoria: {projeto.categoria}</p>
      <p style={{ marginBottom: 20, color: '#555' }}>{projeto.descricao}</p>
      {!projeto.aprovado && (
        <div style={{ background: '#fff3cd', border: '1px solid #f0ad4e', padding: 12, borderRadius: 6, marginBottom: 20, fontSize: 13 }}>
          Este projeto está aguardando aprovação do Gestor de Salas.
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
