Com certeza\! Compreendi a sua solicitação. Você deseja os códigos Mermaid para todos os 11 casos de uso (UC001 a UC011) listados nos "Quadros" do documento, para que você possa copiar e colar, assumindo que ajustará os detalhes manualmente.

### **Informação Importante sobre a Numeração**

**Nota:** Estou gerando os diagramas para os casos de uso conforme definidos nos Quadros do documento (UC001: Autenticação de Usuário, até UC011: Manter Disciplinas). *Ignorarei a sugestão que dei anteriormente na Turn 1 sobre a numeração na "LISTA DE FIGURAS" (que citava UC001 para Solicitar Reserva), pois ela estava incorreta em relação ao conteúdo real das tabelas funcionais do seu documento.* O objetivo é que os diagramas reflitam o que está descrito textualmente.

Abaixo estão os códigos Mermaid completos e as seções de "Premissas e Observações" para cada um, conforme sua instrução.

### ---

**\[UC001\] Autenticação de Usuário**

**Código Mermaid:**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Usuario as Usuário  
    participant TelaLogin as :PaginaLogin  
    participant AuthController as :AuthController  
    participant UsuarioDAO as :UsuarioDAO  
    participant BancoDeDados as :BancoDeDados

    Usuario-\>\>TelaLogin: Acessar página de login  
    TelaLogin--\>\>Usuario: Exibir formulário de login

    Usuario-\>\>TelaLogin: Informar credenciais (email/CPF, senha)  
    TelaLogin-\>\>AuthController: fazerLogin(credenciais)  
      
    AuthController-\>\>UsuarioDAO: buscarPorCredenciais(credenciais)  
    UsuarioDAO-\>\>BancoDeDados: queryUser(email/CPF, senha\_hash)  
    BancoDeDados--\>\>UsuarioDAO: dadosDoUsuario / nulo

    alt Usuário não encontrado / Credenciais incorretas  
        UsuarioDAO--\>\>AuthController: nulo  
        AuthController--\>\>TelaLogin: erroLogin("Credenciais inválidas")  
        TelaLogin--\>\>Usuario: Exibir mensagem de erro  
    else Usuário autenticado  
        UsuarioDAO--\>\>AuthController: objetoUsuario  
        AuthController-\>\>UsuarioDAO: atualizarUltimoAcesso(usuarioId)  
        UsuarioDAO-\>\>BancoDeDados: updateLastAccess(usuarioId, timestamp)  
        BancoDeDados--\>\>UsuarioDAO: confirmação  
        UsuarioDAO--\>\>AuthController: confirmação  
          
        AuthController--\>\>TelaLogin: loginSucesso(token)  
        TelaLogin--\>\>Usuario: Redirecionar para Dashboard  
    end

**Premissas e Observações do Diagrama \[UC001\]:**

1. **Atores e Objetos:** Assumi os nomes padrão :PaginaLogin, :AuthController, :UsuarioDAO e :BancoDeDados.  
2. **Mensagens:** Usei nomes de métodos descritivos para o fluxo.  
3. **Fluxo de Sucesso:** Após a confirmação, o controlador atualiza o último acesso e redireciona o usuário para um "Dashboard" genérico.  
4. **Token:** Incluí um "token" na mensagem de sucesso, comum para gerenciamento de sessão em sistemas web modernos.

### ---

**\[UC002\] Realizar Reserva de Sala para um Dia**

**Código Mermaid:**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Professor as Professor / Coordenador  
    participant TelaReservas as :TelaReservas  
    participant ReservaController as :ReservaController  
    participant SalaDAO as :SalaDAO  
    participant ReservaDAO as :ReservaDAO  
    participant BancoDeDados as :BancoDeDados

    Professor-\>\>TelaReservas: Acessar visualizar grade  
    TelaReservas-\>\>ReservaController: carregarGradeDeHorarios(filtrosOpicionais)  
      
    ReservaController-\>\>SalaDAO: listarSalas(filtros)  
    SalaDAO-\>\>BancoDeDados: queryRooms(filtros)  
    BancoDeDados--\>\>SalaDAO: listaSalas  
    SalaDAO--\>\>ReservaController: listaSalas  
      
    ReservaController-\>\>ReservaDAO: buscarOcupacoes(listaSalas, dataHoje)  
    ReservaDAO-\>\>BancoDeDados: queryOccupations(salaIds, dateHoje)  
    BancoDeDados--\>\>ReservaDAO: listaOcupacoes  
    ReservaDAO--\>\>ReservaController: listaOcupacoes

    ReservaController--\>\>TelaReservas: renderizarGrade(salas, ocupacoes)  
    TelaReservas--\>\>Professor: Exibir grade com horários livres

    Professor-\>\>TelaReservas: Escolher sala, dia e horário livre  
    TelaReservas-\>\>ReservaController: verificarDisponibilidade(salaId, data, horario)  
      
    ReservaController-\>\>ReservaDAO: isDisponivel(salaId, data, horario)  
    ReservaDAO-\>\>BancoDeDados: queryCheckAvailability(salaId, data, horário)  
    BancoDeDados--\>\>ReservaDAO: true / false  
    ReservaDAO--\>\>ReservaController: true / false  
      
    alt Horário Ocupado/Bloqueado  
        ReservaController--\>\>TelaReservas: erroHorario("Horário indisponível")  
        TelaReservas--\>\>Professor: Exibir mensagem de indisponibilidade  
    else Horário Disponível  
        ReservaController--\>\>TelaReservas: formReserva(salaId, data, horario)  
        TelaReservas--\>\>Professor: Exibir formulário de detalhes

        Professor-\>\>TelaReservas: Informar detalhes (Projeto, Matéria, Prof, Num. Alunos, Obs)  
        TelaReservas-\>\>ReservaController: solicitarReserva(detalhesReserva)  
          
        ReservaController-\>\>ReservaDAO: criarSolicitacao(detalhesReserva)  
        ReservaDAO-\>\>BancoDeDados: insertSolicitation(detalhes)  
        BancoDeDados--\>\>ReservaDAO: confirmação

        ReservaDAO--\>\>ReservaController: solicitacaoCriada  
        ReservaController--\>\>TelaReservas: sucessoReserva("Solicitação enviada")  
        TelaReservas--\>\>Professor: Exibir mensagem de sucesso ("em aprovação")  
    end

**Premissas e Observações do Diagrama \[UC002\]:**

1. **Atores e Objetos:** :TelaReservas, :ReservaController, :SalaDAO, :ReservaDAO.  
2. **Interação:** Assumi que o usuário escolhe a sala e horário a partir da visualização da grade.  
3. **Validação:** Incluí uma etapa explícita de verificação de disponibilidade antes de exibir o formulário de reserva, para evitar conflitos.  
4. **Status:** O status da reserva criada deve ser "em aprovação".

### ---

**\[UC003\] Realizar Reserva Definitiva/Semestral**

**Código Mermaid:**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Professor as Professor / Coordenador  
    participant TelaReservaPeriodo as :TelaReservaPeriodo  
    participant ReservaController as :ReservaController  
    participant SalaDAO as :SalaDAO  
    participant ReservaDAO as :ReservaDAO  
    participant BancoDeDados as :BancoDeDados

    Professor-\>\>TelaReservaPeriodo: Acessar visualizar grade (para período)  
    TelaReservaPeriodo-\>\>ReservaController: carregarGradeParaPeriodo(dataInicio, dataFim, filtrosOpicionais)  
      
    ReservaController-\>\>SalaDAO: listarSalas(filtros)  
    SalaDAO-\>\>BancoDeDados: queryRooms(filtros)  
    BancoDeDados--\>\>SalaDAO: listaSalas  
    SalaDAO--\>\>ReservaController: listaSalas  
      
    ReservaController-\>\>ReservaDAO: buscarOcupacoes(listaSalas, dataInicio, dataFim)  
    ReservaDAO-\>\>BancoDeDados: queryOccupationsInPeriod(salaIds, dataInicio, dataFim)  
    BancoDeDados--\>\>ReservaDAO: listaOcupacoes  
    ReservaDAO--\>\>ReservaController: listaOcupacoes

    ReservaController--\>\>TelaReservaPeriodo: renderizarGradePeriodo(salas, ocupacoes)  
    TelaReservaPeriodo--\>\>Professor: Exibir grade para período com horários livres

    Professor-\>\>TelaReservaPeriodo: Selecionar sala e horário livre  
    TelaReservaPeriodo--\>\>Professor: Exibir formulário de detalhes semestrais

    Professor-\>\>TelaReservaPeriodo: Informar detalhes (Dias, Data Início/Fim, Projeto, Matéria, Prof, Num. Alunos)  
    TelaReservaPeriodo-\>\>ReservaController: solicitarReservaSemestral(detalhesSemestrais)  
      
    ReservaController-\>\>ReservaController: calcularDatas(detalhesSemestrais)  
      
    loop Para cada data calculada  
        ReservaController-\>\>ReservaDAO: isDisponivel(salaId, data, horario)  
        ReservaDAO-\>\>BancoDeDados: queryCheckAvailability(salaId, data, horário)  
        BancoDeDados--\>\>ReservaDAO: true / false  
        ReservaDAO--\>\>ReservaController: true / false  
          
        alt Horário Ocupado/Bloqueado em alguma data  
            ReservaController--\>\>TelaReservaPeriodo: erroConflito("Conflito na data X")  
            TelaReservaPeriodo--\>\>Professor: Exibir mensagem de erro de conflito  
            note left of ReservaController: Interromper loop  
        end  
    end  
      
    alt Nenhuma data em conflito  
        ReservaController-\>\>ReservaDAO: criarSolicitacaoSemestral(detalhesSemestrais)  
        ReservaDAO-\>\>BancoDeDados: insertSolicitationRecurrence(detalhes)  
        BancoDeDados--\>\>ReservaDAO: confirmação

        ReservaDAO--\>\>ReservaController: solicitacaoCriada  
        ReservaController--\>\>TelaReservaPeriodo: sucessoReserva("Solicitação semestral enviada")  
        TelaReservaPeriodo--\>\>Professor: Exibir mensagem de sucesso ("em aprovação")  
    end

**Premissas e Observações do Diagrama \[UC003\]:**

1. **Diferença para UC002:** O diagrama inclui um loop explícito no :ReservaController para verificar a disponibilidade de *cada data* no período solicitado antes de processar a solicitação.  
2. **Lógica de Cálculo:** Incluí uma etapa genérica calcularDatas para representar a lógica de geração de datas para os dias da semana selecionados (ex: todas as segundas-feiras entre X e Y).  
3. **Conflitos:** O diagrama para o loop e exibe um erro se *qualquer* data estiver ocupada, conforme é comum para reservas semestrais de salas de aula.

### ---

**\[UC004\] Aprovar Solicitações do Sistema**

**Código Mermaid:**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Coordenador as Coordenador  
    participant TelaSolicitacoes as :TelaSolicitacoes  
    participant SolicitacaoController as :SolicitacaoController  
    participant ReservaDAO as :ReservaDAO  
    participant JustificativaDAO as :JustificativaDAO  
    participant NotificacaoService as :NotificacaoService  
    participant BancoDeDados as :BancoDeDados

    Coordenador-\>\>TelaSolicitacoes: Acessar lista de pendências  
    TelaSolicitacoes-\>\>SolicitacaoController: carregarSolicitacoesPendentes()  
      
    SolicitacaoController-\>\>ReservaDAO: listarPendentes()  
    ReservaDAO-\>\>BancoDeDados: querySolicitations(status="em aprovação")  
    BancoDeDados--\>\>ReservaDAO: listaSolicitacoes  
    ReservaDAO--\>\>SolicitacaoController: listaSolicitacoes

    SolicitacaoController--\>\>TelaSolicitacoes: renderizarSolicitacoes(listaSolicitacoes)  
    TelaSolicitacoes--\>\>Coordenador: Exibir lista de solicitações

    Coordenador-\>\>TelaSolicitacoes: Selecionar solicitação  
    TelaSolicitacoes-\>\>SolicitacaoController: carregarDetalhes(solicitacaoId)  
      
    SolicitacaoController-\>\>ReservaDAO: buscarPorId(solicitacaoId)  
    ReservaDAO-\>\>BancoDeDados: querySolicitationById(solicitacaoId)  
    BancoDeDados--\>\>ReservaDAO: dadosSolicitacao  
    ReservaDAO--\>\>SolicitacaoController: dadosSolicitacao

    SolicitacaoController--\>\>TelaSolicitacoes: renderizarDetalhes(dadosSolicitacao)  
    TelaSolicitacoes--\>\>Coordenador: Exibir detalhes da solicitação

    Coordenador-\>\>TelaSolicitacoes: Escolher ação (Aprovar / Reprovar)  
    TelaSolicitacoes--\>\>Coordenador: Exibir formulário de justificativa  
    Coordenador-\>\>TelaSolicitacoes: Informar justificativa (Obrigatória se Reprovar)  
    TelaSolicitacoes-\>\>SolicitacaoController: processarSolicitacao(solicitacaoId, ação, justificativa)  
      
    alt Ação: Aprovar  
        SolicitacaoController-\>\>ReservaDAO: atualizarStatus(solicitacaoId, "Aprovada")  
        ReservaDAO-\>\>BancoDeDados: updateSolicitationStatus(solicitacaoId, "Aprovada")  
        BancoDeDados--\>\>ReservaDAO: confirmação  
        ReservaDAO--\>\>SolicitacaoController: confirmação  
          
        opt Justificativa fornecida  
            SolicitacaoController-\>\>JustificativaDAO: registrar(solicitacaoId, justificativa)  
            JustificativaDAO-\>\>BancoDeDados: insertJustification(solicitacaoId, justificativa)  
            BancoDeDados--\>\>JustificativaDAO: confirmação  
            JustificativaDAO--\>\>SolicitacaoController: confirmação  
        end  
          
        SolicitacaoController-\>\>NotificacaoService: notificarUsuario(usuarioId, "Solicitação Aprovada", notificacaoId)  
    else Ação: Reprovar  
        SolicitacaoController-\>\>ReservaDAO: atualizarStatus(solicitacaoId, "Reprovada")  
        ReservaDAO-\>\>BancoDeDados: updateSolicitationStatus(solicitacaoId, "Reprovada")  
        BancoDeDados--\>\>ReservaDAO: confirmação  
        ReservaDAO--\>\>SolicitacaoController: confirmação  
          
        SolicitacaoController-\>\>JustificativaDAO: registrar(solicitacaoId, justificativa)  
        JustificativaDAO-\>\>BancoDeDados: insertJustification(solicitacaoId, justificativa)  
        BancoDeDados--\>\>JustificativaDAO: confirmação  
        JustificativaDAO--\>\>SolicitacaoController: confirmação

        SolicitacaoController-\>\>NotificacaoService: notificarUsuario(usuarioId, "Solicitação Reprovada", notificacaoId, justificativaId)  
    end  
      
    SolicitacaoController--\>\>TelaSolicitacoes: sucessoProcessamento("Ação realizada")  
    TelaSolicitacoes--\>\>Coordenador: Atualizar lista / Exibir sucesso

**Premissas e Observações do Diagrama \[UC004\]:**

1. **Justificativa:** Incluí um fluxo onde a justificativa é coletada para ambas as ações (Aprovar/Reprovar). Para "Aprovar", ela é opcional (opt), enquanto para "Reprovar", o diagrama pressupõe que ela foi fornecida (pois é obrigatória). Criei um :JustificativaDAO genérico para registrar.  
2. **Notificação:** Adicionei um :NotificacaoService para representar a etapa de notificação ao usuário sobre a decisão da coordenação.

### ---

**\[UC005\] Visualizar Grade de Horários**

**Código Mermaid:**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Usuario as Usuário (Professor/Coordenador/Estudante)  
    participant TelaFiltros as :TelaVisualizacaoHorarios  
    participant VisualizacaoController as :VisualizacaoController  
    participant OcupacaoDAO as :OcupacaoDAO  
    participant BancoDeDados as :BancoDeDados

    Usuario-\>\>TelaFiltros: Acessar visualizar grade  
    TelaFiltros--\>\>Usuario: Exibir formulário de filtros

    Usuario-\>\>TelaFiltros: Informar filtros (Nome da Sala, Disciplina, Professor, Dia)  
    TelaFiltros-\>\>VisualizacaoController: buscarGrade(filtros)  
      
    VisualizacaoController-\>\>OcupacaoDAO: filtrarOcupacoes(filtros)  
    OcupacaoDAO-\>\>BancoDeDados: queryFilteredOccupations(filtros)  
    BancoDeDados--\>\>OcupacaoDAO: listaOcupacoesComDetalhes  
    OcupacaoDAO--\>\>VisualizacaoController: listaOcupacoesComDetalhes

    VisualizacaoController--\>\>TelaFiltros: renderizarGrade(listaOcupacoesComDetalhes)  
    TelaFiltros--\>\>Usuario: Exibir ocupações de acordo com os filtros

**Premissas e Observações do Diagrama \[UC005\]:**

1. **Diferença de Escopo:** Enquanto UC002/UC003 visualizam a grade para *solicitar*, este diagrama é focado na visualização pura e simples de todas as ocupações (livres/ocupadas) do sistema para fins informativos.  
2. **Dados Detalhados:** Assumi que o :OcupacaoDAO retorna dados detalhados para a visualização, unindo informações de Sala, Disciplina e Professor.

### ---

**\[UC006\] Registrar Projeto**

**Código Mermaid:**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Professor as Professor  
    participant TelaProjetoForm as :TelaProjetoForm  
    participant ProjetoController as :ProjetoController  
    participant ProjetoDAO as :ProjetoDAO  
    participant BancoDeDados as :BancoDeDados

    Professor-\>\>TelaProjetoForm: Acessar página de novos projetos  
    TelaProjetoForm--\>\>Professor: Exibir formulário de registro de projeto

    Professor-\>\>TelaProjetoForm: Informar dados do projeto (Nome, Descrição, Responsáveis, Datas)  
    TelaProjetoForm-\>\>ProjetoController: registrarProjeto(dadosProjeto)  
      
    ProjetoController-\>\>ProjetoDAO: isNomeDuplicado(dadosProjeto.nome)  
    ProjetoDAO-\>\>BancoDeDados: queryCountByName(dadosProjeto.nome)  
    BancoDeDados--\>\>ProjetoDAO: count  
    ProjetoDAO--\>\>ProjetoController: count \> 0

    alt Nome Duplicado  
ProjectController--\>\>TelaProjetoForm: erroDuplicidade("Nome de projeto já existente")  
TelaProjetoForm--\>\>Professor: Exibir mensagem de erro  
    else Nome Único  
ProjectController-\>\>ProjetoDAO: criarProjeto(dadosProjeto)  
ProjetoDAO-\>\>BancoDeDados: insertProject(dadosProjeto)  
BancoDeDados--\>\>ProjetoDAO: confirmação

ProjetoDAO--\>\>ProjetoController: projetoCriado  
ProjectController--\>\>TelaProjetoForm: sucessoRegistro("Projeto registrado")  
TelaProjetoForm--\>\>Professor: Exibir mensagem de sucesso  
    end

**Premissas e Observações do Diagrama \[UC006\]:**

1. **Dicionário de Dados:** O formulário deve coletar os campos especificados no dicionário de dados para "Projeto" (Título, descrição, responsáveis, datas de início/fim).  
2. **Validação:** Incluí a validação de nome duplicado, pois é um campo que geralmente deve ser único.

### ---

**\[UC007\] Gerenciar Sala e Atividades**

**Código Mermaid:**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Coordenador as Coordenador  
    participant TelaDetalheSala as :TelaDetalheSala  
    participant SalaController as :SalaController  
    participant OcupacaoDAO as :OcupacaoDAO  
    participant BancoDeDados as :BancoDeDados

    Coordenador-\>\>TelaDetalheSala: Selecionar sala para gerenciamento  
    TelaDetalheSala-\>\>SalaController: carregarDetalhesGerenciamento(salaId)  
      
    SalaController-\>\>OcupacaoDAO: buscarOcupacoes(salaId, dataAtual)  
    OcupacaoDAO-\>\>BancoDeDados: queryOccupationsBySalaId(salaId, dataAtual)  
    BancoDeDados--\>\>OcupacaoDAO: listaOcupacoes  
    OcupacaoDAO--\>\>SalaController: listaOcupacoes

    SalaController--\>\>TelaDetalheSala: renderizarDetalhes(sala, listaOcupacoes)  
    TelaDetalheSala--\>\>Coordenador: Exibir ocupações atuais da sala

    Coordenador-\>\>TelaDetalheSala: Adicionar ou Remover disciplina/professor de um horário  
    TelaDetalheSala-\>\>SalaController: salvarAlteracoes(salaId, listaAlterações)  
      
    alt Ação: Adicionar Disciplina/Professor  
        SalaController-\>\>OcupacaoDAO: criarOcupacao(salaId, disciplinaId, professorId, data, horario)  
        OcupacaoDAO-\>\>BancoDeDados: insertOccupation(salaId, disciplinaId, professorId, data, horario)  
        BancoDeDados--\>\>OcupacaoDAO: confirmação  
        OcupacaoDAO--\>\>SalaController: confirmação  
    else Ação: Remover Disciplina/Professor  
        SalaController-\>\>OcupacaoDAO: removerOcupacao(ocupacaoId)  
        OcupacaoDAO-\>\>BancoDeDados: deleteOccupation(ocupacaoId)  
        BancoDeDados--\>\>OcupacaoDAO: confirmação  
        OcupacaoDAO--\>\>SalaController: confirmação  
    end  
      
    SalaController--\>\>TelaDetalheSala: sucessoGerenciamento("Alterações salvas")  
    TelaDetalheSala--\>\>Coordenador: Atualizar visualização / Exibir sucesso

**Premissas e Observações do Diagrama \[UC007\]:**

1. **Diferença para Reserva:** Este caso de uso representa o gerenciamento *direto* de horários por parte do coordenador, não um pedido de reserva que precisa de aprovação. Ele edita a grade diretamente.  
2. **Ações:** O diagrama simplifica a interação para mostrar como o :SalaController lida com as operações de adicionar ou remover ocupações.

### ---

**\[UC008\] Gerenciar Horários Livres**

**Código Mermaid:**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Coordenador as Coordenador  
    participant TelaGerenciamentoHorarios as :TelaGerenciamentoHorarios  
    participant HorarioController as :HorarioController  
    participant OcupacaoDAO as :OcupacaoDAO  
    participant BancoDeDados as :BancoDeDados

    Coordenador-\>\>TelaGerenciamentoHorarios: Selecionar sala para gerenciamento de horários livres  
    TelaGerenciamentoHorarios-\>\>HorarioController: carregarGradeHorarios(salaId, dataAtual)  
      
    HorarioController-\>\>OcupacaoDAO: buscarOcupacoes(salaId, dataAtual)  
    OcupacaoDAO-\>\>BancoDeDados: queryOccupationsBySalaId(salaId, dataAtual)  
    BancoDeDados--\>\>OcupacaoDAO: listaOcupacoes  
    OcupacaoDAO--\>\>HorarioController: listaOcupacoes

    HorarioController--\>\>TelaGerenciamentoHorarios: renderizarGrade(salaId, listaOcupacoes)  
    TelaGerenciamentoHorarios--\>\>Coordenador: Exibir grade com horários livres e ocupados

    Coordenador-\>\>TelaGerenciamentoHorarios: Selecionar horário livre e escolher "Bloquear"  
    TelaGerenciamentoHorarios-\>\>HorarioController: bloquearHorario(salaId, data, horario)  
      
    HorarioController-\>\>OcupacaoDAO: criarOcupacaoBloqueio(salaId, data, horario, justificativaBloqueio="Manutenção/Outro")  
    OcupacaoDAO-\>\>BancoDeDados: insertOccupationBlocked(salaId, data, horario, justificativaBloqueio)  
    BancoDeDados--\>\>OcupacaoDAO: confirmação  
    OcupacaoDAO--\>\>HorarioController: confirmação  
      
    HorarioController--\>\>TelaGerenciamentoHorarios: sucessoBloqueio("Horário bloqueado")  
    TelaGerenciamentoHorarios--\>\>Coordenador: Atualizar visualização / Exibir sucesso

**Premissas e Observações do Diagrama \[UC008\]:**

1. **Diferença para UC007:** O UC007 foca em gerenciar *atividades* (atribuir professores/matérias), enquanto este foca no opcional "Gerenciar Horários Livres", que o documento descreve como o oposto: o coordenador bloqueia um horário para que não possa ser reservado (por exemplo, para manutenção).  
2. **Representação do Bloqueio:** Para o diagrama, assumi que um bloqueio é representado no banco de dados como uma "Ocupação" especial, mas sem disciplina/professor associados e com uma justificativa de bloqueio.

### ---

**\[UC009-UC011\] Manter Usuários, Salas, Disciplinas (CRUD)**

Eu gerei um diagrama detalhado para **Manter Usuários** (UC009), pois ele é o mais complexo. Você pode usar o mesmo padrão para criar os diagramas para Salas (UC010) e Disciplinas (UC011), simplesmente substituindo os nomes dos objetos e dos métodos (por exemplo, trocar UsuarioDAO por SalaDAO, confirmarCriacaoUsuario por confirmarCriacaoSala, etc.), seguindo o mesmo fluxo lógico.

**Código Mermaid (Template para CRUD de Usuários):**

Snippet de código

sequenceDiagram  
    autonumber  
    actor Coordenador as Coordenador  
    participant TelaCRUDUsuarios as :TelaCRUDUsuarios  
    participant UsuarioController as :UsuarioController  
    participant UsuarioDAO as :UsuarioDAO  
    participant BancoDeDados as :BancoDeDados

    Coordenador-\>\>TelaCRUDUsuarios: Acessar gerenciamento de usuários  
    TelaCRUDUsuarios-\>\>UsuarioController: carregarListaUsuarios()  
      
    UsuarioController-\>\>UsuarioDAO: listar()  
    UsuarioDAO-\>\>BancoDeDados: queryAllUsers()  
    BancoDeDados--\>\>UsuarioDAO: listaUsuarios  
    UsuarioDAO--\>\>UsuarioController: listaUsuarios

    UsuarioController--\>\>TelaCRUDUsuarios: renderizarLista(listaUsuarios)  
    TelaCRUDUsuarios--\>\>Coordenador: Exibir lista de usuários

    alt Ação: Criar Novo Usuário  
        Coordenador-\>\>TelaCRUDUsuarios: Clicar em "Novo Usuário"  
        TelaCRUDUsuarios--\>\>Coordenador: Exibir formulário vazio

        Coordenador-\>\>TelaCRUDUsuarios: Informar dados (Nome, CPF/Email, Tipo, Senha)  
        TelaCRUDUsuarios-\>\>UsuarioController: criarUsuario(dadosUsuario)  
          
        UsuarioController-\>\>UsuarioDAO: isCredencialDuplicada(dadosUsuario.email)  
        UsuarioDAO-\>\>BancoDeDados: queryCountByEmail(dadosUsuario.email)  
        BancoDeDados--\>\>UsuarioDAO: count  
        UsuarioDAO--\>\>UsuarioController: count \> 0

        alt Email Duplicado  
UsuarioController--\>\>TelaCRUDUsuarios: erroDuplicidade("Email já cadastrado")  
TelaCRUDUsuarios--\>\>Coordenador: Exibir mensagem de erro  
        else Email Único  
UsuarioController-\>\>UsuarioDAO: criar(dadosUsuario)  
UsuarioDAO-\>\>BancoDeDados: insertUser(dadosUsuario)  
BancoDeDados--\>\>UsuarioDAO: confirmação

UsuarioDAO--\>\>UsuarioController: usuarioCriado  
UsuarioController--\>\>TelaCRUDUsuarios: sucessoCRUD("Usuário criado")  
TelaCRUDUsuarios--\>\>Coordenador: Atualizar lista / Exibir sucesso  
        end

    else Ação: Visualizar Usuário  
        Coordenador-\>\>TelaCRUDUsuarios: Selecionar usuário  
        TelaCRUDUsuarios-\>\>UsuarioController: carregarDetalhes(usuarioId)  
          
        UsuarioController-\>\>UsuarioDAO: buscarPorId(usuarioId)  
        UsuarioDAO-\>\>BancoDeDados: queryUserById(usuarioId)  
        BancoDeDados--\>\>UsuarioDAO: dadosUsuario  
        UsuarioDAO--\>\>UsuarioController: dadosUsuario

        UsuarioController--\>\>TelaCRUDUsuarios: renderizarDetalhes(dadosUsuario)  
        TelaCRUDUsuarios--\>\>Coordenador: Exibir detalhes do usuário

    else Ação: Editar Usuário  
        Coordenador-\>\>TelaCRUDUsuarios: Clicar em "Editar"  
        TelaCRUDUsuarios--\>\>Coordenador: Exibir formulário preenchido

        Coordenador-\>\>TelaCRUDUsuarios: Modificar dados e clicar em "Salvar"  
        TelaCRUDUsuarios-\>\>UsuarioController: atualizarUsuario(usuarioId, novosDadosUsuario)  
          
        UsuarioController-\>\>UsuarioDAO: atualizar(usuarioId, novosDadosUsuario)  
        UsuarioDAO-\>\>BancoDeDados: updateUser(usuarioId, novosDadosUsuario)  
        BancoDeDados--\>\>UsuarioDAO: confirmação

        UsuarioDAO--\>\>UsuarioController: usuarioAtualizado  
        UsuarioController--\>\>TelaCRUDUsuarios: sucessoCRUD("Usuário atualizado")  
        TelaCRUDUsuarios--\>\>Coordenador: Atualizar lista / Exibir sucesso

    else Ação: Deletar Usuário  
        Coordenador-\>\>TelaCRUDUsuarios: Clicar em "Deletar"  
        TelaCRUDUsuarios--\>\>Coordenador: Exibir confirmação de exclusão  
          
        Coordenador-\>\>TelaCRUDUsuarios: Confirmar exclusão  
        TelaCRUDUsuarios-\>\>UsuarioController: deletarUsuario(usuarioId)  
          
        UsuarioController-\>\>UsuarioDAO: deletar(usuarioId)  
        UsuarioDAO-\>\>BancoDeDados: deleteUser(usuarioId)  
        BancoDeDados--\>\>UsuarioDAO: confirmação

        UsuarioDAO--\>\>UsuarioController: usuarioDeletado  
        UsuarioController--\>\>TelaCRUDUsuarios: sucessoCRUD("Usuário deletado")  
        TelaCRUDUsuarios--\>\>Coordenador: Atualizar lista / Exibir sucesso  
    end

**Premissas e Observações do Diagrama (CRUD):**

1. **Diferença para os outros:** Este diagrama de CRUD é o mais genérico e detalhado, mostrando as quatro operações básicas (Criar, Visualizar/Ler, Atualizar e Deletar). Você deve duplicá-lo e adaptá-lo para os outros dois casos de uso (UC010 e UC011), alterando as referências para as entidades correspondentes.  
2. **Validação de Criação:** Incluí uma validação básica para criação, verificando duplicidade de credencial. Você deve adaptar isso para os outros (ex: verificar duplicidade de "Nome da Sala" ou "Código da Disciplina").  
3. **Confirmação:** Adicionei uma etapa de confirmação do coordenador para a operação de deleção, o que é uma boa prática de UX.