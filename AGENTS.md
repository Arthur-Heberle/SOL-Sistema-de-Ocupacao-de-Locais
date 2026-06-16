# AGENTS.md - SOL Project

Guidelines for AI subagents working on this project.

## PDF Reading Agents

When reading `/home/aheberle/UTFPR/APS/Documentation/PlanodoProjeto.pdf`:

| Agent | Pages | Focus |
|-------|-------|-------|
| Agent A | 9-20 | Requirements, tech stack, user roles, RF/RNF/RP/REU |
| Agent B | 21-35 | Use cases UC001-UC012, class diagrams (Figuras 1-3) |
| Agent C | 36-75 | Data dictionary, DTOs, service classes, sequence diagrams, business rules |

Always run these 3 agents **IN PARALLEL** (single message with 3 Agent tool calls).

Prefer `PlanodoProjeto.md` when the local Markdown version is sufficient.

## Code Agents

- Frontend changes belong in `project/frontend/src/`.
- Backend changes belong in `project/backend/`.
- Do not modify generated build output or dependency caches.
- Follow conventions in `CLAUDE.md` for frontend: PascalCase components, CSS Modules, no barrel files.
- Every not-yet-implemented frontend component must have a visible stub `<div>` with its name.

## Implementation Rules

- Frontend stack: React 18 + TypeScript + Vite.
- Backend stack: Java 17 + Spring Boot 3 + Maven + Spring Data JPA + Spring Security JWT + Flyway + PostgreSQL.
- Role guard: frontend routes use `ProtectedRoute` with `minRole`; do not inline role checks in pages.
- Auth state: frontend uses `useAuth()` from `AuthContext`; do not read localStorage directly.
- Type definitions: frontend imports from `src/types/index.ts`; do not inline duplicate frontend types.
- Backend DTOs and API payloads must stay compatible with `frontend/src/types/index.ts`.
- Backend business rules belong in services; controllers should delegate validation/authorization decisions to services or Spring Security.
- Backend authentication must use `UsuarioRepository`, BCrypt password hashes and JWT; do not expose `senhaHash` in DTOs.

## Review Agents

After any frontend feature addition:

```bash
cd project/frontend && npm run build
```

Expected: zero TypeScript errors, zero missing imports.

After any backend feature addition:

```bash
cd project/backend && mvn test
cd project/backend && mvn package
```

Expected: zero compilation errors and passing tests.

## Forbidden Actions

- Do NOT commit `.env` files or secrets.
- Do NOT modify `project/frontend/` when the task is backend-only.
- Do NOT skip `ProtectedRoute` for any frontend route that requires authentication.
- Do NOT bypass backend service-layer business rules with controller-only checks.
