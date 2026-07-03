# ApplicationHQ

ApplicationHQ is a platform that helps users track their job applications.

This repository contains a full-stack monorepo with a Next.js frontend and a
Spring Boot backend. The backend currently exposes Applications CRUD APIs backed
by PostgreSQL.

## Tech Stack

**Frontend** (`frontend/`)

- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend** (`backend/`)

- Spring Boot
- Java 21
- Maven (via the bundled Maven Wrapper)
- PostgreSQL
- Spring Data JPA

## Repository Structure

```
ApplicationHQ/
├── frontend/   # Next.js + TypeScript + Tailwind app
├── backend/    # Spring Boot (Java 21) app
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 18+ (developed with 22) and npm
- Java 21 (JDK)
- PostgreSQL running locally

A global Maven install is **not** required — the backend ships with the Maven
Wrapper (`mvnw` / `mvnw.cmd`).

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:3000.

### Backend

Create the local PostgreSQL database and user expected by the safe defaults:

```sql
CREATE USER applicationhq WITH PASSWORD 'applicationhq';
CREATE DATABASE applicationhq OWNER applicationhq;
GRANT ALL PRIVILEGES ON DATABASE applicationhq TO applicationhq;
```

The backend reads database settings from environment variables with local
defaults:

| Environment variable | Default |
| --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/applicationhq` |
| `DB_USERNAME` | `applicationhq` |
| `DB_PASSWORD` | `applicationhq` |

macOS / Linux:

```bash
cd backend
export DB_URL=jdbc:postgresql://localhost:5432/applicationhq
export DB_USERNAME=applicationhq
export DB_PASSWORD=applicationhq
./mvnw spring-boot:run
```

Windows (PowerShell / CMD):

```bash
cd backend
$env:DB_URL = "jdbc:postgresql://localhost:5432/applicationhq"
$env:DB_USERNAME = "applicationhq"
$env:DB_PASSWORD = "applicationhq"
.\mvnw.cmd spring-boot:run
```

The API runs at http://localhost:8080. A sample health endpoint is available at
http://localhost:8080/api/health and returns:

```json
{ "status": "UP" }
```

### Applications API

Applications have the following fields:

- `id`
- `company` (required)
- `role` (required)
- `status` (required: `SAVED`, `APPLIED`, `OA`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`)
- `dateApplied`
- `source`
- `notes` (max 2000 characters)
- `createdAt`
- `updatedAt`

Available endpoints:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/applications` | List applications |
| `GET` | `/api/applications/{id}` | Get one application |
| `POST` | `/api/applications` | Create an application |
| `PUT` | `/api/applications/{id}` | Update an application |
| `DELETE` | `/api/applications/{id}` | Delete an application |

JPA creates/updates the `applications` table automatically during local
development.

## Not Included Yet

The following are intentionally out of scope for now:

- OpenAI / AI integrations
- Email parsing
- Docker
- Deployment configuration
- Backend user ownership for applications
