import type { TipoUsuario } from '../types'
import { db } from './mockDB'

/** Mock credential check: every seeded account uses the same demo password. */
const SENHA_DEMO = '123456'

export interface LoginResult {
  ok: boolean
  token?: string
  nome?: string
  tipoUsuario?: TipoUsuario
  idUsuario?: number
  erro?: string
}

export function login(email: string, senha: string): LoginResult {
  const usuario = db.usuarios.all().find(u => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!usuario || senha !== SENHA_DEMO) {
    return { ok: false, erro: 'E-mail ou senha incorretos.' }
  }
  if (!usuario.ativo) {
    return { ok: false, erro: 'Usuário inativo. Procure o Gestor de Salas.' }
  }
  return {
    ok: true,
    token: `mock-token-${Date.now()}`,
    nome: usuario.nome,
    tipoUsuario: usuario.tipoUsuario,
    idUsuario: usuario.id,
  }
}
