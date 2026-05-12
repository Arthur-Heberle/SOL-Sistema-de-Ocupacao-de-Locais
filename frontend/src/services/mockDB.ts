import type {
  UsuarioDTO, SalaDTO, ReservaDTO, ProjetoDTO,
  DisciplinaDTO, MembroProjetoDTO, HorarioDTO,
} from '../types'

const SEED_USUARIOS: UsuarioDTO[] = [
  { id: 1, nome: 'Admin Gestor', email: 'gestor@utfpr.edu.br', tipoUsuario: 'GESTOR', ativo: true },
  { id: 2, nome: 'Prof. Ana Silva', email: 'ana@utfpr.edu.br', tipoUsuario: 'PROFESSOR', ativo: true },
  { id: 3, nome: 'Carlos Tutor', email: 'carlos@utfpr.edu.br', tipoUsuario: 'TUTOR', ativo: true },
  { id: 4, nome: 'Maria Aluna', email: 'maria@utfpr.edu.br', tipoUsuario: 'ALUNO', ativo: true },
  { id: 5, nome: 'João Aluno', email: 'joao@utfpr.edu.br', tipoUsuario: 'ALUNO', ativo: true },
]

const SEED_SALAS: SalaDTO[] = [
  { id: 1, bloco: 'CB', codigoNome: 'CB-001', tipoSala: 'AULA', capacidade: 40, possuiProjetor: true, permiteReserva: true },
  { id: 2, bloco: 'CB', codigoNome: 'CB-002', tipoSala: 'LABORATORIO', capacidade: 30, possuiProjetor: true, permiteReserva: true },
  { id: 3, bloco: 'CB', codigoNome: 'CB-003', tipoSala: 'PROJETO', capacidade: 10, possuiProjetor: false, permiteReserva: true },
  { id: 4, bloco: 'CB', codigoNome: 'CB-DEPT', tipoSala: 'DEPARTAMENTO', capacidade: 5, possuiProjetor: false, permiteReserva: false },
  { id: 5, bloco: 'DAELN', codigoNome: 'D-101', tipoSala: 'AULA', capacidade: 35, possuiProjetor: true, permiteReserva: true },
  { id: 6, bloco: 'DAELN', codigoNome: 'D-LAB', tipoSala: 'LABORATORIO', capacidade: 20, possuiProjetor: true, permiteReserva: true },
]

const SEED_RESERVAS: ReservaDTO[] = [
  {
    id: 1, idSala: 1, idUsuario: 2, titulo: 'Aula de Cálculo',
    visibilidade: 'PUBLICA', dataInicio: '2026-05-20T08:00:00',
    dataFim: '2026-05-20T10:00:00', recorrente: true, status: 'APROVADA',
  },
  {
    id: 2, idSala: 2, idUsuario: 3, titulo: 'Reunião PET',
    visibilidade: 'PUBLICA', dataInicio: '2026-05-21T14:00:00',
    dataFim: '2026-05-21T16:00:00', recorrente: false, status: 'PENDENTE',
  },
  {
    id: 3, idSala: 3, idUsuario: 3, titulo: 'Sprint do Projeto',
    visibilidade: 'PRIVADA', dataInicio: '2026-05-22T13:00:00',
    dataFim: '2026-05-22T15:00:00', recorrente: false, status: 'APROVADA',
  },
]

const SEED_PROJETOS: ProjetoDTO[] = [
  { id: 1, nome: 'PET Computação', descricao: 'Grupo PET do curso de Computação', categoria: 'EXTENSAO', idTutor: 3, idSalaExclusiva: 3, aprovado: true },
  { id: 2, nome: 'IC Redes Neurais', descricao: 'Pesquisa em aprendizado profundo', categoria: 'PESQUISA', idTutor: 2, aprovado: false },
]

const SEED_DISCIPLINAS: DisciplinaDTO[] = [
  { id: 1, codigo: 'IF66D', nome: 'Engenharia de Software', semestre: '2026/1', idProfessor: 2, cargaHoraria: 60, turma: 'TB01' },
  { id: 2, codigo: 'IF65C', nome: 'Cálculo Numérico', semestre: '2026/1', idProfessor: 2, cargaHoraria: 60, turma: 'TC02' },
]

const SEED_MEMBROS: MembroProjetoDTO[] = [
  { id: 1, idUsuario: 3, idProjeto: 1, nomeUsuario: 'Carlos Tutor', emailUsuario: 'carlos@utfpr.edu.br', isGestor: true },
  { id: 2, idUsuario: 4, idProjeto: 1, nomeUsuario: 'Maria Aluna', emailUsuario: 'maria@utfpr.edu.br', isGestor: false },
]

const SEED_DISPONIBILIDADES: { idUsuario: number; idProjeto: number; horarios: HorarioDTO[] }[] = [
  {
    idUsuario: 3, idProjeto: 1,
    horarios: [
      { diaSemana: 'SEGUNDA', horaInicio: '14:00', horaFim: '15:00' },
      { diaSemana: 'SEGUNDA', horaInicio: '15:00', horaFim: '16:00' },
      { diaSemana: 'QUARTA', horaInicio: '08:00', horaFim: '09:00' },
      { diaSemana: 'QUARTA', horaInicio: '09:00', horaFim: '10:00' },
      { diaSemana: 'QUINTA', horaInicio: '14:00', horaFim: '15:00' },
    ],
  },
  {
    idUsuario: 4, idProjeto: 1,
    horarios: [
      { diaSemana: 'SEGUNDA', horaInicio: '14:00', horaFim: '15:00' },
      { diaSemana: 'SEGUNDA', horaInicio: '15:00', horaFim: '16:00' },
      { diaSemana: 'TERCA', horaInicio: '10:00', horaFim: '11:00' },
      { diaSemana: 'QUARTA', horaInicio: '09:00', horaFim: '10:00' },
      { diaSemana: 'SEXTA', horaInicio: '08:00', horaFim: '09:00' },
    ],
  },
]

function load<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key)
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed))
    return seed
  }
  return JSON.parse(raw) as T[]
}

function loadWithMerge<T extends { id: number }>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key)
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed))
    return [...seed]
  }
  const stored = JSON.parse(raw) as T[]
  let changed = false
  for (const item of seed) {
    if (!stored.some(s => s.id === item.id)) {
      stored.push(item)
      changed = true
    }
  }
  if (changed) localStorage.setItem(key, JSON.stringify(stored))
  return stored
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
}

export const db = {
  usuarios: {
    all: () => loadWithMerge<UsuarioDTO>('sol.usuarios', SEED_USUARIOS),
    save: (items: UsuarioDTO[]) => save('sol.usuarios', items),
  },
  salas: {
    all: () => load<SalaDTO>('sol.salas', SEED_SALAS),
    save: (items: SalaDTO[]) => save('sol.salas', items),
  },
  reservas: {
    all: () => load<ReservaDTO>('sol.reservas', SEED_RESERVAS),
    save: (items: ReservaDTO[]) => save('sol.reservas', items),
  },
  projetos: {
    all: () => load<ProjetoDTO>('sol.projetos', SEED_PROJETOS),
    save: (items: ProjetoDTO[]) => save('sol.projetos', items),
  },
  disciplinas: {
    all: () => load<DisciplinaDTO>('sol.disciplinas', SEED_DISCIPLINAS),
    save: (items: DisciplinaDTO[]) => save('sol.disciplinas', items),
  },
  membros: {
    all: () => load<MembroProjetoDTO>('sol.membros', SEED_MEMBROS),
    save: (items: MembroProjetoDTO[]) => save('sol.membros', items),
  },
  disponibilidades: {
    all: () => load<{ idUsuario: number; idProjeto: number; horarios: HorarioDTO[] }>('sol.disponibilidades', SEED_DISPONIBILIDADES),
    save: (items: { idUsuario: number; idProjeto: number; horarios: HorarioDTO[] }[]) => save('sol.disponibilidades', items),
  },
  nextId,
}
