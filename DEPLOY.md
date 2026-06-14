# SL Accounting MCQ - Deployment Runbook

## 1) Tech Stack
- **Framework**: Next.js 15 (App Router, standalone output)
- **UI**: shadcn/ui (New York style) + Tailwind CSS
- **State**: Zustand (client-side quiz state)
- **Database**: PostgreSQL 16 (Alpine) via Prisma ORM
- **Container**: Docker + docker-compose
- **Registry**: GitHub Container Registry (ghcr.io)
- **Tunnel**: Cloudflare Tunnel (cloudflared)
- **Deploy**: Portainer stack on VPS

## 2) Local Development
```bash
npm install
cp .env.example .env.local
# Edit .env.local with local DB credentials
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## 3) GitHub Build and Image Publish
Workflow: `.github/workflows/docker.yml`

On push to `master`, GitHub builds and pushes:
- `ghcr.io/dinu-sri/mcq-accounting-app:latest`
- `ghcr.io/dinu-sri/mcq-accounting:latest`
- `ghcr.io/dinu-sri/mcq-accounting:<commit-sha>`

Portainer should use: `ghcr.io/dinu-sri/mcq-accounting-app:latest`

## 4) Portainer Stack Setup

### Stack Name: `mcq-accounting`

### Compose Source: `docker-compose.yml` (this repo)

### Environment Variables (set in Portainer):

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_PASSWORD` | YES | Long URL-safe password for Postgres |
| `CF_TUNNEL_TOKEN` | YES | Cloudflare Tunnel token |
| `NEXT_PUBLIC_BASE_URL` | YES | Public URL (e.g., https://mcq.clossyan.com) |
| `APP_URL` | YES | Same as NEXT_PUBLIC_BASE_URL |

**IMPORTANT**: In Portainer, paste raw values only. Do NOT wrap values in quotes.

### Containers Created:
| Container | Image | Port |
|---|---|---|
| `mcq-accounting-app` | `ghcr.io/dinu-sri/mcq-accounting-app:latest` | 3003:3000 |
| `mcq-accounting-db` | `postgres:16-alpine` | (internal) |
| `mcq-accounting-tunnel` | `cloudflare/cloudflared:latest` | (internal) |

### Volume: `mcq-accounting-postgres`

## 5) GitHub Repository Setup

1. Create a NEW public repo: `github.com/dinu-sri/mcq-accounting`
2. Push this code to `master`
3. Ensure GitHub Actions has permission to write packages:
   - Repo Settings → Actions → General → Workflow permissions → Read and write permissions
4. If image pull fails in Portainer:
   - Either make the GHCR package public (Settings → Packages → Package visibility)
   - OR add GHCR credentials to Portainer (Registries → Add registry → GitHub)

## 6) Cloudflare Tunnel

Create a new tunnel for the MCQ app domain (e.g., `mcq.clossyan.com`):
```bash
cloudflared tunnel create mcq-accounting
cloudflared tunnel route dns mcq-accounting mcq.clossyan.com
```

Use the tunnel token as `CF_TUNNEL_TOKEN` in Portainer.

## 7) Post-Deploy Smoke Checks
1. App opens at production URL
2. Paper selection page loads
3. Click a paper → quiz starts with timer
4. Answer questions, finish → result shows
5. Review answers shows correct/wrong with explanations

## 8) Ports Used
- App: `3003` (avoiding conflict with existing: team-tasks=3002, aurello=3001, etc.)
- Postgres: internal only (via Docker network)
