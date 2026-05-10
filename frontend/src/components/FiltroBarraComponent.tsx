import { useState } from 'react'
import type { FiltroMapaDTO } from '../types'
import { salaService } from '../services/salaService'

interface Props {
  onFiltroChange: (filtro: FiltroMapaDTO) => void
}

export default function FiltroBarraComponent({ onFiltroChange }: Props) {
  const blocos = salaService.blocos()
  const [bloco, setBloco] = useState('')
  const [dataFoco, setDataFoco] = useState(new Date().toISOString().split('T')[0])

  const aplicar = () => onFiltroChange({ bloco: bloco || undefined, dataFoco })
  const limpar = () => {
    setBloco('')
    setDataFoco(new Date().toISOString().split('T')[0])
    onFiltroChange({})
  }

  return (
    <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <label style={{ fontSize: 13 }}>
        Bloco<br />
        <select value={bloco} onChange={e => setBloco(e.target.value)} style={{ padding: '6px 8px', minWidth: 120 }}>
          <option value="">Todos</option>
          {blocos.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      <label style={{ fontSize: 13 }}>
        Data<br />
        <input type="date" value={dataFoco} onChange={e => setDataFoco(e.target.value)} style={{ padding: '6px 8px' }} />
      </label>
      <button onClick={aplicar} style={{ padding: '6px 16px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        Filtrar
      </button>
      <button onClick={limpar} style={{ padding: '6px 12px', cursor: 'pointer' }}>
        Limpar
      </button>
    </div>
  )
}
