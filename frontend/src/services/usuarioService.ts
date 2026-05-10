import type { UsuarioDTO } from '../types'
import { db } from './mockDB'

export const usuarioService = {
  listar: (): UsuarioDTO[] => db.usuarios.all(),
  criar: (dados: Omit<UsuarioDTO, 'id'>): UsuarioDTO => {
    const usuarios = db.usuarios.all()
    const novo = { ...dados, id: db.nextId(usuarios) }
    db.usuarios.save([...usuarios, novo])
    return novo
  },
  atualizar: (id: number, dados: Partial<UsuarioDTO>): void => {
    const usuarios = db.usuarios.all()
    const idx = usuarios.findIndex(u => u.id === id)
    if (idx !== -1) { usuarios[idx] = { ...usuarios[idx], ...dados }; db.usuarios.save(usuarios) }
  },
  toggleAtivo: (id: number): void => {
    const usuarios = db.usuarios.all()
    const idx = usuarios.findIndex(u => u.id === id)
    if (idx !== -1) { usuarios[idx].ativo = !usuarios[idx].ativo; db.usuarios.save(usuarios) }
  },
}
