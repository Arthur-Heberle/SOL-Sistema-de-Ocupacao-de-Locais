import type { SalaDTO, TipoSala } from '../types'
import { db } from './mockDB'

export interface FiltroSalas {
  bloco?: string
  tipoSala?: TipoSala
  capacidadeMin?: number
  comProjetor?: boolean
}

export const salaService = {
  listar: (filtros: FiltroSalas = {}): SalaDTO[] =>
    db.salas.all().filter(s =>
      (!filtros.bloco || s.bloco === filtros.bloco) &&
      (!filtros.tipoSala || s.tipoSala === filtros.tipoSala) &&
      (!filtros.capacidadeMin || s.capacidade >= filtros.capacidadeMin) &&
      (!filtros.comProjetor || s.possuiProjetor)
    ),
  buscarPorId: (id: number): SalaDTO | undefined =>
    db.salas.all().find(s => s.id === id),
  blocos: (): string[] => [...new Set(db.salas.all().map(s => s.bloco))].sort(),
  criar: (sala: Omit<SalaDTO, 'id'>): SalaDTO => {
    const salas = db.salas.all()
    const nova = { ...sala, id: db.nextId(salas) }
    db.salas.save([...salas, nova])
    return nova
  },
  atualizar: (id: number, dados: Partial<SalaDTO>): SalaDTO | null => {
    const salas = db.salas.all()
    const idx = salas.findIndex(s => s.id === id)
    if (idx === -1) return null
    salas[idx] = { ...salas[idx], ...dados }
    db.salas.save(salas)
    return salas[idx]
  },
  excluir: (id: number): void => {
    db.salas.save(db.salas.all().filter(s => s.id !== id))
    db.reservas.save(db.reservas.all().filter(r => r.idSala !== id))
  },
}
