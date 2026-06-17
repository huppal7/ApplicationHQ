# ApplicationHQ

ApplicationHQ is a platform that helps users track their job applications.

This repository is currently at the **scaffolding stage**: it contains a
frontend and backend starter application wired up as a monorepo, with no
business logic implemented yet.

## Tech Stack

**Frontend** (`frontend/`)

- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend** (`backend/`)

- Spring Boot
- Java 21
- Maven (via the bundled Maven Wrapper)

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

macOS / Linux:

```bash
cd backend
./mvnw spring-boot:run
```

Windows (PowerShell / CMD):

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

The API runs at http://localhost:8080. A sample health endpoint is available at
http://localhost:8080/api/health and returns:

```json
{ "status": "UP" }
```

## Not Included Yet

The following are intentionally out of scope for this scaffold:

- Authentication
- Database
- OpenAI / AI integrations
- Email parsing
- Docker
- Deployment configuration
