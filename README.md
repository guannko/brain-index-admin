# Brain Index Platform

**Monorepo for Brain Index Admin Panel & Client Dashboard**

## 🏗️ Structure

```
brain-index-admin/
├── apps/
│   ├── backend/          # NestJS API (Auth, Bots, Clients, Heartbeat)
│   ├── admin-panel/      # React Admin UI (for Brain Index team)
│   └── client-dashboard/ # React Client Portal (for customers)
├── packages/
│   └── shared-types/     # Shared TypeScript interfaces
├── docker-compose.yml    # Local dev infrastructure
└── turbo.json            # TurboRepo config
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- Docker Desktop

### Setup

```bash
# Install dependencies
pnpm install

# Start databases (Postgres, MongoDB, Redis)
pnpm docker:up

# Start all apps in dev mode
pnpm dev
```

### Services

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:3000 | NestJS API |
| Admin Panel | http://localhost:5173 | React Admin |
| Client Dashboard | http://localhost:5174 | React Client |
| Mongo Express | http://localhost:8081 | MongoDB UI |

## 🔑 Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## 📦 Tech Stack

- **Backend:** NestJS, TypeScript, Prisma
- **Frontend:** React 18, Vite, Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL (core), MongoDB (logs), Redis (cache)
- **Monorepo:** TurboRepo, pnpm workspaces

## 🔗 Related

- [Brain Index Landing](https://brain-index.com)
- [n8n Instance](https://annoris.app.n8n.cloud)

---

**Brain Index** - AI Automation Agency  
Tallinn, Estonia
