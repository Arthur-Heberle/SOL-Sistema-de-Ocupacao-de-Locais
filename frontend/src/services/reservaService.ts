import type { ReservaDTO, StatusReserva } from '../types'
import { db } from './mockDB'
import { salaService } from './salaService'

export const reservaService = {
  listar: (filtros?: { status?: StatusReserva; idSala?: number }): ReservaDTO[] => {
    let r = db.reservas.all()
    if (filtros?.status) r = r.filter(x => x.status === filtros.status)
    if (filtros?.idSala) r = r.filter(x => x.idSala === filtros.idSala)
    return r
  },
  pendentes: (): ReservaDTO[] =>
    db.reservas.all().filter(r => r.status === 'PENDENTE'),
  criar: (dados: Omit<ReservaDTO, 'id' | 'status'>): ReservaDTO => {
    const reservas = db.reservas.all()
    const sala = salaService.buscarPorId(dados.idSala)
    if (sala && !sala.permiteReserva) throw new Error(`Sala ${sala.codigoNome} não permite reservas.`)
    const status: StatusReserva =
      sala?.tipoSala === 'PROJETO' ? 'PENDENTE' : 'APROVADA'
    const nova: ReservaDTO = { ...dados, id: db.nextId(reservas), status }
    db.reservas.save([...reservas, nova])
    return nova
  },
  aprovar: (id: number): void => {
    const reservas = db.reservas.all()
    const idx = reservas.findIndex(r => r.id === id)
    if (idx !== -1) { reservas[idx].status = 'APROVADA'; db.reservas.save(reservas) }
  },
  rejeitar: (id: number): void => {
    const reservas = db.reservas.all()
    const idx = reservas.findIndex(r => r.id === id)
    if (idx !== -1) { reservas[idx].status = 'REJEITADA'; db.reservas.save(reservas) }
  },
  reservasDaSala: (idSala: number): ReservaDTO[] =>
    db.reservas.all().filter(r => r.idSala === idSala && r.status === 'APROVADA'),
}
