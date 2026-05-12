# SOL — Sistema de Ocupação de Locais

Room management and reservation system for **UTFPR Campus Curitiba Sede Centro**.

Replaces manual email/in-person room booking with a self-service web platform where professors, project students, and tutors can view and reserve rooms autonomously, under supervision of the Gestor de Salas.

## Project Structure

```
project/
  frontend/     — React 18 + TypeScript + Vite (active)
  backend/      — Java 17 + Spring Boot 3 (planned)
  CLAUDE.md     — AI assistant context (roles, rules, conventions)
  AGENTS.md     — Subagent guidelines for AI-assisted development
  README.md     — This file
```

## Quick Start (Frontend)

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

## Documentation

Full specification: `../Documentation/PlanodoProjeto.pdf` (80 pages, Portuguese).

Covers: requirements, use cases, class diagrams, data dictionary, sequence diagrams.

  ┌───────────┬─────────────────────┬──────────┐
  │   Role    │        Email        │ Password │
  ├───────────┼─────────────────────┼──────────┤
  │ GESTOR    │ gestor@utfpr.edu.br │ 123456   │
  ├───────────┼─────────────────────┼──────────┤
  │ PROFESSOR │ ana@utfpr.edu.br    │ 123456   │
  ├───────────┼─────────────────────┼──────────┤
  │ TUTOR     │ carlos@utfpr.edu.br │ 123456   │
  ├───────────┼─────────────────────┼──────────┤
  │ ALUNO     │ maria@utfpr.edu.br  │ 123456   │
  └───────────┴─────────────────────┴──────────┘


## Team

Arthur G. P. Heberle, Luiz Henrique de Souza Correia, Rafael de Andrade Fernandes, Vinícius Romualdo Silva — UTFPR 2026
