import { useState } from 'react'
import type { ReservaDTO } from '../types'
import { reservaService } from '../services/reservaService'
import CardSolicitacaoComponent from '../components/CardSolicitacaoComponent'

export default function DashboardPage() {
  const [pendentes, setPendentes] = useState<ReservaDTO[]>(() => reservaService.pendentes())

  const aprovar = (id: number) => {
    reservaService.aprovar(id)
    setPendentes(reservaService.pendentes())
  }

  const rejeitar = (id: number) => {
    reservaService.rejeitar(id)
    setPendentes(reservaService.pendentes())
  }

  return (
    <main>
      <h1>Dashboard — Solicitações Pendentes</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Reservas aguardando aprovação do Gestor de Salas
      </p>
      {pendentes.length === 0 ? (
        <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', padding: 20, borderRadius: 6, color: '#155724' }}>
          Nenhuma solicitação pendente no momento.
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
              onAprovar={aprovar}
              onRejeitar={rejeitar}
            />
          ))}
        </>
      )}
    </main>
  )
}
