import type { ReservaDTO } from '../types'
import { formatHora } from '../utils/datas'
import styles from './TimelineDiaComponent.module.css'

const INICIO = 8
const FIM = 18
const MARCAS = [8, 10, 12, 14, 16, 18]

const minutos = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))
const pct = (min: number) => Math.min(100, Math.max(0, ((min - INICIO * 60) / ((FIM - INICIO) * 60)) * 100))

interface Props {
  reservas: ReservaDTO[]
  /** Optional highlighted interval (HH:MM), e.g. the slot being requested. */
  destaque?: { inicio: string; fim: string }
}

/** Horizontal 08h-18h bar showing which periods of the day are booked. */
export default function TimelineDiaComponent({ reservas, destaque }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.track} role="img" aria-label={`${reservas.length} período(s) reservado(s) entre 8h e 18h`}>
        {reservas.map(r => {
          const ini = pct(minutos(formatHora(r.dataInicio)))
          const fim = pct(minutos(formatHora(r.dataFim)))
          return <span key={r.id} className={styles.busy} style={{ left: `${ini}%`, width: `${fim - ini}%` }} />
        })}
        {destaque && destaque.fim > destaque.inicio && (
          <span
            className={styles.highlight}
            style={{ left: `${pct(minutos(destaque.inicio))}%`, width: `${pct(minutos(destaque.fim)) - pct(minutos(destaque.inicio))}%` }}
          />
        )}
      </div>
      <div className={styles.ticks} aria-hidden>
        {MARCAS.map(h => <span key={h} style={{ left: `${pct(h * 60)}%` }}>{h}h</span>)}
      </div>
    </div>
  )
}
