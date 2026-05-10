import type { SalaDTO } from '../types'

export default function MapaComponent() {
  const mockRooms: SalaDTO[] = [
    { id: 1, bloco: 'CB', codigoNome: 'CB-001', tipoSala: 'AULA', capacidade: 40, possuiProjetor: true, permiteReserva: true },
    { id: 2, bloco: 'CB', codigoNome: 'CB-002', tipoSala: 'LABORATORIO', capacidade: 30, possuiProjetor: true, permiteReserva: true },
    { id: 3, bloco: 'CB', codigoNome: 'CB-003', tipoSala: 'PROJETO', capacidade: 10, possuiProjetor: false, permiteReserva: true },
    { id: 4, bloco: 'CB', codigoNome: 'CB-DEPT', tipoSala: 'DEPARTAMENTO', capacidade: 5, possuiProjetor: false, permiteReserva: false },
  ]

  const roomColor = (sala: SalaDTO) => {
    if (!sala.permiteReserva) return '#e0e0e0'
    return '#c8f7c5'
  }

  return (
    <div>
      <strong>[MapaComponent]</strong>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        TODO: load from SalaApiService · green=available, red=occupied, grey=DEPARTAMENTO · click → ModalReservaComponent
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {mockRooms.map(sala => (
          <div
            key={sala.id}
            onClick={() => alert(`TODO: open ModalReservaComponent for sala ${sala.codigoNome}`)}
            style={{
              background: roomColor(sala),
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '12px 16px',
              cursor: sala.permiteReserva ? 'pointer' : 'not-allowed',
              minWidth: 120,
            }}
          >
            <strong>{sala.codigoNome}</strong><br />
            <span style={{ fontSize: 12 }}>{sala.tipoSala}</span><br />
            <span style={{ fontSize: 11, color: '#555' }}>Cap: {sala.capacidade}</span>
            {!sala.permiteReserva && <div style={{ fontSize: 10, color: '#999' }}>Somente visualização</div>}
          </div>
        ))}
      </div>
      {/* TODO: ModalReservaComponent rendered here, controlled by modalAberto state */}
    </div>
  )
}
