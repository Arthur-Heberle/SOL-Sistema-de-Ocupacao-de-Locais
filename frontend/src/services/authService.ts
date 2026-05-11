import type { TipoUsuario } from '../types'
import { db } from './mockDB'

const CREDENTIALS: Record<string, { senha: string; tipoUsuario: TipoUsuario }> = {
  'gestor@utfpr.edu.br':   { senha: '123456', tipoUsuario: 'GESTOR' },
  'ana@utfpr.edu.br':      { senha: '123456', tipoUsuario: 'PROFESSOR' },
  'carlos@utfpr.edu.br':   { senha: '123456', tipoUsuario: 'TUTOR' },
  'maria@utfpr.edu.br':    { senha: '123456', tipoUsuario: 'ALUNO' },
  'joao@utfpr.edu.br':     { senha: '123456', tipoUsuario: 'ALUNO' },
}

export interface LoginResult {
  ok: boolean
  token?: string
  nome?: string
  tipoUsuario?: TipoUsuario
  idUsuario?: number
  erro?: string
}

export function login(email: string, senha: string): LoginResult {
  const cred = CREDENTIALS[email.toLowerCase()]
  if (!cred || cred.senha !== senha) {
    return { ok: false, erro: 'E-mail ou senha incorretos.' }
  }
  const usuario = db.usuarios.all().find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!usuario || !usuario.ativo) {
    return { ok: false, erro: 'Usuário inativo ou não encontrado.' }
  }
  return {
    ok: true,
    token: `mock-token-${Date.now()}`,
    nome: usuario.nome,
    tipoUsuario: usuario.tipoUsuario,
    idUsuario: usuario.id,
  }
}
