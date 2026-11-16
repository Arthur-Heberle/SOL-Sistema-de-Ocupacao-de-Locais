import type { ReservaDTO, SalaDTO } from '../types'
import { useAuth } from '../context/AuthContext'
import { ocorreEm } from '../services/reservaService'
import { formatDiaMes, formatHora, hojeISO, segundaDaSemana, toISODate } from '../utils/datas'
import { DIAS_SEMANA_CURTO, HORAS_GRADE } from '../utils/rotulos'
import styles from './CalendarioComponent.module.css'

interface Props {
  reservas: ReservaDTO[]
  salas: SalaDTO[]
  dataFoco?: string
}

/** Weekly grid (Mon-Fri, 08h-17h) of approved reservations. */
export default function CalendarioComponent({ reservas, salas, dataFoco }: Props) {
  const { idUsuario, tipoUsuario } = useAuth()
  const ref = dataFoco ?? hojeISO()
  const hoje = hojeISO()
  const segunda = segundaDaSemana(ref)
  const dias = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(segunda)
    d.setDate(d.getDate() + i)
    return d
  })
  const diasISO = dias.map(toISODate)
  const codigoSala = (id: number) => salas.find(s => s.id === id)?.codigoNome ?? `#${id}`
  const visivel = (r: ReservaDTO) =>
    r.visibilidade === 'PUBLICA' || r.idUsuario === idUsuario || tipoUsuario === 'GESTOR'

  const naHora = (diaISO: string, hora: string) =>
    reservas.filter(r => formatHora(r.dataInicio).slice(0, 2) === hora.slice(0, 2) && ocorreEm(r, diaISO))

  return (
    <div className={styles.wrap}>
      <p className={styles.semana}>
        Semana de {formatDiaMes(dias[0])} a {formatDiaMes(dias[4])} de {dias[4].getFullYear()}
      </p>
      <div className={styles.scroll}>
        <table className={styles.grade}>
          <thead>
            <tr>
              <th scope="col" className={styles.horaCol}><span className="visually-hidden">Hora</span></th>
              {dias.map((d, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`${diasISO[i] === ref ? styles.foco : ''} ${diasISO[i] === hoje ? styles.hoje : ''}`}
                >
                  <span className={styles.diaNome}>{DIAS_SEMANA_CURTO[i]}</span>
                  <span className={styles.diaData}>{formatDiaMes(d)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HORAS_GRADE.map(hora => (
              <tr key={hora}>
                <th scope="row" className={styles.horaCol}>{hora}</th>
                {diasISO.map(dia => (
                  <td key={dia} className={dia === ref ? styles.foco : undefined}>
                    {naHora(dia, hora).map(r => (
                      <div key={r.id} className={`${styles.evento} ${visivel(r) ? '' : styles.privado}`}>
                        <span className={styles.eventoTitulo}>{visivel(r) ? r.titulo : 'Atividade privada'}</span>
                        <span className={styles.eventoMeta}>
                          {codigoSala(r.idSala)} · {formatHora(r.dataInicio)}–{formatHora(r.dataFim)}
                        </span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
