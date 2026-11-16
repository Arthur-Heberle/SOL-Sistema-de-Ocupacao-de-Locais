# AGENTS.md

Diretrizes para agentes de IA que trabalham neste repositório. O contexto do domínio (perfis, regras de negócio, entidades) está em `CLAUDE.md`.

## Escopo

- Código da aplicação: `frontend/src/`.
- Documentação acadêmica (especificação e diagramas): `docs/`. Não altere sem pedido explícito.
- `backend/` ainda não existe.

## Regras de implementação

- Proteção de rotas: use `ProtectedRoute` com `minRole`; não faça checagens de perfil inline para bloquear páginas.
- Autenticação: use `useAuth()` de `src/context/AuthContext.tsx`; nunca leia `localStorage` diretamente.
- Dados: sempre via serviços em `src/services/`.
- Tipos: importe de `src/types/index.ts`.
- Estilos: CSS Modules + tokens de `src/index.css`; reutilize os componentes de `src/components/ui/` antes de criar novos. Sem `style={{}}` exceto para posicionamento calculado.
- Datas: use `src/utils/datas.ts`.
- Sem emojis na interface ou na documentação.

## Verificação

```bash
cd frontend && npm run build && npm run lint
```

Esperado: zero erros de TypeScript e de lint.

## Proibido

- Commitar `.env` ou segredos.
- Adicionar linhas `Co-Authored-By` de IA em commits.
