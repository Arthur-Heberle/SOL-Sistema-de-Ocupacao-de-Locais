# SOL Frontend

Aplicação React 19 + TypeScript + Vite do SOL. Veja o [README principal](../README.md) para a visão geral do projeto.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verificação de tipos + build de produção
npm run lint
```

## Estrutura

| Pasta | Conteúdo |
|-------|----------|
| `src/components/ui/` | Componentes base: `Button`, `Badge`, `Alert`, `Card`, `Field`, `Checkbox`, `Modal`, `PageHeader`, `Table`, `EmptyState` |
| `src/components/` | Componentes de domínio: mapa, linha do tempo, calendário semanal, modal de reserva, mapa de calor |
| `src/pages/` | Uma página por rota |
| `src/services/` | Camada de dados; `mockDB.ts` simula a API com `localStorage` |
| `src/utils/` | Datas em horário local e rótulos de enums |

## Convenções

- Estilos em CSS Modules (`Componente.module.css`); tokens de design em `src/index.css`.
- Páginas nunca acessam `localStorage` diretamente: sempre via `src/services/` ou `useAuth()`.
- Rotas autenticadas passam por `ProtectedRoute` com `minRole`.
- Datas são manipuladas com `src/utils/datas.ts` (evita o deslocamento de fuso de `toISOString()`).
