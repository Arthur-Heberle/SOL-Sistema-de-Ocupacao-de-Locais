# SOL — Sistema de Ocupação de Locais

Room management and reservation system for UTFPR Campus Curitiba Sede Centro.
Replaces manual email/in-person room booking with a self-service web platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite (`frontend/`) |
| Backend | Java 17 + Spring Boot 3 (`backend/` — future) |
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
| `ProjetosListPage` | `/projetos` | `ALUNO` (project members) |
| `ProjetoPage` | `/projetos/:id` | `ALUNO` (members see full view) |
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
- Shared UI primitives in `src/components/ui/` (Button, Badge, Alert, Card, Field, Checkbox, Modal, PageHeader, Table, EmptyState)
- Routes in `src/routes/`, context in `src/context/`, types in `src/types/`, helpers in `src/utils/`
- CSS Modules: `ComponentName.module.css`; `index.css` holds only the reset and design tokens (CSS variables)
- No inline `style={{}}` except computed positioning
- No barrel `index.ts` files unless 3+ exports from one folder
- All data access goes through `src/services/` (currently `mockDB.ts` over localStorage, key prefix `sol.v2.`)
- Dates: use `src/utils/datas.ts` (local time; never `toISOString()` for calendar dates)
- No emojis in UI or docs; no AI `Co-Authored-By` lines in commits

## Repository Layout

- `frontend/` — application
- `docs/especificacao/` — project plan (requirements, use cases, data dictionary)
- `docs/diagramas/` — UML diagrams in Mermaid
- `docs/img/` — README screenshots

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
