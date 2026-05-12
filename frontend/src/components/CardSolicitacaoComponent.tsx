import type { ReservaDTO } from '../types'
import { salaService } from '../services/salaService'

interface Props {
  reserva: ReservaDTO
  onAprovar?: (id: number) => void
  onRejeitar?: (id: number) => void
}

export default function CardSolicitacaoComponent({ reserva, onAprovar, onRejeitar }: Props) {
  const sala = salaService.buscarPorId(reserva.idSala)
  const inicio = new Date(reserva.dataInicio).toLocaleString('pt-BR')
  const fim = new Date(reserva.dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const podeGerenciar = !!onAprovar && !!onRejeitar

  return (
    <div style={{ border: '1px solid #f0ad4e', borderRadius: 6, padding: 16, marginBottom: 12, maxWidth: 560 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{reserva.titulo}</div>
          <div style={{ fontSize: 13, color: '#555', margin: '4px 0' }}>
            {sala ? `${sala.codigoNome} (${sala.tipoSala})` : `Sala #${reserva.idSala}`}
          </div>
          <div style={{ fontSize: 12, color: '#777' }}>{inicio} até {fim}</div>
          {reserva.recorrente && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Recorrente (semanal)</div>}
        </div>
        <span style={{ background: '#f0ad4e', color: '#fff', padding: '3px 8px', borderRadius: 4, fontSize: 12, whiteSpace: 'nowrap' }}>
          PENDENTE
        </span>
      </div>
      {podeGerenciar ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={() => onAprovar!(reserva.id)}
            style={{ background: '#5cb85c', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4, cursor: 'pointer' }}
          >
            Aprovar
          </button>
          <button
            onClick={() => onRejeitar!(reserva.id)}
            style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4, cursor: 'pointer' }}
          >
            Rejeitar
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 10, fontSize: 12, color: '#856404' }}>
          Aguardando análise do Gestor de Salas.
        </div>
      )}
    </div>
  )
}
