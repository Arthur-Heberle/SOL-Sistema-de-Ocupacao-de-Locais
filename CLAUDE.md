# SOL — Sistema de Ocupação de Locais

Room management and reservation system for UTFPR Campus Curitiba Sede Centro.
Replaces manual email/in-person room booking with a self-service web platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite (`project/frontend/`) |
| Backend | Java 17 + Spring Boot 3 (`project/backend/` — future) |
| Database | PostgreSQL — minimum 5 tables |
| Auth | JWT tokens stored in browser localStorage |
| VCS | Git / GitHub |
| Hosting | UTFPR IT infrastructure (free tier cloud) |

## User Roles

| Role | `tipoUsuario` enum | Key permissions |
|------|-------------------|-----------------|
| Gestor de Salas | `GESTOR` | Full admin. Approves all semester reservations and new projects. CRUD on users/rooms/disciplines. |
| Professor | `PROFESSOR` | Reserve rooms (day or semester), register projects (pending approval). |
| Tutor/Aluno de Projeto | `TUTOR` | Manage own project room, schedule activities (public/private), manage free-time slots. |
| Aluno | `ALUNO` | View-only. Can consult room occupation status. |

## Frontend Pages → Routes

| Page component | Route | Minimum role |
|---------------|-------|-------------|
| `LoginPage` | `/login` | public |
| `MapaPage` | `/mapa` | `ALUNO` |
| `DashboardPage` | `/dashboard` | `PROFESSOR` |
| `ProjetoPage` | `/projetos/:id` | `TUTOR` |
| `GestaoUsuariosPage` | `/admin/usuarios` | `GESTOR` |
| `GestaoSalasPage` | `/admin/salas` | `GESTOR` |
| `GestaoDisciplinasPage` | `/admin/disciplinas` | `GESTOR` |

## Key Business Rules

- **Day reservations** (non-project rooms: LABORATÓRIO, AULA): auto-approved if room is free.
- **Semester reservations** (tipoSala=PROJETO): always `status=PENDENTE`, requires GESTOR approval.
- **DEPARTAMENTO rooms**: `permiteReserva=false` — display-only on map, no booking allowed for any user.
- **Project rooms**: project members get auto-approval for their own room.
- **Private activities** (`visibilidade=PRIVADA`): visible only to creator and GESTOR.
- **Recurring reservations** (`recorrente=true`): repeat weekly at the same day/time.

## Core Entities

| Entity | Key attributes |
|--------|---------------|
| `Usuario` | id, nome, email, senhaHash, tipoUsuario(ALUNO/PROFESSOR/TUTOR/GESTOR), ativo |
| `Sala` | id, bloco, codigoNome, tipoSala(LABORATÓRIO/AULA/PROJETO/DEPARTAMENTO), capacidade, possuiProjetor, permiteReserva |
| `Reserva` | id, idSala, idUsuario, titulo, dataInicio, dataFim, recorrente, status(PENDENTE/APROVADA/REJEITADA), visibilidade(PUBLICA/PRIVADA) |
| `Projeto` | id, nome, descricao, categoria(ENSINO/PESQUISA/EXTENSAO/GESTAO), idTutor, idSalaExclusiva, aprovado |
| `Disciplina` | id, codigo, nome, idProfessor, semestre(AAAA/N), cargaHoraria, turma |
| `MembroProjeto` | id, idUsuario, idProjeto, dataIngresso, isGestor |
| `Disponibilidade` | id, idUsuario, idProjeto, diaSemana, horaInicio, horaFim |

## Frontend Conventions

- Component files: `PascalCase.tsx`
- Pages in `src/pages/`, components in `src/components/`
- Routes in `src/routes/`, context in `src/context/`, types in `src/types/`
- CSS Modules: `ComponentName.module.css` (no global CSS except `index.css` reset)
- No barrel `index.ts` files unless 3+ exports from one folder
- All API calls go through service classes in `src/services/` (future)

## API Endpoints (planned — backend not built yet)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Login → returns `AuthTokenDTO` |
| GET | `/salas` | List rooms with filters (`FiltroMapaDTO`) |
| POST | `/reservas` | Create reservation |
| PATCH | `/reservas/:id/aprovar` | GESTOR approves reservation |
| PATCH | `/reservas/:id/rejeitar` | GESTOR rejects reservation |
| GET | `/reservas/pendentes` | GESTOR dashboard pending list |
| POST | `/projetos` | Register project (pending approval) |
| GET | `/disponibilidades/:idProjeto` | Get free-time intersection for project |
| POST | `/disponibilidades` | Save member free-time blocks |
