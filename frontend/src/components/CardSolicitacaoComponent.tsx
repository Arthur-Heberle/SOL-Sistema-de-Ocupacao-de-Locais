import { formatData, formatHora } from '../utils/datas'
import type { ReservaDTO } from '../types'
import { salaService } from '../services/salaService'
import { TIPO_SALA_LABEL } from '../utils/rotulos'
import Badge from './ui/Badge'
import Button from './ui/Button'
import styles from './CardSolicitacaoComponent.module.css'

interface Props {
  reserva: ReservaDTO
  onAprovar?: (id: number) => void
  onRejeitar?: (id: number) => void
}

export default function CardSolicitacaoComponent({ reserva, onAprovar, onRejeitar }: Props) {
  const sala = salaService.buscarPorId(reserva.idSala)
  const inicio = `${formatData(reserva.dataInicio)}, ${formatHora(reserva.dataInicio)}`
  const fim = formatHora(reserva.dataFim)
  const podeGerenciar = !!onAprovar && !!onRejeitar

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div>
          <h3 className={styles.title}>{reserva.titulo}</h3>
          <p className={styles.sala}>
            {sala ? `${sala.codigoNome} · ${TIPO_SALA_LABEL[sala.tipoSala]}` : `Sala #${reserva.idSala}`}
          </p>
          <p className={styles.data}>{inicio} às {fim}</p>
        </div>
        <div className={styles.badges}>
          {reserva.recorrente && <Badge tone="info">Semanal</Badge>}
          <Badge tone="warn" dot>Pendente</Badge>
        </div>
      </div>
      {podeGerenciar ? (
        <div className={styles.actions}>
          <Button size="sm" variant="success" onClick={() => onAprovar!(reserva.id)}>Aprovar</Button>
          <Button size="sm" variant="danger" onClick={() => onRejeitar!(reserva.id)}>Rejeitar</Button>
        </div>
      ) : (
        <p className={styles.note}>Aguardando análise do Gestor de Salas.</p>
      )}
    </article>
  )
}
