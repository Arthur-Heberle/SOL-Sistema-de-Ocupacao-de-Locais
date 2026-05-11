import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { projetoService } from '../services/projetoService'
import { reservaService } from '../services/reservaService'
import { salaService } from '../services/salaService'
import { useAuth } from '../context/AuthContext'
import HorariosLivresComponent from '../components/HorariosLivresComponent'
import MembrosListComponent from '../components/MembrosListComponent'
import CalendarioComponent from '../components/CalendarioComponent'
import ModalReservaComponent from '../components/ModalReservaComponent'

export default function ProjetoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tipoUsuario, idUsuario } = useAuth()
  const idNum = Number(id)

  const projetoInicial = projetoService.buscarPorId(idNum)
  const [aprovado, setAprovado] = useState(projetoInicial?.aprovado ?? false)
  const [modalAberto, setModalAberto] = useState(false)

  const membros = projetoInicial ? projetoService.membros(idNum) : []
  const isMembroOuGestor = tipoUsuario === 'GESTOR' ||
    (idUsuario !== null && membros.some(m => m.idUsuario === idUsuario))

  const sala = projetoInicial?.idSalaExclusiva
    ? salaService.buscarPorId(projetoInicial.idSalaExclusiva) ?? null
    : null

  const getReservasDaSala = () => sala
    ? reservaService.reservasDaSala(sala.id).filter(r =>
        isMembroOuGestor || r.visibilidade === 'PUBLICA'
      )
    : []

  const [reservasDaSala, setReservasDaSala] = useState(getReservasDaSala)

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

      {sala && aprovado && (
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>
              Sala Exclusiva — {sala.codigoNome}
              <span style={{ fontWeight: 400, fontSize: 13, color: '#666', marginLeft: 8 }}>
                Cap. {sala.capacidade}{sala.possuiProjetor ? ' · Projetor' : ''}
              </span>
            </h2>
            {isMembroOuGestor && (
              <button
                onClick={() => setModalAberto(true)}
                style={{ padding: '6px 14px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}
              >
                + Agendar Atividade
              </button>
            )}
          </div>
          {!isMembroOuGestor && (
            <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
              Exibindo apenas atividades públicas.
            </p>
          )}
          <CalendarioComponent reservas={reservasDaSala} salas={[sala]} />
          {modalAberto && (
            <ModalReservaComponent
              sala={sala}
              aberto={modalAberto}
              onFechar={() => setModalAberto(false)}
              onCriada={() => {
                setReservasDaSala(getReservasDaSala())
                setModalAberto(false)
              }}
            />
          )}
        </section>
      )}

      {sala && !aprovado && isMembroOuGestor && (
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: 12, borderRadius: 6, marginBottom: 28, fontSize: 13, color: '#6c757d' }}>
          A sala exclusiva e o agendamento de atividades ficam disponíveis após aprovação do projeto.
        </div>
      )}

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 12 }}>Horários Livres dos Integrantes</h2>
        {isMembroOuGestor ? (
          <HorariosLivresComponent idProjeto={projetoInicial.id} />
        ) : (
          <p style={{ fontSize: 13, color: '#888' }}>
            Apenas integrantes e o Gestor podem visualizar e editar os horários livres.
          </p>
        )}
      </section>
    </main>
  )
}
