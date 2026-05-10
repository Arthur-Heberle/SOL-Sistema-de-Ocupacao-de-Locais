# Guia do Usuário — S.O.L.
## Sistema de Ocupação de Locais — UTFPR Campus Curitiba

---

## O que é o SOL?

O SOL é um sistema web de gestão e reserva de salas para a UTFPR Campus Curitiba Sede Centro. Ele substitui o processo manual de reservas por e-mail ou contato presencial, permitindo que professores, tutores e alunos de projetos visualizem e reservem salas de forma autônoma, com supervisão do Gestor de Salas.

---

## Como Acessar

1. Abra um navegador moderno (Chrome, Firefox, Edge)
2. Acesse o endereço do sistema
3. Você será redirecionado automaticamente para a tela de **Login**

---

## Perfis de Usuário

O sistema possui quatro perfis com permissões diferentes:

| Perfil | O que pode fazer |
|--------|-----------------|
| **Aluno** | Visualizar o mapa de salas e horários |
| **Tutor / Aluno de Projeto** | Tudo do Aluno + gerenciar sala do projeto, agendar atividades, gerenciar horários livres |
| **Professor** | Tudo do Tutor + reservar salas por dia ou semestre, registrar projetos |
| **Gestor de Salas** | Acesso total: aprovar reservas, gerenciar usuários, salas e disciplinas |

---

## Tela de Login

- Insira seu **e-mail institucional** (ex: `usuario@utfpr.edu.br`) e sua **senha**
- Clique em **Entrar**
- Após o login, você será redirecionado automaticamente para a página correspondente ao seu perfil

> **Atalhos para desenvolvimento** (enquanto o backend não está conectado):
> Na tela de login há botões para simular o acesso com cada perfil (ALUNO, PROFESSOR, TUTOR, GESTOR). Use-os para testar a navegação sem precisar de credenciais reais.

---

## Navegação

A barra de navegação no topo da tela exibe os menus disponíveis conforme o seu perfil:

| Menu | Quem vê | O que faz |
|------|---------|-----------|
| **Mapa** | Todos | Visualizar salas e horários |
| **Dashboard** | Professor e Gestor | Ver e aprovar solicitações pendentes |
| **Usuários** | Gestor | Gerenciar cadastros de usuários |
| **Salas** | Gestor | Gerenciar cadastro de salas |
| **Disciplinas** | Gestor | Gerenciar disciplinas do semestre |

O seu nome e perfil aparecem no canto direito da barra. Clique em **Sair** para encerrar a sessão.

---

## Páginas do Sistema

### Mapa de Salas (`/mapa`)
**Disponível para:** Todos os usuários autenticados

- Visualize as salas disponíveis agrupadas por bloco
- Use a **barra de filtros** para buscar por bloco, data ou projeto
- Cada sala é exibida com uma cor indicando seu estado:
  - **Verde** — disponível para reserva
  - **Cinza** — somente visualização (salas de departamento, sem reserva)
- Clique em uma sala para ver detalhes e solicitar reserva

#### Tipos de Reserva
- **Reserva por um dia:** confirmada automaticamente se a sala estiver livre
- **Reserva semestral:** gera uma solicitação pendente que precisa ser aprovada pelo Gestor de Salas

---

### Dashboard — Solicitações Pendentes (`/dashboard`)
**Disponível para:** Professor e Gestor

- Exibe todas as reservas com status **Pendente** que aguardam aprovação
- Cada solicitação mostra: título, sala, horário e solicitante
- O **Gestor de Salas** pode clicar em **Aprovar** ou **Rejeitar** cada solicitação

---

### Gerenciar Projeto (`/projetos/:id`)
**Disponível para:** Tutor e Aluno de Projeto

Esta página possui três seções:

#### Detalhes do Projeto
- Preencha e envie o formulário com: nome, descrição e categoria do projeto (Ensino, Pesquisa, Extensão ou Gestão)
- O projeto ficará com status **Pendente** até ser aprovado pelo Gestor

#### Horários Livres dos Integrantes
- Selecione os blocos de horário em que você está disponível durante a semana
- O sistema calcula a interseção de disponibilidade com os outros integrantes para sugerir horários de reunião
- Clique em **Salvar Horários** para confirmar

#### Membros
- Visualize e gerencie os integrantes do projeto (em desenvolvimento)

---

### Gestão de Usuários (`/admin/usuarios`)
**Disponível para:** Gestor

- Visualize todos os usuários cadastrados no sistema
- Crie, edite ou desative contas de usuários
- Defina o perfil de acesso de cada usuário

---

### Gestão de Salas (`/admin/salas`)
**Disponível para:** Gestor

- Visualize o inventário de salas da universidade
- Cadastre novas salas informando: bloco, código (ex: CB-102), tipo, capacidade e se permite reserva
- Edite ou remova salas existentes

> **Atenção:** Salas do tipo **Departamento** têm a opção "Permite Reserva" desativada e aparecem apenas para visualização no mapa — nenhum usuário pode reservá-las.

---

### Gestão de Disciplinas (`/admin/disciplinas`)
**Disponível para:** Gestor

- Visualize as disciplinas cadastradas para o semestre
- Cadastre disciplinas manualmente informando: código, nome, professor responsável, carga horária e turma
- Importe disciplinas em lote (em desenvolvimento)

---

## Regras Importantes

1. **Reservas por um dia** em salas comuns (Laboratório, Aula) são aprovadas automaticamente se não houver conflito de horário.
2. **Reservas semestrais** sempre ficam pendentes e precisam de aprovação do Gestor de Salas.
3. **Salas de projeto** só podem ser reservadas por integrantes do projeto correspondente.
4. **Salas de departamento** aparecem no mapa apenas para localização — não é possível fazer reservas.
5. **Atividades privadas** (`Privada`) são visíveis apenas para o criador e o Gestor. **Atividades públicas** (`Pública`) são visíveis para todos os membros do projeto.

---

## Dúvidas ou Problemas?

Entre em contato com o **Gestor de Salas** do seu departamento ou com a equipe de desenvolvimento:

- Arthur G. P. Heberle
- Luiz Henrique de Souza Correia
- Rafael de Andrade Fernandes
- Vinícius Romualdo Silva

*UTFPR — Curitiba, 2026*
