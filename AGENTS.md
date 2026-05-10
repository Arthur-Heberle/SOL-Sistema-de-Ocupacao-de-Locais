# AGENTS.md — SOL Project

Guidelines for AI subagents working on this project.

## PDF Reading Agents

When reading `/home/aheberle/UTFPR/APS/Documentation/PlanodoProjeto.pdf`:

| Agent | Pages | Focus |
|-------|-------|-------|
| Agent A | 9-20 | Requirements, tech stack, user roles, RF/RNF/RP/REU |
| Agent B | 21-35 | Use cases UC001-UC012, class diagrams (Figuras 1-3) |
| Agent C | 36-75 | Data dictionary, DTOs, service classes, sequence diagrams, business rules |

Always run these 3 agents **IN PARALLEL** (single message with 3 Agent tool calls).

## Code Agents

- Only modify files inside `project/frontend/src/`
- Follow conventions in `CLAUDE.md`: PascalCase components, CSS Modules, no barrel files
- Never touch `project/backend/` — it does not exist yet
- Every component must have a visible stub `<div>` with its name when not yet implemented

## Implementation Rules

- Tech stack: React 18 + TypeScript + Vite (frontend), Java Spring Boot (backend, future)
- Role guard: use `ProtectedRoute` with `minRole` prop — never inline role checks in pages
- Auth state: always use `useAuth()` from `AuthContext` — never read localStorage directly
- Type definitions: always import from `src/types/index.ts` — never inline types

## Review Agents

After any feature addition:

```bash
cd project/frontend && npm run build
```

Expected: zero TypeScript errors, zero missing imports.

## Forbidden Actions

- Do NOT commit `.env` files or secrets
- Do NOT create new files outside `src/` without updating this AGENTS.md
- Do NOT skip `ProtectedRoute` for any route that requires authentication
