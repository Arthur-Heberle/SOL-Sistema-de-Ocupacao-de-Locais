/**
 * In-browser mock database backed by localStorage. Stands in for the planned
 * Spring Boot API so the frontend can be exercised end to end.
 */
import type {
  UsuarioDTO, SalaDTO, ReservaDTO, ProjetoDTO,
  DisciplinaDTO, MembroProjetoDTO, HorarioDTO,
} from '../types'
import { segundaDaSemana, hojeISO, toISODate } from '../utils/datas'

/** Bump when seed shape changes so stale localStorage is discarded. */
const STORAGE_PREFIX = 'sol.v2.'

export interface DisponibilidadeRegistro {
  idUsuario: number
  idProjeto: number
  horarios: HorarioDTO[]
}

const SEED_USUARIOS: UsuarioDTO[] = [
  { id: 1, nome: 'Admin Gestor', email: 'gestor@utfpr.edu.br', tipoUsuario: 'GESTOR', ativo: true },
  { id: 2, nome: 'Prof. Ana Silva', email: 'ana@utfpr.edu.br', tipoUsuario: 'PROFESSOR', ativo: true },
  { id: 3, nome: 'Carlos Tutor', email: 'carlos@utfpr.edu.br', tipoUsuario: 'TUTOR', ativo: true },
  { id: 4, nome: 'Maria Aluna', email: 'maria@utfpr.edu.br', tipoUsuario: 'ALUNO', ativo: true },
  { id: 5, nome: 'João Aluno', email: 'joao@utfpr.edu.br', tipoUsuario: 'ALUNO', ativo: true },
  { id: 6, nome: 'Beatriz Lima', email: 'beatriz@utfpr.edu.br', tipoUsuario: 'ALUNO', ativo: true },
  { id: 7, nome: 'Pedro Santos', email: 'pedro@utfpr.edu.br', tipoUsuario: 'ALUNO', ativo: true },
  { id: 8, nome: 'Prof. Ricardo Alves', email: 'ricardo@utfpr.edu.br', tipoUsuario: 'PROFESSOR', ativo: true },
]

const SEED_SALAS: SalaDTO[] = [
  { id: 1, bloco: 'A', codigoNome: 'A-101', tipoSala: 'AULA', capacidade: 45, possuiProjetor: true, permiteReserva: true },
  { id: 2, bloco: 'A', codigoNome: 'A-102', tipoSala: 'AULA', capacidade: 40, possuiProjetor: true, permiteReserva: true },
  { id: 3, bloco: 'A', codigoNome: 'A-103', tipoSala: 'AULA', capacidade: 30, possuiProjetor: false, permiteReserva: true },
  { id: 4, bloco: 'A', codigoNome: 'A-DACOM', tipoSala: 'DEPARTAMENTO', capacidade: 8, possuiProjetor: false, permiteReserva: false },
  { id: 5, bloco: 'B', codigoNome: 'B-201', tipoSala: 'LABORATORIO', capacidade: 30, possuiProjetor: true, permiteReserva: true },
  { id: 6, bloco: 'B', codigoNome: 'B-202', tipoSala: 'LABORATORIO', capacidade: 24, possuiProjetor: true, permiteReserva: true },
  { id: 7, bloco: 'B', codigoNome: 'B-203', tipoSala: 'LABORATORIO', capacidade: 20, possuiProjetor: false, permiteReserva: true },
  { id: 8, bloco: 'C', codigoNome: 'C-301', tipoSala: 'PROJETO', capacidade: 12, possuiProjetor: true, permiteReserva: true },
  { id: 9, bloco: 'C', codigoNome: 'C-302', tipoSala: 'PROJETO', capacidade: 10, possuiProjetor: false, permiteReserva: true },
  { id: 10, bloco: 'C', codigoNome: 'C-DAINF', tipoSala: 'DEPARTAMENTO', capacidade: 6, possuiProjetor: false, permiteReserva: false },
]

/** Seed reservations are anchored to the current week so the demo always has activity. */
function seedReservas(): ReservaDTO[] {
  const seg = segundaDaSemana(hojeISO())
  const dia = (offset: number) => {
    const d = new Date(seg)
    d.setDate(d.getDate() + offset)
    return toISODate(d)
  }
  const hoje = hojeISO()
  const r = (
    id: number, idSala: number, idUsuario: number, titulo: string, data: string,
    inicio: string, fim: string, extra: Partial<ReservaDTO> = {},
  ): ReservaDTO => ({
    id, idSala, idUsuario, titulo, visibilidade: 'PUBLICA',
    dataInicio: `${data}T${inicio}`, dataFim: `${data}T${fim}`,
    recorrente: false, status: 'APROVADA', ...extra,
  })
  return [
    r(1, 1, 2, 'Cálculo Numérico', dia(0), '08:00', '10:00', { recorrente: true }),
    r(2, 5, 2, 'Engenharia de Software', dia(1), '13:00', '15:00', { recorrente: true }),
    r(3, 8, 3, 'Sprint PET', dia(2), '14:00', '16:00', { visibilidade: 'PRIVADA' }),
    r(4, 6, 8, 'Lab. de Redes', dia(3), '10:00', '12:00', { recorrente: true }),
    r(5, 2, 8, 'Sistemas Digitais', dia(4), '08:00', '10:00', { recorrente: true }),
    r(6, 1, 8, 'Banca de TCC', hoje, '15:00', '17:00'),
    r(7, 5, 2, 'Monitoria de Algoritmos', hoje, '10:00', '11:00'),
    r(8, 8, 3, 'Reunião geral PET', hoje, '16:00', '17:00'),
    r(9, 9, 2, 'Pesquisa IC Redes Neurais', dia(1), '09:00', '11:00', { status: 'PENDENTE' }),
    r(10, 3, 2, 'Reposição de Cálculo', dia(4), '14:00', '16:00', { status: 'PENDENTE', recorrente: true }),
    r(11, 8, 4, 'Oficina de Git', dia(0), '14:00', '15:00'),
  ]
}

const SEED_PROJETOS: ProjetoDTO[] = [
  { id: 1, nome: 'PET Computação', descricao: 'Programa de Educação Tutorial do curso de Engenharia de Computação: oficinas, minicursos e projetos de extensão.', categoria: 'EXTENSAO', idTutor: 3, idSalaExclusiva: 8, aprovado: true },
  { id: 2, nome: 'IC Redes Neurais', descricao: 'Iniciação científica em aprendizado profundo aplicado a visão computacional.', categoria: 'PESQUISA', idTutor: 2, idSalaExclusiva: 9, aprovado: false },
]

const SEED_DISCIPLINAS: DisciplinaDTO[] = [
  { id: 1, codigo: 'IF66D', nome: 'Engenharia de Software', semestre: '2026/2', idProfessor: 2, cargaHoraria: 60, turma: 'S71' },
  { id: 2, codigo: 'MA70C', nome: 'Cálculo Numérico', semestre: '2026/2', idProfessor: 2, cargaHoraria: 60, turma: 'S11' },
  { id: 3, codigo: 'EL64F', nome: 'Sistemas Digitais', semestre: '2026/2', idProfessor: 8, cargaHoraria: 90, turma: 'S31' },
]

const SEED_MEMBROS: MembroProjetoDTO[] = [
  { id: 1, idUsuario: 3, idProjeto: 1, nomeUsuario: 'Carlos Tutor', emailUsuario: 'carlos@utfpr.edu.br', isGestor: true },
  { id: 2, idUsuario: 4, idProjeto: 1, nomeUsuario: 'Maria Aluna', emailUsuario: 'maria@utfpr.edu.br', isGestor: false },
  { id: 3, idUsuario: 6, idProjeto: 1, nomeUsuario: 'Beatriz Lima', emailUsuario: 'beatriz@utfpr.edu.br', isGestor: false },
  { id: 4, idUsuario: 7, idProjeto: 1, nomeUsuario: 'Pedro Santos', emailUsuario: 'pedro@utfpr.edu.br', isGestor: false },
  { id: 5, idUsuario: 2, idProjeto: 2, nomeUsuario: 'Prof. Ana Silva', emailUsuario: 'ana@utfpr.edu.br', isGestor: true },
]

function slots(dia: string, ...horas: string[]): HorarioDTO[] {
  return horas.map(h => ({
    diaSemana: dia,
    horaInicio: h,
    horaFim: `${String(Number(h.slice(0, 2)) + 1).padStart(2, '0')}:00`,
  }))
}

const SEED_DISPONIBILIDADES: DisponibilidadeRegistro[] = [
  {
    idUsuario: 3, idProjeto: 1,
    horarios: [
      ...slots('SEGUNDA', '13:00', '14:00', '15:00', '16:00'),
      ...slots('TERCA', '08:00', '09:00'),
      ...slots('QUARTA', '08:00', '09:00', '10:00', '14:00', '15:00'),
      ...slots('QUINTA', '14:00', '15:00', '16:00'),
      ...slots('SEXTA', '10:00', '11:00'),
    ],
  },
  {
    idUsuario: 4, idProjeto: 1,
    horarios: [
      ...slots('SEGUNDA', '14:00', '15:00', '16:00', '17:00'),
      ...slots('TERCA', '10:00', '11:00'),
      ...slots('QUARTA', '09:00', '10:00', '14:00', '15:00'),
      ...slots('QUINTA', '15:00', '16:00'),
      ...slots('SEXTA', '08:00', '09:00', '10:00'),
    ],
  },
  {
    idUsuario: 6, idProjeto: 1,
    horarios: [
      ...slots('SEGUNDA', '08:00', '14:00', '15:00'),
      ...slots('TERCA', '08:00', '09:00', '10:00'),
      ...slots('QUARTA', '10:00', '14:00', '15:00', '16:00'),
      ...slots('QUINTA', '13:00', '14:00', '15:00'),
      ...slots('SEXTA', '10:00', '11:00', '13:00'),
    ],
  },
  {
    idUsuario: 7, idProjeto: 1,
    horarios: [
      ...slots('SEGUNDA', '14:00', '15:00'),
      ...slots('TERCA', '13:00', '14:00'),
      ...slots('QUARTA', '08:00', '14:00', '15:00'),
      ...slots('QUINTA', '15:00', '16:00', '17:00'),
      ...slots('SEXTA', '10:00', '16:00', '17:00'),
    ],
  },
]

function read<T>(key: string, seed: () => T[]): T[] {
  const fullKey = STORAGE_PREFIX + key
  try {
    const raw = localStorage.getItem(fullKey)
    if (raw) return JSON.parse(raw) as T[]
  } catch { /* corrupted or unavailable storage: fall back to seed */ }
  const data = seed()
  write(key, data)
  return data
}

function write<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch { /* storage unavailable (private mode): keep working in memory only */ }
}

function table<T>(key: string, seed: () => T[]) {
  return {
    all: () => read<T>(key, seed),
    save: (items: T[]) => write(key, items),
  }
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
}

export const db = {
  usuarios: table<UsuarioDTO>('usuarios', () => SEED_USUARIOS),
  salas: table<SalaDTO>('salas', () => SEED_SALAS),
  reservas: table<ReservaDTO>('reservas', seedReservas),
  projetos: table<ProjetoDTO>('projetos', () => SEED_PROJETOS),
  disciplinas: table<DisciplinaDTO>('disciplinas', () => SEED_DISCIPLINAS),
  membros: table<MembroProjetoDTO>('membros', () => SEED_MEMBROS),
  disponibilidades: table<DisponibilidadeRegistro>('disponibilidades', () => SEED_DISPONIBILIDADES),
  nextId,
}
