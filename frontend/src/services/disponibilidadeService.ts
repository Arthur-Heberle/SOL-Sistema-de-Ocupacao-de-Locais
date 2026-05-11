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
  todos: (idProjeto: number): { idUsuario: number; horarios: HorarioDTO[] }[] =>
    db.disponibilidades.all()
      .filter(d => d.idProjeto === idProjeto)
      .map(d => ({ idUsuario: d.idUsuario, horarios: d.horarios })),
}
