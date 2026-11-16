import type { ReservaDTO, StatusReserva } from '../types'
import { db } from './mockDB'
import { salaService } from './salaService'
import { projetoService } from './projetoService'
import { parseISODate } from '../utils/datas'

/** True when a reservation happens on the given day (recurring ones repeat weekly from their start date). */
export function ocorreEm(r: ReservaDTO, dataISO: string): boolean {
  const inicio = r.dataInicio.slice(0, 10)
  if (!r.recorrente) return inicio === dataISO
  return inicio <= dataISO && parseISODate(inicio).getDay() === parseISODate(dataISO).getDay()
}

function atualizarStatus(id: number, status: StatusReserva): void {
  const reservas = db.reservas.all()
  const idx = reservas.findIndex(r => r.id === id)
  if (idx !== -1) { reservas[idx].status = status; db.reservas.save(reservas) }
}

export const reservaService = {
  listar: (filtros?: { status?: StatusReserva; idSala?: number }): ReservaDTO[] =>
    db.reservas.all().filter(r =>
      (!filtros?.status || r.status === filtros.status) &&
      (!filtros?.idSala || r.idSala === filtros.idSala)
    ),
  pendentes: (): ReservaDTO[] =>
    db.reservas.all().filter(r => r.status === 'PENDENTE'),
  /** Approved reservations of a room on a given day, sorted by start time. */
  doDia: (idSala: number, dataISO: string): ReservaDTO[] =>
    db.reservas.all()
      .filter(r => r.idSala === idSala && r.status === 'APROVADA' && ocorreEm(r, dataISO))
      .sort((a, b) => a.dataInicio.slice(11).localeCompare(b.dataInicio.slice(11))),
  /** Day bookings in free rooms are auto-approved; project rooms (non-members), recurring and conflicting requests go to the Gestor. */
  criar: (dados: Omit<ReservaDTO, 'id' | 'status'>): ReservaDTO => {
    const reservas = db.reservas.all()
    const sala = salaService.buscarPorId(dados.idSala)
    if (!sala) throw new Error('Sala não encontrada.')
    if (!sala.permiteReserva) throw new Error(`A sala ${sala.codigoNome} não aceita reservas.`)

    const dia = dados.dataInicio.slice(0, 10)
    const hIni = dados.dataInicio.slice(11, 16)
    const hFim = dados.dataFim.slice(11, 16)
    const conflito = reservas.some(r =>
      r.idSala === dados.idSala && r.status === 'APROVADA' && ocorreEm(r, dia) &&
      hIni < r.dataFim.slice(11, 16) && hFim > r.dataInicio.slice(11, 16)
    )

    const membroDaSala = projetoService.isMembroDaSala(dados.idUsuario, sala.id)
    const status: StatusReserva =
      (sala.tipoSala === 'PROJETO' && !membroDaSala) || dados.recorrente || conflito
        ? 'PENDENTE' : 'APROVADA'

    const nova: ReservaDTO = { ...dados, id: db.nextId(reservas), status }
    db.reservas.save([...reservas, nova])
    return nova
  },
  aprovar: (id: number): void => atualizarStatus(id, 'APROVADA'),
  rejeitar: (id: number): void => atualizarStatus(id, 'REJEITADA'),
  reservasDaSala: (idSala: number): ReservaDTO[] =>
    db.reservas.all().filter(r => r.idSala === idSala && r.status === 'APROVADA'),
}
