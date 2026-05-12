import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ReservaDTO, ProjetoDTO } from '../types'
import { reservaService } from '../services/reservaService'
import { projetoService } from '../services/projetoService'
import { useAuth } from '../context/AuthContext'
import CardSolicitacaoComponent from '../components/CardSolicitacaoComponent'

export default function DashboardPage() {
  const { tipoUsuario, idUsuario } = useAuth()
  const isGestor = tipoUsuario === 'GESTOR'

  const [pendentes, setPendentes] = useState<ReservaDTO[]>(() => {
    const todas = reservaService.pendentes()
    return isGestor ? todas : todas.filter(r => r.idUsuario === idUsuario)
  })

  const [projetosPendentes, setProjetosPendentes] = useState<ProjetoDTO[]>(() => {
    const todos = projetoService.listar().filter(p => !p.aprovado)
    return isGestor ? todos : todos.filter(p => p.idTutor === idUsuario)
  })

  const aprovar = (id: number) => {
    reservaService.aprovar(id)
    setPendentes(reservaService.pendentes().filter(r => isGestor || r.idUsuario === idUsuario))
  }

  const rejeitar = (id: number) => {
    reservaService.rejeitar(id)
    setPendentes(reservaService.pendentes().filter(r => isGestor || r.idUsuario === idUsuario))
  }

  return (
    <main>
      <h1>{isGestor ? 'Dashboard — Solicitações Pendentes' : 'Minhas Solicitações'}</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        {isGestor
          ? 'Reservas e projetos aguardando aprovação do Gestor de Salas'
          : 'Acompanhe o status das suas reservas e projetos enviados para aprovação'}
      </p>

      {projetosPendentes.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>
            {isGestor ? 'Projetos Pendentes' : 'Meus Projetos Aguardando Aprovação'}
          </h2>
          <p style={{ marginBottom: 12, color: '#555', fontSize: 14 }}>
            {projetosPendentes.length} projeto(s) aguardando aprovação
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {projetosPendentes.map(p => (
              <Link key={p.id} to={`/projetos/${p.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    border: '1px solid #f0ad4e', background: '#fff3cd',
                    borderRadius: 6, padding: '12px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#ffe8a0')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff3cd')}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#212529' }}>{p.nome}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                      {p.categoria} · {p.descricao.slice(0, 70)}{p.descricao.length > 70 ? '…' : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: '#856404', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12 }}>
                    {isGestor ? 'Revisar →' : 'Ver detalhes →'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>
          {isGestor ? 'Reservas Pendentes' : 'Minhas Reservas Pendentes'}
        </h2>
        {pendentes.length === 0 ? (
          <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', padding: 20, borderRadius: 6, color: '#155724' }}>
            {isGestor
              ? 'Nenhuma solicitação de reserva pendente no momento.'
              : 'Você não tem reservas aguardando aprovação no momento.'}
          </div>
        ) : (
          <>
            <p style={{ marginBottom: 12, color: '#555', fontSize: 14 }}>
              {pendentes.length} solicitação(ões) pendente(s)
            </p>
            {pendentes.map(r => (
              <CardSolicitacaoComponent
                key={r.id}
                reserva={r}
                onAprovar={isGestor ? aprovar : undefined}
                onRejeitar={isGestor ? rejeitar : undefined}
              />
            ))}
          </>
        )}
      </section>
    </main>
  )
}
