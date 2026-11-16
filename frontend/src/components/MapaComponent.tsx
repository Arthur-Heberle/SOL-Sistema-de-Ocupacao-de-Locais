import type { SalaDTO, ReservaDTO } from '../types'
import { useAuth } from '../context/AuthContext'
import { formatHora } from '../utils/datas'
import { TIPO_SALA_LABEL } from '../utils/rotulos'
import Badge from './ui/Badge'
import EmptyState from './ui/EmptyState'
import TimelineDiaComponent from './TimelineDiaComponent'
import styles from './MapaComponent.module.css'

export interface SalaComOcupacao {
  sala: SalaDTO
  reservas: ReservaDTO[]
}

interface Props {
  salas: SalaComOcupacao[]
  onSelecionar: (sala: SalaDTO) => void
}

export default function MapaComponent({ salas, onSelecionar }: Props) {
  const { tipoUsuario, idUsuario } = useAuth()
  const podeReservar = tipoUsuario !== 'ALUNO'

  if (salas.length === 0) {
    return <EmptyState title="Nenhuma sala encontrada">Ajuste os filtros para ver mais resultados.</EmptyState>
  }

  const porBloco = salas.reduce<Record<string, SalaComOcupacao[]>>((acc, item) => {
    (acc[item.sala.bloco] ??= []).push(item)
    return acc
  }, {})

  const tituloVisivel = (r: ReservaDTO) =>
    r.visibilidade === 'PUBLICA' || r.idUsuario === idUsuario || tipoUsuario === 'GESTOR'
      ? r.titulo
      : 'Atividade privada'

  return (
    <div className={styles.blocos}>
      {Object.entries(porBloco).map(([bloco, itens]) => (
        <section key={bloco} aria-labelledby={`bloco-${bloco}`}>
          <h2 id={`bloco-${bloco}`} className={styles.blocoTitulo}>
            Bloco {bloco}
            <span>{itens.length} {itens.length === 1 ? 'sala' : 'salas'}</span>
          </h2>
          <ul className={styles.grid}>
            {itens.map(({ sala, reservas }) => {
              const bloqueada = !sala.permiteReserva
              const clicavel = !bloqueada && podeReservar
              const estado = bloqueada ? 'bloqueada' : reservas.length > 0 ? 'parcial' : 'livre'
              const conteudo = (
                <>
                  <div className={styles.head}>
                    <span className={styles.codigo}>{sala.codigoNome}</span>
                    {estado === 'bloqueada' && <Badge tone="neutral">Somente consulta</Badge>}
                    {estado === 'livre' && <Badge tone="ok" dot>Livre</Badge>}
                    {estado === 'parcial' && (
                      <Badge tone="danger" dot>{reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'}</Badge>
                    )}
                  </div>
                  <div className={styles.meta}>
                    <span>{TIPO_SALA_LABEL[sala.tipoSala]}</span>
                    <span>{sala.capacidade} lugares</span>
                    {sala.possuiProjetor && <span>Projetor</span>}
                  </div>
                  {!bloqueada && (
                    <>
                      <TimelineDiaComponent reservas={reservas} />
                      <ul className={styles.agenda}>
                        {reservas.slice(0, 2).map(r => (
                          <li key={r.id}>
                            <span className={styles.hora}>{formatHora(r.dataInicio)}–{formatHora(r.dataFim)}</span>
                            <span className={styles.atividade}>{tituloVisivel(r)}</span>
                          </li>
                        ))}
                        {reservas.length > 2 && <li className={styles.mais}>+{reservas.length - 2} outras</li>}
                        {reservas.length === 0 && <li className={styles.vazio}>Sem reservas neste dia</li>}
                      </ul>
                    </>
                  )}
                  {bloqueada && <p className={styles.nota}>Sala administrativa, não disponível para reserva.</p>}
                  {clicavel && <span className={styles.cta}>Reservar</span>}
                </>
              )
              return (
                <li key={sala.id}>
                  {clicavel ? (
                    <button type="button" className={`${styles.card} ${styles[estado]} ${styles.clicavel}`} onClick={() => onSelecionar(sala)}>
                      {conteudo}
                    </button>
                  ) : (
                    <div className={`${styles.card} ${styles[estado]}`}>{conteudo}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
