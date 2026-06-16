# SOL Backend Implementation Plan

This document outlines the plan for implementing the backend for the **S.O.L. – Sistema de Ocupação de Locais** project.  It is intended for Codex or any backend developer who will build the API layer to complement the existing frontend.

## 1 Overview and Existing Repository

The current repository contains only a React/Vite frontend and supporting documentation.  The `README.md` shows that the project has a `frontend` folder and **no** backend yet; the backend is planned to use Java and Spring Boot【832812593882609†L9-L15】.  Therefore, the backend must be created from scratch under a new `project/backend/` directory while preserving the existing frontend.

### Key references

* **README.md** – describes the overall project structure and identifies that a backend is planned【832812593882609†L9-L15】.  It also lists sample user credentials【832812593882609†L37-L46】.
* **CLAUDE.md** – contains core business rules and a summary of the domain entities【315317018749566†L42-L74】.  It also lists the minimum endpoints that the frontend expects【315317018749566†L85-L97】.
* **AGENTS.md** – outlines conventions and restrictions for AI agents.  Notably, it states that the backend does not exist yet and should be built separately【596138412190318†L18-L24】.  It also reiterates that the backend should use Java 17 + Spring Boot 3【596138412190318†L28-L31】.
* **PlanodoProjeto (PDF)** – detailed system specification.  It describes requirements, use cases, class diagrams, data dictionary and sequence diagrams.  Use this as the canonical source of truth when details are unclear.

## 2 Domain Model and Entities

The backend must implement the following domain entities, based on the specification and summarized in `CLAUDE.md`【315317018749566†L56-L73】.  Unless noted otherwise, each entity should have the usual `id` primary key (auto-increment integer or UUID), creation/update timestamps, and standard JPA annotations.

| Entity | Fields | Notes |
|-------|--------|------|
| **Usuario** | `id`, `nome`, `email` (unique), `senhaHash`, `tipoUsuario` (enum: ALUNO, PROFESSOR, TUTOR, GESTOR), `ativo` (boolean), `createdAt`, `updatedAt` | Use BCrypt for password hashes.  Do *not* return `senhaHash` in DTOs.  Only active users should authenticate. |
| **Sala** | `id`, `bloco`, `codigoNome` (unique), `tipoSala` (enum: LABORATORIO, AULA, PROJETO, DEPARTAMENTO), `capacidade`, `possuiProjetor`, `permiteReserva` (boolean), `descricao`, timestamps | Salas of type `DEPARTAMENTO` or with `permiteReserva=false` are display‑only; they cannot be booked【315317018749566†L42-L50】. |
| **Reserva** | `id`, `sala` (FK), `usuario` (FK), `projeto` (FK, nullable), `disciplina` (FK, nullable), `titulo`, `visibilidade` (enum: PUBLICA, PRIVADA), `dataInicio`, `dataFim`, `recorrente` (boolean), `status` (enum: PENDENTE, APROVADA, REJEITADA, CANCELADA), `descricao`, timestamps | Day reservations (recorrente=false) are auto‑approved if the room is free【315317018749566†L44-L45】.  Semester or project reservations are created as `PENDENTE` and require GESTOR approval【315317018749566†L46-L51】.  No overlaps with existing approved reservations are allowed. |
| **Projeto** | `id`, `nome`, `descricao`, `categoria` (enum: ENSINO, PESQUISA, EXTENSAO, GESTAO), `tutor` (FK Usuario), `salaExclusiva` (FK Sala, nullable), `aprovado` (boolean), timestamps | Projects created by professors start as pending (`aprovado=false`).  GESTOR must approve or reject.  Once approved, the project can have a dedicated room and members can schedule activities there. |
| **Disciplina** | `id`, `codigo` (string), `nome`, `professor` (FK Usuario), `semestre` (string such as “2026/1”), `cargaHoraria`, `turma`, timestamps | Created/edited by GESTOR.  Used to link semester reservations to classes. |
| **MembroProjeto** | `id`, `usuario` (FK), `projeto` (FK), `dataIngresso`, `isGestor` (boolean) | Represents membership of a user in a project.  Only project tutors or members flagged as `isGestor=true` can add/remove members. |
| **Disponibilidade** | `id`, `usuario` (FK), `projeto` (FK), `diaSemana` (enum), `horaInicio`, `horaFim` | Project members submit their weekly free‑time slots.  The system should provide an endpoint to compute the intersection of all members’ slots.  Validate that `horaInicio < horaFim`. |

### Relationships

* **Usuario ↔ Reserva**: A user can create many reservations; a reservation is created by exactly one user.
* **Sala ↔ Reserva**: A room can have many reservations; a reservation relates to exactly one room.
* **Projeto ↔ Reserva**: (optional) A project may have many reservations; a reservation may be linked to a project if it concerns project activities.
* **Disciplina ↔ Reserva**: (optional) A reservation may link to a discipline for semester‑long lectures.
* **Projeto ↔ MembroProjeto ↔ Usuario**: Many‑to‑many relationship between projects and users, with additional fields like `dataIngresso` and `isGestor` on the join table.
* **Projeto ↔ Disponibilidade ↔ Usuario**: Many‑to‑many between projects and users specifying their availability slots.

## 3 Roles and Permissions

There are four user roles (enum `TipoUsuario`): **GESTOR**, **PROFESSOR**, **TUTOR**, **ALUNO**【315317018749566†L60-L62】.  Permissions are governed by business rules:

* **Gestor de Salas (GESTOR)** – Full administrator.  Approves or rejects semester reservations and projects.  Can perform CRUD on users, rooms, disciplines, and view all reservations (including private ones).  Manages project memberships.
* **Professor (PROFESSOR)** – Can reserve rooms for a day or for a semester.  Can register a project, which starts as pending.  May manage own reservations but cannot approve others.
* **Tutor/Aluno de Projeto (TUTOR)** – Project tutor or project student.  Can schedule activities in the project’s exclusive room (auto‑approved), manage project free‑time slots, and register/reserve project activities.  May manage project members if flagged as `isGestor` in `MembroProjeto`.
* **Aluno (ALUNO)** – Read‑only role.  Can view the occupancy map and public details of reservations.  Cannot create or edit anything.

Authentication must use JWT.  Only active users should obtain a token.  Authorization should enforce these roles at the controller/service level.

## 4 API Endpoints

The following endpoints are a superset of those listed in `CLAUDE.md`【315317018749566†L85-L97】 and derived from the use cases.  Adjust the exact URIs as needed, but keep them consistent with the frontend’s expectations.

### 4.1 Authentication

* `POST /api/auth/login` – Authenticate with email and password.  Return a JWT token and basic user info (id, nome, tipoUsuario, ativo).  Respond with 401 on invalid credentials.  Use DTOs: `LoginRequest`, `AuthTokenDTO`.
* `GET /api/auth/me` – (optional) Return the authenticated user’s info using the JWT token.

### 4.2 Usuários

Administrative operations require `GESTOR`.

* `GET /api/usuarios` – List users with optional filters (`tipoUsuario`, `ativo`).
* `GET /api/usuarios/{id}` – Get user details.
* `POST /api/usuarios` – Create a user (GESTOR only).  Validate email uniqueness.  Hash the password.
* `PUT /api/usuarios/{id}` – Update user details.  Password updates must rehash.
* `PATCH /api/usuarios/{id}/ativar` – Activate a user account.
* `PATCH /api/usuarios/{id}/inativar` – Deactivate a user account.

### 4.3 Salas

* `GET /api/salas` – List rooms.  Support filters by `bloco`, `tipoSala`, `permiteReserva`.  This is public (no auth required) but should hide non‑reservable status appropriately.
* `GET /api/salas/{id}` – Get details about a single room.
* `POST /api/salas` – Create a room (GESTOR).
* `PUT /api/salas/{id}` – Edit room details (GESTOR).  Changes to `permiteReserva` or `tipoSala` should take effect immediately for future reservations.
* `DELETE /api/salas/{id}` – Remove a room (logical delete if there are existing reservations) (GESTOR).

### 4.4 Reservas

* `GET /api/reservas` – List reservations.  Support filters by `sala`, `usuario`, `projeto`, `disciplina`, date range, and status.  Non‑members should receive sanitised details for private reservations (e.g. return `titulo="Ocupado"` and null description).  This endpoint can be public or require at least `ALUNO` authentication.
* `GET /api/reservas/{id}` – Get details of a reservation, respecting visibility rules.
* `POST /api/reservas` – Create a reservation.  Validations:
  - Check that the room exists and `permiteReserva=true`【315317018749566†L48-L50】.
  - Verify the user has permission to reserve (e.g. project members for project rooms).
  - Check for time conflicts with existing approved reservations (logic: `newStart < existingEnd && newEnd > existingStart`).
  - If `recorrente=false` and the room is available, set `status=APROVADA` automatically【315317018749566†L44-L45】.
  - If `recorrente=true` (semester or repeated reservations), set `status=PENDENTE` and require GESTOR approval【315317018749566†L46-L47】.
  - For activities tied to a project’s exclusive room and created by a project member, auto‑approve regardless of room type【315317018749566†L50-L51】.
* `PATCH /api/reservas/{id}/aprovar` – GESTOR approves a pending reservation.  Re‑check conflicts immediately before final approval.
* `PATCH /api/reservas/{id}/rejeitar` – GESTOR rejects a pending reservation, optionally recording a reason.
* `PATCH /api/reservas/{id}/cancelar` – Creator or GESTOR cancels a reservation before it starts.  Update `status=CANCELADA`.

### 4.5 Projetos

* `GET /api/projetos` – List projects.  Filter by `aprovado` or tutor.
* `GET /api/projetos/{id}` – Get project details, including members (optionally hide members’ email for non‑gestors).
* `POST /api/projetos` – Create a new project.  If created by a PROFESSOR, set `aprovado=false` and await GESTOR approval.  If created by GESTOR, may set `aprovado=true` directly.
* `PATCH /api/projetos/{id}/aprovar` – GESTOR approves a project.
* `PATCH /api/projetos/{id}/rejeitar` – GESTOR rejects a project.  Optionally record a reason.
* (Optional) `PUT /api/projetos/{id}` – Edit project details.  Only allowed for GESTOR or project tutor when pending.

### 4.6 Membro do Projeto

* `GET /api/projetos/{id}/membros` – List members of a project.  Only members, tutor or GESTOR can see.
* `POST /api/projetos/{id}/membros` – Add a member.  Only tutor, a member flagged as `isGestor`, or GESTOR can do this.
* `DELETE /api/projetos/{id}/membros/{usuarioId}` – Remove a member.  Same permission as above.  Prevent removing the only tutor.
* `PATCH /api/projetos/{id}/membros/{usuarioId}/gestor` – Toggle `isGestor` for a member.  Only GESTOR or tutor can change this.

### 4.7 Disponibilidades

* `POST /api/projetos/{id}/disponibilidades` – Register availability slots for the authenticated member.  Accept a list of `{diaSemana, horaInicio, horaFim}`.  Overwrite existing slots for that user/project.  Enforce `horaInicio < horaFim`.
* `GET /api/projetos/{id}/disponibilidades` – Return all availability slots for the project (only to members and GESTOR).
* `GET /api/projetos/{id}/disponibilidades/intersecao` – Return the intersection of availability slots across all members.  Use a simple algorithm: for each day of the week, find overlapping intervals among all members.

### 4.8 Disciplinas

* `GET /api/disciplinas` – List disciplines.  Support filters by professor or semester.
* `GET /api/disciplinas/{id}` – Get details about a discipline.
* `POST /api/disciplinas` – Create a discipline (GESTOR).  Validate that `idProfessor` belongs to a PROFESSOR.
* `PUT /api/disciplinas/{id}` – Edit a discipline (GESTOR).
* `DELETE /api/disciplinas/{id}` – Remove a discipline (GESTOR).  Prevent deletion if linked to approved reservations.

## 5 Implementation Guidelines

1. **Project setup** – Create a Maven or Gradle multi‑module project under `project/backend/`.  Use Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security, and Flyway for database migrations.  Use PostgreSQL in development; optionally support H2 for tests.  Set up the directory structure: `src/main/java` with packages `entity`, `repository`, `service`, `controller`, `dto`, `mapper`, `security`, `config`, `exception`.
2. **Database configuration** – Configure a `DataSource` in `application-dev.yml` pointing to a local Postgres instance.  Create Flyway migrations to initialise the schema (tables for each entity) with appropriate constraints and indexes (e.g. unique indices on `usuarios.email`, `salas.codigoNome`, and date/time range indexes on `reservas`).
3. **Entities & enums** – Annotate entity classes with JPA annotations.  Use `@Enumerated(EnumType.STRING)` for all enums (`TipoUsuario`, `TipoSala`, `StatusReserva`, `Visibilidade`, `CategoriaProj`, `DiaSemana`).  Add `@Table(uniqueConstraints = …)` where necessary.
4. **DTOs & mappers** – Define request and response DTOs to decouple API contracts from entities.  Use MapStruct or manual mappers to convert between entities and DTOs.  For collections, apply streaming mapping functions.
5. **Repositories** – Create `JpaRepository` interfaces for each entity.  For complex queries (e.g. detecting overlapping reservations), implement custom repository methods with JPQL or Spring Data query derivation.
6. **Services** – Encapsulate business logic in service classes.  Services should handle validation (e.g. date/time checks), enforce business rules (auto‑approve or pend reservations), and perform authorization checks (e.g. verifying the current user is a member of a project).  Use `@Transactional` where appropriate.
7. **Controllers** – Implement REST controllers annotated with `@RestController`.  Use `@RequestMapping("/api/...")` for each resource.  Inject services and convert entities to DTOs before returning responses.  Add `@PreAuthorize` or method‑level guards based on roles.
8. **Security** – Configure Spring Security with JWT.  Implement a filter that validates the token, extracts user details, and populates `SecurityContext`.  Use password hashing with BCrypt.  Define a `JwtUtil` class for generating and validating tokens.  Configure CORS as needed for the React frontend running on `http://localhost:5173` during development.
9. **Global exception handling** – Create a `@ControllerAdvice` to handle exceptions globally.  Return structured error responses with a timestamp, HTTP status code, error description, message, and path.  Map validation exceptions (`MethodArgumentNotValidException`), entity not found errors, and conflict errors appropriately.
10. **Tests** – Write unit tests for services and integration tests for controllers using Spring Boot Test.  Use H2 in‑memory database for tests and assert business rules (e.g. automatic approval, conflict detection, authorization).  Ensure at least the core workflows pass.
11. **Seed data** – Provide a development migration or data initializer to insert a few sample records: one user of each role, a handful of rooms of each type, a discipline, a project (pending), and some reservations.  This should align with the credentials in the README【832812593882609†L37-L46】.
12. **Documentation** – Update `README.md` or create `README_BACKEND.md` with instructions to run the backend: environment variables (e.g. database connection, JWT secret), commands to build and run, and API examples.  Optionally enable Swagger/OpenAPI at `/swagger-ui.html` for API exploration.

## 6 Validation and Business Logic Summary

* **Date/time validation** – `dataFim` must be after `dataInicio`; similarly, `horaFim` after `horaInicio` for availabilities.  Reject invalid ranges with HTTP 400.
* **Conflict detection** – Before saving a reservation or approving a pending one, check that the time range does not overlap any existing approved reservation for the same room.  Use the predicate `newStart < existingEnd && newEnd > existingStart`.
* **Room restrictions** – Reject attempts to reserve rooms that do not allow reservations (e.g. `DEPARTAMENTO` or `permiteReserva=false`)【315317018749566†L48-L50】.
* **Auto‑approval** – For single‑day reservations of lab/class rooms, auto‑approve if no conflict【315317018749566†L44-L45】.  For project rooms, auto‑approve for project members【315317018749566†L50-L51】.
* **Semester reservations** – Always create with `status=PENDENTE` and require approval by GESTOR【315317018749566†L46-L47】.  GESTOR must re‑check conflicts before approval.
* **Visibility** – For `visibilidade=PRIVADA`, only the creator and GESTOR see full details.  Others should see a generic “Ocupado” title and hide description.
* **Project management** – Only the project tutor or designated project managers (`isGestor=true`) can manage members and availabilities.  GESTOR can override.

## 7 Next Steps for Codex

1. Clone the repository and inspect the frontend code, especially the `src/types/index.ts` file to align DTOs【649274781604608†L0-L90】.
2. Read `PlanodoProjeto (PDF)` for deeper understanding of use cases and data dictionary.  Use the diagrams provided in `diagramas` if helpful.
3. Follow the implementation plan above: create the `backend` folder, set up Spring Boot, define entities and repositories, implement business services, expose REST controllers, configure security, and write tests.
4. Build incrementally and validate against the frontend to ensure that endpoints return the expected DTO shapes.
5. Keep all code self‑contained within the `backend` directory.  Do **not** modify frontend files unless explicitly implementing cross‑cutting features, and respect the conventions described in `AGENTS.md`【596138412190318†L18-L24】.

By following this plan, the backend will align with the project’s specifications and integrate smoothly with the existing frontend.
