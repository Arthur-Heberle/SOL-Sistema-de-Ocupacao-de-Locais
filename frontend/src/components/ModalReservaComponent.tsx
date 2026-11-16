import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SalaDTO, Visibilidade } from '../types'
import { useAuth } from '../context/AuthContext'
import { reservaService } from '../services/reservaService'
import { projetoService } from '../services/projetoService'
import { formatHora, hojeISO } from '../utils/datas'
import { TIPO_SALA_LABEL } from '../utils/rotulos'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Field from './ui/Field'
import Checkbox from './ui/Checkbox'
import Alert from './ui/Alert'
import Badge from './ui/Badge'
import TimelineDiaComponent from './TimelineDiaComponent'
import styles from './ModalReservaComponent.module.css'

interface Props {
  sala: SalaDTO
  dataInicial?: string
  onFechar: () => void
  onCriada: () => void
}

export default function ModalReservaComponent({ sala, dataInicial, onFechar, onCriada }: Props) {
  const { idUsuario } = useAuth()
  const formId = `form-reserva-${sala.id}`

  const [titulo, setTitulo] = useState('')
  const [visibilidade, setVisibilidade] = useState<Visibilidade>('PUBLICA')
  const [data, setData] = useState(dataInicial ?? hojeISO())
  const [horaInicio, setHoraInicio] = useState('08:00')
  const [horaFim, setHoraFim] = useState('10:00')
  const [recorrente, setRecorrente] = useState(false)
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState<'APROVADA' | 'PENDENTE' | null>(null)

  const reservasDoDia = reservaService.doDia(sala.id, data)
  const conflito = reservasDoDia.some(r => horaInicio < formatHora(r.dataFim) && horaFim > formatHora(r.dataInicio))
  const membroDoProjeto = idUsuario !== null && projetoService.isMembroDaSala(idUsuario, sala.id)
  const motivoAprovacao =
    sala.tipoSala === 'PROJETO' && !membroDoProjeto ? 'Salas de projeto exigem aprovação do Gestor para quem não é membro.'
    : recorrente ? 'Reservas semanais (semestrais) exigem aprovação do Gestor.'
    : conflito ? 'O horário escolhido conflita com uma reserva existente; o Gestor irá analisar.'
    : null

  const confirmar = (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!titulo.trim()) { setErro('Informe o título da atividade.'); return }
    if (horaFim <= horaInicio) { setErro('O horário de término deve ser após o início.'); return }
    if (idUsuario === null) { setErro('Sessão expirada. Entre novamente.'); return }
    try {
      const nova = reservaService.criar({
        idSala: sala.id,
        idUsuario,
        titulo: titulo.trim(),
        visibilidade,
        dataInicio: `${data}T${horaInicio}`,
        dataFim: `${data}T${horaFim}`,
        recorrente,
      })
      setResultado(nova.status === 'APROVADA' ? 'APROVADA' : 'PENDENTE')
      onCriada()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível criar a reserva.')
    }
  }

  const subtitle = (
    <span className={styles.meta}>
      <Badge tone="neutral">{TIPO_SALA_LABEL[sala.tipoSala]}</Badge>
      <span>Bloco {sala.bloco}</span>
      <span>{sala.capacidade} lugares</span>
      {sala.possuiProjetor && <span>Projetor</span>}
    </span>
  )

  return (
    <Modal
      open
      onClose={onFechar}
      title={`Reservar ${sala.codigoNome}`}
      subtitle={subtitle}
      footer={resultado ? (
        <Button onClick={onFechar}>Concluir</Button>
      ) : (
        <>
          <Button variant="secondary" onClick={onFechar}>Cancelar</Button>
          <Button type="submit" form={formId}>{motivoAprovacao ? 'Enviar solicitação' : 'Confirmar reserva'}</Button>
        </>
      )}
    >
      {resultado === 'APROVADA' && (
        <Alert tone="ok" title="Reserva confirmada">
          {titulo} em {sala.codigoNome}, {data.split('-').reverse().join('/')} das {horaInicio} às {horaFim}.
        </Alert>
      )}
      {resultado === 'PENDENTE' && (
        <Alert tone="warn" title="Solicitação enviada">
          Sua solicitação foi registrada e aguarda aprovação do Gestor de Salas. Acompanhe em Solicitações.
        </Alert>
      )}
      {!resultado && <form id={formId} className={styles.form} onSubmit={confirmar} noValidate>
        <Field label="Título da atividade" required>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex.: Aula de Cálculo Numérico" autoFocus />
        </Field>

        <div className={styles.row}>
          <Field label="Data" className={styles.wide}>
            <input type="date" value={data} onChange={e => setData(e.target.value)} />
          </Field>
          <Field label="Início">
            <input type="time" value={horaInicio} step={900} onChange={e => setHoraInicio(e.target.value)} />
          </Field>
          <Field label="Término">
            <input type="time" value={horaFim} step={900} onChange={e => setHoraFim(e.target.value)} />
          </Field>
        </div>

        <div className={styles.ocupacao}>
          <div className={styles.ocupacaoHead}>
            <span>Ocupação no dia</span>
            <span className={styles.legenda}>
              <i className={styles.lgBusy} /> Reservado <i className={styles.lgSel} /> Seu horário
            </span>
          </div>
          <TimelineDiaComponent reservas={reservasDoDia} destaque={{ inicio: horaInicio, fim: horaFim }} />
          {reservasDoDia.length > 0 && (
            <ul className={styles.lista}>
              {reservasDoDia.map(r => (
                <li key={r.id}>
                  <span className={styles.hora}>{formatHora(r.dataInicio)}–{formatHora(r.dataFim)}</span>
                  {r.visibilidade === 'PUBLICA' || r.idUsuario === idUsuario ? r.titulo : 'Atividade privada'}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.row}>
          <Field label="Visibilidade" className={styles.wide}>
            <select value={visibilidade} onChange={e => setVisibilidade(e.target.value as Visibilidade)}>
              <option value="PUBLICA">Pública, visível a todos</option>
              <option value="PRIVADA">Privada, só eu e o Gestor</option>
            </select>
          </Field>
        </div>

        <Checkbox
          checked={recorrente}
          onChange={setRecorrente}
          label="Repetir semanalmente"
          description="Reserva semestral no mesmo dia e horário."
        />

        {motivoAprovacao && <Alert tone="warn" title="Requer aprovação">{motivoAprovacao}</Alert>}
        {erro && <Alert tone="danger">{erro}</Alert>}
      </form>}
    </Modal>
  )
}
