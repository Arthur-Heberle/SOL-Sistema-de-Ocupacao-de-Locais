# SOL - Sistema de Ocupacao de Locais

Room management and reservation system for **UTFPR Campus Curitiba Sede Centro**.

The project contains a React frontend and a Spring Boot backend API for users, rooms, reservations, projects, disciplines, project members and availability intersections.

## Project Structure

```text
project/
  frontend/     React 18 + TypeScript + Vite
  backend/      Java 17 + Spring Boot 3 + Maven
  PlanodoProjeto.md
  AGENTS.md
  CLAUDE.md
  README.md
```

## Backend Stack

- Java 17
- Spring Boot 3.5
- Maven
- Spring Web, Spring Data JPA, Spring Security
- JWT authentication with BCrypt password hashes
- Flyway migrations
- PostgreSQL for development/runtime
- H2 for tests

## Backend Environment

Defaults are defined in `backend/src/main/resources/application.yml`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/sol` | PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `sol` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `sol` | Database password |
| `SERVER_PORT` | `8080` | Backend HTTP port |
| `SOL_JWT_SECRET` | development-only secret | JWT HMAC secret, use a strong value in real environments |
| `SOL_JWT_EXPIRATION_MINUTES` | `120` | Token lifetime |
| `SOL_CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated frontend origins |

## Run PostgreSQL Locally

Example with Docker:

```bash
docker run --name sol-postgres \
  -e POSTGRES_DB=sol \
  -e POSTGRES_USER=sol \
  -e POSTGRES_PASSWORD=sol \
  -p 5432:5432 \
  -d postgres:16
```

## Backend Commands

```bash
cd backend
mvn test
mvn package
mvn spring-boot:run
```

The API starts at `http://localhost:8080`. Flyway applies `V1__create_schema.sql` and `V2__seed_dev_data.sql` automatically when the backend starts against PostgreSQL.

## Frontend Commands

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Seed Users

All seeded users use password `123456`.

| Role | Email |
| --- | --- |
| GESTOR | `gestor@utfpr.edu.br` |
| PROFESSOR | `ana@utfpr.edu.br` |
| TUTOR | `carlos@utfpr.edu.br` |
| ALUNO | `maria@utfpr.edu.br` |

## API Examples

Login:

```bash
curl -s http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"gestor@utfpr.edu.br","senha":"123456"}'
```

Use the returned token:

```bash
TOKEN='<jwt>'
curl -s http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

List rooms:

```bash
curl -s http://localhost:8080/api/salas \
  -H "Authorization: Bearer $TOKEN"
```

Create a one-off reservation, auto-approved when no conflict exists:

```bash
curl -s http://localhost:8080/api/reservas \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "idSala": 1,
    "titulo": "Aula pontual",
    "visibilidade": "PUBLICA",
    "dataInicio": "2026-08-03T08:00:00",
    "dataFim": "2026-08-03T10:00:00",
    "recorrente": false
  }'
```

Create a recurring reservation, initially pending:

```bash
curl -s http://localhost:8080/api/reservas \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "idSala": 1,
    "titulo": "Aula semestral",
    "visibilidade": "PUBLICA",
    "dataInicio": "2026-08-03T08:00:00",
    "dataFim": "2026-12-14T10:00:00",
    "recorrente": true
  }'
```

Approve a pending reservation as GESTOR:

```bash
curl -X PATCH -s http://localhost:8080/api/reservas/2/aprovar \
  -H "Authorization: Bearer $TOKEN"
```

Get project availability intersection:

```bash
curl -s http://localhost:8080/api/projetos/1/disponibilidades/intersecao \
  -H "Authorization: Bearer $TOKEN"
```

## Documentation

Canonical local specification: `PlanodoProjeto.md`.

The original PDF specification is referenced as `../Documentation/PlanodoProjeto.pdf` when available and covers requirements, use cases, class diagrams, data dictionary and sequence diagrams.

## Team

Arthur G. P. Heberle, Luiz Henrique de Souza Correia, Rafael de Andrade Fernandes, Vinicius Romualdo Silva - UTFPR 2026
