import { useState } from 'react'
import type { FiltroMapaDTO } from '../types'
import FiltroBarraComponent from '../components/FiltroBarraComponent'
import MapaComponent from '../components/MapaComponent'
import CalendarioComponent from '../components/CalendarioComponent'
import { reservaService } from '../services/reservaService'
import { salaService } from '../services/salaService'

type Tab = 'mapa' | 'calendario'

export default function MapaPage() {
  const [filtro, setFiltro] = useState<FiltroMapaDTO>({})
  const [tab, setTab] = useState<Tab>('mapa')

  const reservas = reservaService.listar({ status: 'APROVADA' })
  const salas = salaService.listar()

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '8px 20px', cursor: 'pointer', border: 'none',
    background: tab === t ? '#1a1a2e' : '#eee',
    color: tab === t ? '#fff' : '#333',
    borderRadius: '4px 4px 0 0',
  })

  return (
    <main>
      <h1>Mapa de Salas</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>Visualize e reserve salas da UTFPR</p>
      <FiltroBarraComponent onFiltroChange={setFiltro} />
      <div style={{ display: 'flex', gap: 4, marginBottom: -1 }}>
        <button style={tabStyle('mapa')} onClick={() => setTab('mapa')}>Mapa de Salas</button>
        <button style={tabStyle('calendario')} onClick={() => setTab('calendario')}>Grade de Horários</button>
      </div>
      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: '0 4px 4px 4px' }}>
        {tab === 'mapa' ? (
          <MapaComponent filtro={filtro} />
        ) : (
          <CalendarioComponent reservas={reservas} salas={salas} />
        )}
      </div>
    </main>
  )
}
