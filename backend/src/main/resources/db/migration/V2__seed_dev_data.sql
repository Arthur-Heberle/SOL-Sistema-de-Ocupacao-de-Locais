INSERT INTO usuarios (id, nome, email, senha_hash, tipo_usuario, ativo, created_at, updated_at) VALUES
    (1, 'Admin Gestor', 'gestor@utfpr.edu.br', '$2b$10$iRNdbrITUlsfsykbNGac2ug/V/OVHpi1n6x8YtcEqsibBkLfHNURG', 'GESTOR', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Prof. Ana Silva', 'ana@utfpr.edu.br', '$2b$10$iRNdbrITUlsfsykbNGac2ug/V/OVHpi1n6x8YtcEqsibBkLfHNURG', 'PROFESSOR', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Carlos Tutor', 'carlos@utfpr.edu.br', '$2b$10$iRNdbrITUlsfsykbNGac2ug/V/OVHpi1n6x8YtcEqsibBkLfHNURG', 'TUTOR', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Maria Aluna', 'maria@utfpr.edu.br', '$2b$10$iRNdbrITUlsfsykbNGac2ug/V/OVHpi1n6x8YtcEqsibBkLfHNURG', 'ALUNO', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'Joao Aluno', 'joao@utfpr.edu.br', '$2b$10$iRNdbrITUlsfsykbNGac2ug/V/OVHpi1n6x8YtcEqsibBkLfHNURG', 'ALUNO', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO salas (id, bloco, codigo_nome, tipo_sala, capacidade, possui_projetor, permite_reserva, descricao, ativo, created_at, updated_at) VALUES
    (1, 'CB', 'CB-001', 'AULA', 40, TRUE, TRUE, NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'CB', 'CB-002', 'LABORATORIO', 30, TRUE, TRUE, NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'CB', 'CB-003', 'PROJETO', 10, FALSE, TRUE, 'Sala do PET Computacao', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'CB', 'CB-DEPT', 'DEPARTAMENTO', 5, FALSE, FALSE, 'Sala administrativa', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'DAELN', 'D-101', 'AULA', 35, TRUE, TRUE, NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 'DAELN', 'D-LAB', 'LABORATORIO', 20, TRUE, TRUE, NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO disciplinas (id, codigo, nome, professor_id, semestre, carga_horaria, turma, created_at, updated_at) VALUES
    (1, 'IF66D', 'Engenharia de Software', 2, '2026/1', 60, 'TB01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'IF65C', 'Calculo Numerico', 2, '2026/1', 60, 'TC02', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO projetos (id, nome, descricao, categoria, tutor_id, sala_exclusiva_id, aprovado, created_at, updated_at) VALUES
    (1, 'PET Computacao', 'Grupo PET do curso de Computacao', 'EXTENSAO', 3, 3, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'IC Redes Neurais', 'Pesquisa em aprendizado profundo', 'PESQUISA', 2, NULL, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO membros_projeto (id, usuario_id, projeto_id, data_ingresso, is_gestor, created_at, updated_at) VALUES
    (1, 3, 1, CURRENT_DATE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 4, 1, CURRENT_DATE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO reservas (id, sala_id, usuario_id, projeto_id, disciplina_id, titulo, descricao, visibilidade, data_inicio, data_fim, recorrente, status, created_at, updated_at) VALUES
    (1, 1, 2, NULL, 2, 'Aula de Calculo', NULL, 'PUBLICA', '2026-05-20 08:00:00', '2026-05-20 10:00:00', TRUE, 'APROVADA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 2, 3, NULL, NULL, 'Reuniao PET', NULL, 'PUBLICA', '2026-05-21 14:00:00', '2026-05-21 16:00:00', FALSE, 'PENDENTE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 3, 3, 1, NULL, 'Sprint do Projeto', NULL, 'PRIVADA', '2026-05-22 13:00:00', '2026-05-22 15:00:00', FALSE, 'APROVADA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO disponibilidades (id, usuario_id, projeto_id, dia_semana, hora_inicio, hora_fim, created_at, updated_at) VALUES
    (1, 3, 1, 'SEGUNDA', '14:00:00', '15:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 3, 1, 'SEGUNDA', '15:00:00', '16:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 3, 1, 'QUARTA', '08:00:00', '09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 3, 1, 'QUARTA', '09:00:00', '10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 3, 1, 'QUINTA', '14:00:00', '15:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 4, 1, 'SEGUNDA', '14:00:00', '15:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, 4, 1, 'SEGUNDA', '15:00:00', '16:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8, 4, 1, 'TERCA', '10:00:00', '11:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9, 4, 1, 'QUARTA', '09:00:00', '10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 4, 1, 'SEXTA', '08:00:00', '09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('usuarios_id_seq', 5, true);
SELECT setval('salas_id_seq', 6, true);
SELECT setval('disciplinas_id_seq', 2, true);
SELECT setval('projetos_id_seq', 2, true);
SELECT setval('membros_projeto_id_seq', 2, true);
SELECT setval('reservas_id_seq', 3, true);
SELECT setval('disponibilidades_id_seq', 10, true);
