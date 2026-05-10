import type { HorarioDTO } from '../types'
import { db } from './mockDB'

export const disponibilidadeService = {
  salvar: (idUsuario: number, idProjeto: number, horarios: HorarioDTO[]): void => {
    const all = db.disponibilidades.all()
    const idx = all.findIndex(d => d.idUsuario === idUsuario && d.idProjeto === idProjeto)
    if (idx !== -1) {
      all[idx].horarios = horarios
    } else {
      all.push({ idUsuario, idProjeto, horarios })
    }
    db.disponibilidades.save(all)
  },
  carregar: (idUsuario: number, idProjeto: number): HorarioDTO[] => {
    const entry = db.disponibilidades.all()
      .find(d => d.idUsuario === idUsuario && d.idProjeto === idProjeto)
    return entry?.horarios ?? []
  },
  interseccao: (idProjeto: number): HorarioDTO[] => {
    const all = db.disponibilidades.all().filter(d => d.idProjeto === idProjeto)
    if (all.length === 0) return []
    const first = all[0].horarios
    return first.filter(slot =>
      all.every(d =>
        d.horarios.some(h => h.diaSemana === slot.diaSemana && h.horaInicio === slot.horaInicio)
      )
    )
  },
}
