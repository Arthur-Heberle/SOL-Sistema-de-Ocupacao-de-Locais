import { useState, useEffect } from 'react'
import type { SalaDTO, FiltroMapaDTO, ReservaDTO } from '../types'
import { salaService } from '../services/salaService'
import { reservaService } from '../services/reservaService'
import ModalReservaComponent from './ModalReservaComponent'

interface Props {
  filtro: FiltroMapaDTO
}

export default function MapaComponent({ filtro }: Props) {
  const [salas, setSalas] = useState<SalaDTO[]>([])
  const [salaSelecionada, setSalaSelecionada] = useState<SalaDTO | null>(null)
  const [reservas, setReservas] = useState<ReservaDTO[]>([])

  const recarregar = () => {
    setSalas(salaService.listar({ bloco: filtro.bloco }))
    setReservas(reservaService.listar({ status: 'APROVADA' }))
  }

  useEffect(recarregar, [filtro.bloco])

  const ocupada = (sala: SalaDTO) => reservas.some(r => r.idSala === sala.id)

  const corSala = (sala: SalaDTO): string => {
    if (!sala.permiteReserva) return '#e0e0e0'
    if (ocupada(sala)) return '#f5c6cb'
    return '#c8f7c5'
  }

  const porBloco = salas.reduce<Record<string, SalaDTO[]>>((acc, s) => {
    acc[s.bloco] = [...(acc[s.bloco] ?? []), s]
    return acc
  }, {})

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 12 }}>
        <span style={{ background: '#c8f7c5', padding: '2px 8px', borderRadius: 3 }}>Disponível</span>
        <span style={{ background: '#f5c6cb', padding: '2px 8px', borderRadius: 3 }}>Ocupada</span>
        <span style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: 3 }}>Somente visualização</span>
      </div>
      {Object.entries(porBloco).map(([bloco, rooms]) => (
        <div key={bloco} style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 8, fontSize: 14, color: '#444' }}>Bloco {bloco}</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {rooms.map(sala => (
              <div
                key={sala.id}
                onClick={() => sala.permiteReserva && setSalaSelecionada(sala)}
                style={{
                  background: corSala(sala),
                  border: '1px solid #bbb',
                  borderRadius: 6,
                  padding: '12px 16px',
                  minWidth: 130,
                  cursor: sala.permiteReserva ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
              >
                <div style={{ fontWeight: 700 }}>{sala.codigoNome}</div>
                <div style={{ fontSize: 11, color: '#555' }}>{sala.tipoSala}</div>
                <div style={{ fontSize: 11, color: '#555' }}>Cap: {sala.capacidade}</div>
                {sala.possuiProjetor && <div style={{ fontSize: 10, color: '#888' }}>Projetor</div>}
                {!sala.permiteReserva && <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>Somente visualização</div>}
                {ocupada(sala) && sala.permiteReserva && <div style={{ fontSize: 10, color: '#c00', marginTop: 4 }}>Ocupada</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {salaSelecionada && (
        <ModalReservaComponent
          sala={salaSelecionada}
          aberto={true}
          onFechar={() => setSalaSelecionada(null)}
          onCriada={() => { recarregar(); setSalaSelecionada(null) }}
        />
      )}
    </div>
  )
}
