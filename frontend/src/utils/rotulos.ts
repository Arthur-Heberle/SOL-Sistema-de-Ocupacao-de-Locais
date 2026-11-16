import type { CategoriaProj, StatusReserva, TipoSala, TipoUsuario } from '../types'

export const TIPO_SALA_LABEL: Record<TipoSala, string> = {
  AULA: 'Sala de aula',
  LABORATORIO: 'Laboratório',
  PROJETO: 'Sala de projeto',
  DEPARTAMENTO: 'Departamento',
}

export const TIPO_USUARIO_LABEL: Record<TipoUsuario, string> = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  TUTOR: 'Tutor',
  GESTOR: 'Gestor de Salas',
}

export const CATEGORIA_LABEL: Record<CategoriaProj, string> = {
  ENSINO: 'Ensino',
  PESQUISA: 'Pesquisa',
  EXTENSAO: 'Extensão',
  GESTAO: 'Gestão',
}

export const STATUS_RESERVA_LABEL: Record<StatusReserva, string> = {
  PENDENTE: 'Pendente',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
}

export const DIAS_SEMANA = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'] as const
export const DIAS_SEMANA_CURTO = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'] as const

/** Hourly slots shown in the weekly grids (lunch break 12h excluded from availability). */
export const HORAS_GRADE = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
export const HORAS_DISPONIBILIDADE = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
