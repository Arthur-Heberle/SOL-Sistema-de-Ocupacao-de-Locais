# Diagramas Mermaid do Sistema S.O.L.

Arquivos gerados para complementar a documentação do projeto **S.O.L. — Sistema de Ocupação de Locais**.

Critério adotado: os diagramas foram baseados nos casos de uso, dicionário de classes e regras descritas no arquivo `PlanodoProjeto (1).md`. Para os diagramas de estados e atividades, foi seguido o padrão do grupo de referência: selecionar classes diretamente envolvidas em cada UC e detalhar o estado/atividade principal relacionado ao fluxo do caso de uso.


## Decisões de modelagem

### 1. Diagramas de Comunicação

Foi gerado **1 diagrama de comunicação para cada caso de uso**:

| UC | Caso de uso | Diagrama gerado |
|---|---|---|
| UC001 | Autenticação de Usuário | Comunicação UC001 |
| UC002 | Realizar Reserva de Sala para um Dia | Comunicação UC002 |
| UC003 | Realizar Reserva Definitiva/Semestral | Comunicação UC003 |
| UC004 | Aprovar Solicitações do Sistema | Comunicação UC004 |
| UC005 | Visualizar Grade de Horários | Comunicação UC005 |
| UC006 | Registrar Projeto | Comunicação UC006 |
| UC007 | Gerenciar Sala e Atividades de Projeto | Comunicação UC007 |
| UC008 | Gerenciar Horários Livres dos Integrantes | Comunicação UC008 |
| UC009 | Manter Usuários | Comunicação UC009 |
| UC010 | Manter Salas | Comunicação UC010 |
| UC011 | Manter Disciplinas | Comunicação UC011 |
| UC012 | Gerenciar Membros do Projeto | Comunicação UC012 |

### 2. Classes escolhidas para Diagramas de Estados

Seguindo o padrão do outro grupo, foram escolhidas classes que participam diretamente de cada UC, normalmente uma classe de interface/página/componente e uma classe de controller/service responsável pela regra de negócio.

| UC | Classes escolhidas | Justificativa |
|---|---|---|
| UC001 | `LoginPage`, `UsuarioController` | A página controla a entrada de credenciais e o controller coordena a autenticação. |
| UC002 | `ModalReservaComponent`, `ReservaService` | O modal coleta os dados da reserva diária e o service valida/consolida a reserva. |
| UC003 | `ModalReservaComponent`, `ReservaService` | O modal envia o pedido semestral e o service gera uma solicitação pendente. |
| UC004 | `DashboardPage`, `ReservaService`, `ProjetoService` | O dashboard apresenta solicitações; reservas e projetos podem ser aprovados/rejeitados. |
| UC005 | `MapaComponent`, `SalaService` | O componente exibe filtros/grade e o service recupera disponibilidade e ocupações. |
| UC006 | `FormProjetoComponent`, `ProjetoService` | O formulário coleta dados do projeto e o service registra o projeto pendente. |
| UC007 | `ProjetoPage`, `ReservaService` | A página do projeto permite gerir atividades e o service registra atividades na sala do projeto. |
| UC008 | `HorariosLivresComponent`, `DisponibilidadeService` | O componente coleta horários livres e o service calcula a interseção dos membros. |
| UC009 | `GestaoUsuariosPage`, `UsuarioService` | A página lista/edita usuários e o service processa regras de CRUD. |
| UC010 | `GestaoSalasPage`, `SalaService` | A página administra salas e o service valida/realiza CRUD de salas. |
| UC011 | `GestaoDisciplinasPage`, `DisciplinaService` | A página administra disciplinas e o service realiza cadastro/importação/edição. |
| UC012 | `ProjetoPage`, `ProjetoService` | A página permite gerenciar membros e o service atualiza vínculos do projeto. |

### 3. Estados escolhidos para Diagramas de Atividades

Para cada classe selecionada no diagrama de estados, foi escolhido o estado mais representativo do fluxo daquele UC. Esses estados geram os diagramas de atividades correspondentes.

| UC | Classe | Estado detalhado por atividade |
|---|---|---|
| UC001 | `LoginPage` | Aguardando autenticação de usuário |
| UC001 | `UsuarioController` | Realizando autenticação |
| UC002 | `ModalReservaComponent` | Preenchendo reserva diária |
| UC002 | `ReservaService` | Registrando reserva diária |
| UC003 | `ModalReservaComponent` | Preenchendo reserva semestral |
| UC003 | `ReservaService` | Gerando solicitação pendente |
| UC004 | `DashboardPage` | Avaliando solicitação pendente |
| UC004 | `ReservaService` | Atualizando status da reserva |
| UC004 | `ProjetoService` | Atualizando status do projeto |
| UC005 | `MapaComponent` | Aplicando filtros de visualização |
| UC005 | `SalaService` | Consultando grade de horários |
| UC006 | `FormProjetoComponent` | Preenchendo cadastro de projeto |
| UC006 | `ProjetoService` | Registrando projeto pendente |
| UC007 | `ProjetoPage` | Gerenciando atividade do projeto |
| UC007 | `ReservaService` | Registrando atividade do projeto |
| UC008 | `HorariosLivresComponent` | Selecionando horários livres |
| UC008 | `DisponibilidadeService` | Calculando interseção de horários |
| UC009 | `GestaoUsuariosPage` | Gerenciando usuários |
| UC009 | `UsuarioService` | Processando manutenção de usuários |
| UC010 | `GestaoSalasPage` | Gerenciando salas |
| UC010 | `SalaService` | Processando manutenção de salas |
| UC011 | `GestaoDisciplinasPage` | Gerenciando disciplinas |
| UC011 | `DisciplinaService` | Processando manutenção de disciplinas |
| UC012 | `ProjetoPage` | Gerenciando membros do projeto |
| UC012 | `ProjetoService` | Atualizando vínculos de membros |

