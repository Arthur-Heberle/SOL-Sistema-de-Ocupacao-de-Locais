# SOL Frontend

React 18 + TypeScript + Vite skeleton for the S.O.L. room management system.

## Setup
npm install
npm run dev   # dev server at http://localhost:5173

## Structure
src/
  pages/       — one file per route/page
  components/  — reusable UI components
  routes/      — route definitions and role guards
  types/       — shared TypeScript interfaces (DTOs, enums)
  context/     — AuthContext (current user + role)
