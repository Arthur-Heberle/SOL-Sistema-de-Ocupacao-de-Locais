CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE salas (
    id BIGSERIAL PRIMARY KEY,
    bloco VARCHAR(10) NOT NULL,
    codigo_nome VARCHAR(20) NOT NULL UNIQUE,
    tipo_sala VARCHAR(20) NOT NULL,
    capacidade INTEGER NOT NULL,
    possui_projetor BOOLEAN NOT NULL DEFAULT FALSE,
    permite_reserva BOOLEAN NOT NULL DEFAULT TRUE,
    descricao VARCHAR(500),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE disciplinas (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    nome VARCHAR(80) NOT NULL,
    professor_id BIGINT NOT NULL REFERENCES usuarios(id),
    semestre VARCHAR(6) NOT NULL,
    carga_horaria INTEGER NOT NULL,
    turma VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE projetos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    descricao VARCHAR(1500) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    tutor_id BIGINT NOT NULL REFERENCES usuarios(id),
    sala_exclusiva_id BIGINT REFERENCES salas(id),
    aprovado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE membros_projeto (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    projeto_id BIGINT NOT NULL REFERENCES projetos(id),
    data_ingresso DATE NOT NULL,
    is_gestor BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_membro_projeto_usuario UNIQUE (usuario_id, projeto_id)
);

CREATE TABLE reservas (
    id BIGSERIAL PRIMARY KEY,
    sala_id BIGINT NOT NULL REFERENCES salas(id),
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    projeto_id BIGINT REFERENCES projetos(id),
    disciplina_id BIGINT REFERENCES disciplinas(id),
    titulo VARCHAR(80) NOT NULL,
    descricao VARCHAR(500),
    visibilidade VARCHAR(20) NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    recorrente BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE disponibilidades (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    projeto_id BIGINT NOT NULL REFERENCES projetos(id),
    dia_semana VARCHAR(10) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_reservas_sala_status_periodo ON reservas (sala_id, status, data_inicio, data_fim);
CREATE INDEX idx_reservas_usuario ON reservas (usuario_id);
CREATE INDEX idx_reservas_projeto ON reservas (projeto_id);
CREATE INDEX idx_disciplinas_professor_semestre ON disciplinas (professor_id, semestre);
CREATE INDEX idx_disponibilidades_projeto_usuario ON disponibilidades (projeto_id, usuario_id);
