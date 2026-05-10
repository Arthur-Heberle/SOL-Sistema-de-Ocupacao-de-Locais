export type TipoUsuario = 'ALUNO' | 'PROFESSOR' | 'TUTOR' | 'GESTOR'
export type TipoSala = 'LABORATORIO' | 'AULA' | 'PROJETO' | 'DEPARTAMENTO'
export type StatusReserva = 'PENDENTE' | 'APROVADA' | 'REJEITADA'
export type Visibilidade = 'PUBLICA' | 'PRIVADA'
export type CategoriaProj = 'ENSINO' | 'PESQUISA' | 'EXTENSAO' | 'GESTAO'

export interface UsuarioDTO {
  id: number
  nome: string
  email: string
  tipoUsuario: TipoUsuario
  ativo: boolean
}

export interface SalaDTO {
  id: number
  bloco: string
  codigoNome: string
  tipoSala: TipoSala
  capacidade: number
  possuiProjetor: boolean
  permiteReserva: boolean
}

export interface ReservaDTO {
  id: number
  idSala: number
  idUsuario: number
  titulo: string
  visibilidade: Visibilidade
  dataInicio: string
  dataFim: string
  recorrente: boolean
  status: StatusReserva
}

export interface ProjetoDTO {
  id: number
  nome: string
  descricao: string
  categoria: CategoriaProj
  idTutor: number
  idSalaExclusiva?: number
  aprovado: boolean
}

export interface FiltroMapaDTO {
  bloco?: string
  dataFoco?: string
  idProjeto?: number
}

export interface AuthTokenDTO {
  token: string
  expiracao: string
}

export interface LoginDTO {
  email: string
  senha: string
}

export interface DisponibilidadeDTO {
  idUsuario: number
  matrizHorarios: HorarioDTO[]
}

export interface HorarioDTO {
  diaSemana: string
  horaInicio: string
  horaFim: string
}
