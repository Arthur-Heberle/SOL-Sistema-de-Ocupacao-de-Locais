package br.edu.utfpr.sol;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.edu.utfpr.sol.entity.Disponibilidade;
import br.edu.utfpr.sol.entity.MembroProjeto;
import br.edu.utfpr.sol.entity.Projeto;
import br.edu.utfpr.sol.entity.Reserva;
import br.edu.utfpr.sol.entity.Sala;
import br.edu.utfpr.sol.entity.Usuario;
import br.edu.utfpr.sol.entity.enums.CategoriaProj;
import br.edu.utfpr.sol.entity.enums.DiaSemana;
import br.edu.utfpr.sol.entity.enums.StatusReserva;
import br.edu.utfpr.sol.entity.enums.TipoSala;
import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import br.edu.utfpr.sol.entity.enums.Visibilidade;
import br.edu.utfpr.sol.repository.DisponibilidadeRepository;
import br.edu.utfpr.sol.repository.MembroProjetoRepository;
import br.edu.utfpr.sol.repository.ProjetoRepository;
import br.edu.utfpr.sol.repository.ReservaRepository;
import br.edu.utfpr.sol.repository.SalaRepository;
import br.edu.utfpr.sol.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SolIntegrationTest {
    private static final String PASSWORD = "123456";

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    SalaRepository salaRepository;

    @Autowired
    ReservaRepository reservaRepository;

    @Autowired
    ProjetoRepository projetoRepository;

    @Autowired
    MembroProjetoRepository membroRepository;

    @Autowired
    DisponibilidadeRepository disponibilidadeRepository;

    Usuario gestor;
    Usuario professor;
    Usuario tutor;
    Usuario aluno;
    Sala laboratorio;

    @BeforeEach
    void setUp() {
        disponibilidadeRepository.deleteAll();
        membroRepository.deleteAll();
        reservaRepository.deleteAll();
        projetoRepository.deleteAll();
        salaRepository.deleteAll();
        usuarioRepository.deleteAll();

        gestor = usuario("Gestor", "gestor@utfpr.edu.br", TipoUsuario.GESTOR, true);
        professor = usuario("Professora Ana", "ana@utfpr.edu.br", TipoUsuario.PROFESSOR, true);
        tutor = usuario("Carlos Tutor", "carlos@utfpr.edu.br", TipoUsuario.TUTOR, true);
        aluno = usuario("Maria Aluna", "maria@utfpr.edu.br", TipoUsuario.ALUNO, true);
        laboratorio = sala("A", "A101", TipoSala.LABORATORIO, true);
    }

    @Test
    void loginValidoInvalidoEInativo() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson("gestor@utfpr.edu.br", PASSWORD)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isNotEmpty())
            .andExpect(jsonPath("$.usuario.tipoUsuario").value("GESTOR"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson("gestor@utfpr.edu.br", "errada")))
            .andExpect(status().isUnauthorized());

        Usuario inactive = usuario("Inativo", "inativo@utfpr.edu.br", TipoUsuario.PROFESSOR, false);
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(inactive.getEmail(), PASSWORD)))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.message").value("Usuário inativo."));
    }

    @Test
    void reservaPontualAutoaprovada() throws Exception {
        mockMvc.perform(post("/api/reservas")
                .header("Authorization", bearer(professor))
                .contentType(MediaType.APPLICATION_JSON)
                .content(reservaJson(laboratorio.getId(), "Aula pontual", false, "2026-08-03T08:00:00", "2026-08-03T10:00:00")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("APROVADA"));
    }

    @Test
    void conflitoDeHorarioRetornaConflict() throws Exception {
        reserva(laboratorio, professor, "Aula existente", StatusReserva.APROVADA, false, "2026-08-03T08:00:00", "2026-08-03T10:00:00");

        mockMvc.perform(post("/api/reservas")
                .header("Authorization", bearer(professor))
                .contentType(MediaType.APPLICATION_JSON)
                .content(reservaJson(laboratorio.getId(), "Aula conflitante", false, "2026-08-03T09:00:00", "2026-08-03T11:00:00")))
            .andExpect(status().isConflict());
    }

    @Test
    void reservaRecorrenteFicaPendente() throws Exception {
        mockMvc.perform(post("/api/reservas")
                .header("Authorization", bearer(professor))
                .contentType(MediaType.APPLICATION_JSON)
                .content(reservaJson(laboratorio.getId(), "Aula recorrente", true, "2026-08-03T08:00:00", "2026-12-14T10:00:00")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PENDENTE"));
    }

    @Test
    void aprovacaoPeloGestorRechecaConflito() throws Exception {
        Reserva pendente = reserva(laboratorio, professor, "Aula pendente", StatusReserva.PENDENTE, true, "2026-08-03T08:00:00", "2026-12-14T10:00:00");
        reserva(laboratorio, tutor, "Aula aprovada", StatusReserva.APROVADA, false, "2026-08-10T09:00:00", "2026-08-10T11:00:00");

        mockMvc.perform(patch("/api/reservas/{id}/aprovar", pendente.getId())
                .header("Authorization", bearer(gestor)))
            .andExpect(status().isConflict());
    }

    @Test
    void salaDepartamentoOuSemPermissaoBloqueiaReserva() throws Exception {
        Sala departamento = sala("D", "D001", TipoSala.DEPARTAMENTO, true);
        Sala bloqueada = sala("B", "B201", TipoSala.AULA, false);

        mockMvc.perform(post("/api/reservas")
                .header("Authorization", bearer(professor))
                .contentType(MediaType.APPLICATION_JSON)
                .content(reservaJson(departamento.getId(), "Departamento", false, "2026-08-03T08:00:00", "2026-08-03T10:00:00")))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/reservas")
                .header("Authorization", bearer(professor))
                .contentType(MediaType.APPLICATION_JSON)
                .content(reservaJson(bloqueada.getId(), "Bloqueada", false, "2026-08-03T10:00:00", "2026-08-03T12:00:00")))
            .andExpect(status().isBadRequest());
    }

    @Test
    void visibilidadePrivadaESanitizadaParaOutroUsuario() throws Exception {
        Reserva privada = reserva(laboratorio, professor, "Banca sigilosa", StatusReserva.APROVADA, false, "2026-08-03T08:00:00", "2026-08-03T10:00:00");
        privada.setVisibilidade(Visibilidade.PRIVADA);
        privada.setDescricao("Detalhes privados");
        reservaRepository.save(privada);

        mockMvc.perform(get("/api/reservas/{id}", privada.getId())
                .header("Authorization", bearer(aluno)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.titulo").value("Ocupado"))
            .andExpect(jsonPath("$.descricao").doesNotExist());

        mockMvc.perform(get("/api/reservas/{id}", privada.getId())
                .header("Authorization", bearer(professor)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.titulo").value("Banca sigilosa"))
            .andExpect(jsonPath("$.descricao").value("Detalhes privados"));
    }

    @Test
    void intersecaoDeDisponibilidades() throws Exception {
        Projeto projeto = projeto("Projeto SOL", tutor, laboratorio, true);
        membro(projeto, tutor, true);
        membro(projeto, aluno, false);
        disponibilidade(projeto, tutor, DiaSemana.SEGUNDA, "08:00", "12:00");
        disponibilidade(projeto, aluno, DiaSemana.SEGUNDA, "10:00", "14:00");
        disponibilidade(projeto, tutor, DiaSemana.TERCA, "08:00", "10:00");
        disponibilidade(projeto, aluno, DiaSemana.TERCA, "11:00", "12:00");

        mockMvc.perform(get("/api/projetos/{id}/disponibilidades/intersecao", projeto.getId())
                .header("Authorization", bearer(tutor)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].diaSemana").value("SEGUNDA"))
            .andExpect(jsonPath("$[0].horaInicio").value("10:00:00"))
            .andExpect(jsonPath("$[0].horaFim").value("12:00:00"));
    }

    private String bearer(Usuario usuario) throws Exception {
        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(usuario.getEmail(), PASSWORD)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        JsonNode json = objectMapper.readTree(response);
        return "Bearer " + json.get("token").asText();
    }

    private String loginJson(String email, String senha) throws Exception {
        return objectMapper.writeValueAsString(new LoginPayload(email, senha));
    }

    private String reservaJson(Long salaId, String titulo, boolean recorrente, String inicio, String fim) throws Exception {
        return objectMapper.writeValueAsString(new ReservaPayload(
            salaId,
            titulo,
            null,
            Visibilidade.PUBLICA,
            LocalDateTime.parse(inicio),
            LocalDateTime.parse(fim),
            recorrente
        ));
    }

    private Usuario usuario(String nome, String email, TipoUsuario tipo, boolean ativo) {
        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setTipoUsuario(tipo);
        usuario.setAtivo(ativo);
        usuario.setSenhaHash(passwordEncoder.encode(PASSWORD));
        return usuarioRepository.save(usuario);
    }

    private Sala sala(String bloco, String codigo, TipoSala tipo, boolean permiteReserva) {
        Sala sala = new Sala();
        sala.setBloco(bloco);
        sala.setCodigoNome(codigo);
        sala.setTipoSala(tipo);
        sala.setCapacidade(30);
        sala.setPossuiProjetor(true);
        sala.setPermiteReserva(permiteReserva);
        return salaRepository.save(sala);
    }

    private Reserva reserva(Sala sala, Usuario usuario, String titulo, StatusReserva status, boolean recorrente, String inicio, String fim) {
        Reserva reserva = new Reserva();
        reserva.setSala(sala);
        reserva.setUsuario(usuario);
        reserva.setTitulo(titulo);
        reserva.setDescricao("Descrição da reserva");
        reserva.setVisibilidade(Visibilidade.PUBLICA);
        reserva.setStatus(status);
        reserva.setRecorrente(recorrente);
        reserva.setDataInicio(LocalDateTime.parse(inicio));
        reserva.setDataFim(LocalDateTime.parse(fim));
        return reservaRepository.save(reserva);
    }

    private Projeto projeto(String nome, Usuario tutor, Sala sala, boolean aprovado) {
        Projeto projeto = new Projeto();
        projeto.setNome(nome);
        projeto.setDescricao("Projeto de teste");
        projeto.setCategoria(CategoriaProj.ENSINO);
        projeto.setTutor(tutor);
        projeto.setSalaExclusiva(sala);
        projeto.setAprovado(aprovado);
        return projetoRepository.save(projeto);
    }

    private MembroProjeto membro(Projeto projeto, Usuario usuario, boolean gestor) {
        MembroProjeto membro = new MembroProjeto();
        membro.setProjeto(projeto);
        membro.setUsuario(usuario);
        membro.setGestor(gestor);
        membro.setDataIngresso(LocalDate.now());
        return membroRepository.save(membro);
    }

    private Disponibilidade disponibilidade(Projeto projeto, Usuario usuario, DiaSemana dia, String inicio, String fim) {
        Disponibilidade disponibilidade = new Disponibilidade();
        disponibilidade.setProjeto(projeto);
        disponibilidade.setUsuario(usuario);
        disponibilidade.setDiaSemana(dia);
        disponibilidade.setHoraInicio(LocalTime.parse(inicio));
        disponibilidade.setHoraFim(LocalTime.parse(fim));
        return disponibilidadeRepository.save(disponibilidade);
    }

    private record LoginPayload(String email, String senha) {
    }

    private record ReservaPayload(
        Long idSala,
        String titulo,
        String descricao,
        Visibilidade visibilidade,
        LocalDateTime dataInicio,
        LocalDateTime dataFim,
        boolean recorrente
    ) {
    }
}
