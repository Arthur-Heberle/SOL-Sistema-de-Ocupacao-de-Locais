import type { ReservaDTO } from '../types'

export default function CardSolicitacaoComponent() {
  const mockReserva: ReservaDTO = {
    id: 142,
    idSala: 15,
    idUsuario: 101,
    titulo: 'Aula prática de laboratório',
    visibilidade: 'PUBLICA',
    dataInicio: '2026-05-20T13:50:00',
    dataFim: '2026-05-20T15:30:00',
    recorrente: false,
    status: 'PENDENTE',
  }

  return (
    <div style={{ border: '1px solid #f0ad4e', borderRadius: 4, padding: 16, marginBottom: 8, maxWidth: 500 }}>
      <strong>[CardSolicitacaoComponent]</strong>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        TODO: props: solicitacao: ReservaDTO, onAprovar: (id: number) =&gt; void, onRejeitar: (id: number) =&gt; void
      </p>
      <div style={{ background: '#fff8e1', padding: 12, borderRadius: 4 }}>
        <div><strong>{mockReserva.titulo}</strong> <span style={{ background: '#f0ad4e', color: '#fff', padding: '2px 6px', fontSize: 11, borderRadius: 3 }}>PENDENTE</span></div>
        <div style={{ fontSize: 12, color: '#555', margin: '4px 0' }}>
          Sala #{mockReserva.idSala} · {mockReserva.dataInicio} → {mockReserva.dataFim}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={() => alert(`TODO: PATCH /reservas/${mockReserva.id}/aprovar`)} style={{ background: '#5cb85c', color: '#fff', border: 'none', padding: '4px 12px', cursor: 'pointer' }}>
            Aprovar
          </button>
          <button onClick={() => alert(`TODO: PATCH /reservas/${mockReserva.id}/rejeitar`)} style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '4px 12px', cursor: 'pointer' }}>
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  )
}
