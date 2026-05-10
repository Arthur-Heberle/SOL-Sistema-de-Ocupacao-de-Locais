import type { DisciplinaDTO } from '../types'
import { db } from './mockDB'

export const disciplinaService = {
  listar: (): DisciplinaDTO[] => db.disciplinas.all(),
  criar: (dados: Omit<DisciplinaDTO, 'id'>): DisciplinaDTO => {
    const disciplinas = db.disciplinas.all()
    const nova = { ...dados, id: db.nextId(disciplinas) }
    db.disciplinas.save([...disciplinas, nova])
    return nova
  },
  excluir: (id: number): void => {
    db.disciplinas.save(db.disciplinas.all().filter(d => d.id !== id))
  },
}
