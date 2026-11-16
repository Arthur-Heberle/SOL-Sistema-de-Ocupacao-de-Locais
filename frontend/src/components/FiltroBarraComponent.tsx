import { useState } from 'react'
import type { FormEvent } from 'react'
import type { FiltroMapaDTO, TipoSala } from '../types'
import { salaService } from '../services/salaService'
import { hojeISO } from '../utils/datas'
import { TIPO_SALA_LABEL } from '../utils/rotulos'
import Button from './ui/Button'
import Field from './ui/Field'
import Checkbox from './ui/Checkbox'
import styles from './FiltroBarraComponent.module.css'

interface Props {
  filtro: FiltroMapaDTO
  onFiltroChange: (filtro: FiltroMapaDTO) => void
}

const FILTRO_PADRAO = (): FiltroMapaDTO => ({ dataFoco: hojeISO() })

export default function FiltroBarraComponent({ filtro, onFiltroChange }: Props) {
  const blocos = salaService.blocos()
  const [rascunho, setRascunho] = useState<FiltroMapaDTO>(filtro)
  const set = (patch: Partial<FiltroMapaDTO>) => setRascunho(prev => ({ ...prev, ...patch }))

  const aplicar = (e: FormEvent) => {
    e.preventDefault()
    onFiltroChange(rascunho)
  }

  const limpar = () => {
    const padrao = FILTRO_PADRAO()
    setRascunho(padrao)
    onFiltroChange(padrao)
  }

  return (
    <form className={styles.bar} onSubmit={aplicar} aria-label="Filtros do mapa">
      <Field label="Data">
        <input type="date" value={rascunho.dataFoco ?? ''} onChange={e => set({ dataFoco: e.target.value || undefined })} />
      </Field>
      <Field label="Bloco">
        <select value={rascunho.bloco ?? ''} onChange={e => set({ bloco: e.target.value || undefined })}>
          <option value="">Todos os blocos</option>
          {blocos.map(b => <option key={b} value={b}>Bloco {b}</option>)}
        </select>
      </Field>
      <Field label="Tipo de sala">
        <select value={rascunho.tipoSala ?? ''} onChange={e => set({ tipoSala: (e.target.value || undefined) as TipoSala | undefined })}>
          <option value="">Todos os tipos</option>
          {(Object.keys(TIPO_SALA_LABEL) as TipoSala[]).map(t => <option key={t} value={t}>{TIPO_SALA_LABEL[t]}</option>)}
        </select>
      </Field>
      <Field label="Capacidade mínima">
        <input
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="Qualquer"
          value={rascunho.capacidadeMin ?? ''}
          onChange={e => set({ capacidadeMin: e.target.value ? Number(e.target.value) : undefined })}
        />
      </Field>
      <div className={styles.checks}>
        <Checkbox checked={!!rascunho.comProjetor} onChange={v => set({ comProjetor: v || undefined })} label="Com projetor" />
        <Checkbox checked={!!rascunho.apenasLivres} onChange={v => set({ apenasLivres: v || undefined })} label="Apenas livres" />
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={limpar}>Limpar</Button>
        <Button type="submit">Aplicar filtros</Button>
      </div>
    </form>
  )
}
