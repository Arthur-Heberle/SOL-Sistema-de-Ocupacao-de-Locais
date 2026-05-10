import type { ProjetoDTO, MembroProjetoDTO } from '../types'
import { db } from './mockDB'

export const projetoService = {
  listar: (): ProjetoDTO[] => db.projetos.all(),
  buscarPorId: (id: number): ProjetoDTO | undefined =>
    db.projetos.all().find(p => p.id === id),
  criar: (dados: Omit<ProjetoDTO, 'id' | 'aprovado'>): ProjetoDTO => {
    const projetos = db.projetos.all()
    const novo: ProjetoDTO = { ...dados, id: db.nextId(projetos), aprovado: false }
    db.projetos.save([...projetos, novo])
    return novo
  },
  membros: (idProjeto: number): MembroProjetoDTO[] =>
    db.membros.all().filter(m => m.idProjeto === idProjeto),
  adicionarMembro: (membro: Omit<MembroProjetoDTO, 'id'>): MembroProjetoDTO => {
    const membros = db.membros.all()
    const novo = { ...membro, id: db.nextId(membros) }
    db.membros.save([...membros, novo])
    return novo
  },
  removerMembro: (id: number): void => {
    db.membros.save(db.membros.all().filter(m => m.id !== id))
  },
}
