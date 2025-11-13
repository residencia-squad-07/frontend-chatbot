
## Papéis de acesso

- Plataforma_admin:
  - Acesso global, CRUD de empresas.
  - Referência: `src/pages/Login.tsx:20` (seleção do papel e rota).
- Empresa_admin (cliente):
  - Visão restrita à própria empresa, gestão de telefones.
  - Referência: `src/pages/CompanyDashboard.tsx:22`.

## Mapeamento com o banco

- Tabelas usadas como referência:
  - Administrador
  - Empresa (`id_empresa`, `nome_empresa`, `cnpj`, `token_api`)
  - Usuario (`id_user`, `nome`, `telefone`, `papel`, `atividade`, `id_empresa`)
  - Solicitacao
  - ConfiguracaoERP (`url_api`, `token_api`, `status`, `id_empresa`)
- Modelo no front:
  - Empresa: `src/contexts/CompanyContext.tsx:3` (campos idênticos à tabela).
  - Usuário (telefones por empresa): `src/contexts/UserContext.tsx:3`.

## Arquitetura do frontend

- Páginas:
  - Login: `src/pages/Login.tsx:17` (login sem backend, escolha de papel)
  - Dashboard (plataforma): `src/pages/Dashboard.tsx:12`
  - CompanyDashboard (cliente): `src/pages/CompanyDashboard.tsx:22`
- Contextos:
  - Autenticação: `src/contexts/AuthContext.tsx:15` (sessão simples com papel)
  - Empresas (Empresa): `src/contexts/CompanyContext.tsx:3`
  - Usuários (Usuario): `src/contexts/UserContext.tsx:3`
- Componentes:
  - Tabela de empresas: `src/components/CompanyTable.tsx:61`
  - Modal de empresa: `src/components/CompanyModal.tsx:116`

## Tecnologias

- Vite + React + TypeScript
- TailwindCSS + shadcn/ui (Radix UI)
- React Router
- TanStack Query (configurado; uso ampliável na integração)

## Scripts

- Desenvolvimento: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`

## Execução local

1. Instale dependências: `npm install`
2. Rode o projeto: `npm run dev`
3. Acesse: `http://localhost:5173`

## Integração com backend

- Autenticação: trocar login simples por `POST /auth/login` em `src/contexts/AuthContext.tsx:15` (armazenar `token`, `tipo_usuario`, `id_empresa`).
- Empresas: substituir localStorage por chamadas à API em `src/contexts/CompanyContext.tsx:22`.
- Usuários/telefones: expor endpoints para CRUD escopado por empresa; ligar `src/contexts/UserContext.tsx:3`.
- Configuração ERP: mapear `status` e `token_api` da `ConfiguracaoERP` quando for necessário.

## Convenções de branch e commits

- Branches (recomendado):
  - `feature/nome-da-feature`
  - `fix/nome-do-bug`
  - `chore/descricao`
- Commits (Conventional Commits):
  - `feat(front): adicionar gestão de telefones`
  - `fix(ui): corrigir validação de CNPJ`
  - `refactor(context): alinhar campos à tabela Empresa`
