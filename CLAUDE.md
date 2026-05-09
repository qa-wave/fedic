@AGENTS.md

# Fedic Finance App

Účetní portál pro Fedic Finance Group nad Abra Flexi REST API. Veřejný marketing web + interní účetní dashboard + klientský portál v jedné Next.js aplikaci.

> Pozn.: balíček v `package.json` se jmenuje `fedic`, ale složka projektu je zatím `fedicfinance-app/` (rename na `fedic/` plánovaný, nedokončený). GitHub repo: `qa-wave/fedic`. Vercel projekt: `fedic` (ID `prj_ZQBZUybTrtQ0IyahkoJFH4wp3qYV`, scope `qa-waves-projects`).

## Pracovní styl

Při plnění úkolů postupuj přímo k řešení. Pokud potřebuješ použít nástroj, analyzovat data nebo provést výpočet, udělej to rovnou. Neptej se mě na povolení, pokud to není kriticky nutné pro bezpečnost.

## Tech Stack
- **Next.js 16.2.3** (App Router, Turbopack) + **React 19.2** + **TypeScript 5**
- **Tailwind CSS 4** (`@tailwindcss/postcss`) + **shadcn/ui v4** (jako npm balíček, ne jen CLI) + `tw-animate-css`
- **NextAuth.js v5** (beta, credentials provider) — `src/auth.ts` + `api/auth/[...nextauth]`
- **Abra Flexi REST API** přes proxy `api/flexi/[...path]` (Basic Auth)
- **Zustand** (klient state), **@tanstack/react-table**, **Recharts**, **Framer Motion 12**
- **Base UI** (`@base-ui/react`), **Lucide** ikony

## Struktura

### App Router (`src/app/`)
- `page.tsx` + `layout.tsx` — Veřejný marketing web s 10 visual styly
- `(auth)/login/page.tsx` — Přihlášení
- `(dashboard)/layout.tsx` — Sidebar layout pro účetní
  - `dashboard/page.tsx` — Přehled / KPI
  - `faktury-prijate/page.tsx` — Přijaté faktury
  - `pokladna/page.tsx` — Pokladna
- `(portal)/layout.tsx` — Top-nav layout pro klienty
  - `portal/page.tsx` — Klientský portál
- `api/auth/[...nextauth]/route.ts` — NextAuth handler
- `api/flexi/[...path]/route.ts` — Proxy k Abra Flexi (přidává Basic Auth, no-store cache headers)
- `api/health/route.ts` — Healthcheck

### Komponenty (`src/components/`)
- `ui/` — shadcn primitivy (button, card, dialog, dropdown-menu, table, tabs, sheet, …)
- `dashboard/sidebar.tsx` — Navigace pro účetní layout
- `shared/` — sdílené:
  - **`style-switcher.tsx`** — `VisualStyleProvider`, `StyleSwitcherBar`, `useVisualStyle` (10 stylů: `classic`, `gradient`, `glass`, `dark`, `neon`, `aurora`, `warm`, `ocean`, `minimal`, `brutalist`); ukládá do `localStorage` jako `ff-visual-style`
  - **`theme-switcher.tsx`** — Light/dark toggle (nezávislý na visual style)
  - `styled-hero.tsx`, `styled-sections.tsx` — Komponenty respektující aktivní visual style
  - `hero-banner.tsx`, `kpi-card.tsx`, `data-table.tsx`, `chat-widget.tsx`, `animations.tsx`

### Lib (`src/lib/`)
- `flexi-client.ts` + `flexi-types.ts` — Klient pro Abra Flexi
- `auth.ts` — NextAuth helper (re-export z `src/auth.ts`)
- `mock-data.ts` — Demo data
- `utils.ts` — `cn()` pro Tailwind merge

### Styling
- `src/app/globals.css` — Importuje `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`; definuje CSS proměnné pro `--color-*` mapované na shadcn tokeny + sidebar tokeny + chart colors
- Dark mode přes `@custom-variant dark (&:is(.dark *))`

## Nasazení

### "Nasaď na dev" (localhost)
```bash
# Varianta 1: npm
cd /Users/tm/workspaces/projects/fedicfinance-app && npm run dev

# Varianta 2: Docker (z workspace root)
cd /Users/tm/workspaces/infra && docker compose up fedicfinance-dev
```
- Dev na npm: http://localhost:3000
- Dev na Docker: http://localhost:3041
- Prod Docker: `docker compose up fedicfinance` → http://localhost:3040

### "Nasaď na prod" (Vercel)
1. `git push origin main` — CI pipeline (`.github/workflows/ci.yml`) se spustí
2. Po CI se CD pipeline (`.github/workflows/cd.yml`) deployne na Vercel (region `fra1`)
3. **GitHub Secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID` (= `team_uVlMvMQ4WwYeNbcPHUkQb9vc`), `VERCEL_PROJECT_ID` (= `prj_ZQBZUybTrtQ0IyahkoJFH4wp3qYV`)
4. **Vercel Environment Variables**: `FLEXI_URL`, `FLEXI_USERNAME`, `FLEXI_PASSWORD`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

Alternativa bez CI: `vercel --prod` z rootu projektu (`.vercel/` už linkovaný na `fedic`).

### Demo přihlášení
- Účetní: `admin` / `FedicAdmin2024!`
- Klient: `klient` / `FedicKlient2024!`

## Infrastruktura
- **Dockerfile**: multi-stage (deps → builder → runner), Node 22 Alpine, non-root user
- **Docker Compose**: `/Users/tm/workspaces/infra/docker-compose.yml` — služby `fedicfinance` (port 3040, prod) + `fedicfinance-dev` (port 3041)
- **CI/CD**: `.github/workflows/ci.yml` (lint → typecheck → build → docker) + `cd.yml` (Vercel deploy)
- **Vercel config**: `vercel.json` — region `fra1`, security headers (CSP-lite, no-store na `/api/*`)
- **Health endpoint**: `GET /api/health`

## Konvence
- Cesty: `@/*` mapuje na `src/*` (viz `tsconfig.json`)
- Komponenty co používají hooks/state → `"use client"` na řádku 1
- Visual style respektovat přes `useVisualStyle()` (čte z kontextu, ne z localStorage přímo)
- Všechny `/api/*` endpointy mají automaticky `Cache-Control: no-store` z `vercel.json`
- Při přidávání shadcn komponenty: `npx shadcn@latest add <component>` (zapisuje do `src/components/ui/`)
