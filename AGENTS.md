<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.3) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Klíčové (potvrzeno v projektu):
- App Router only (`src/app/`)
- Server Components default; pro hooks/state přidat `"use client"`
- Turbopack je default bundler
- React 19.2 (využívej Actions, `use`, `useFormStatus`)
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:styling-rules -->
# Visual styles + Theme

Projekt má **dvě nezávislé osy**:

1. **Visual style** (10 variant) — `src/components/shared/style-switcher.tsx`
   - IDs: `classic | gradient | glass | dark | neon | aurora | warm | ocean | minimal | brutalist`
   - API: `<VisualStyleProvider>`, `<StyleSwitcherBar />`, `const { style, setStyle } = useVisualStyle()`
   - Persistence: `localStorage["ff-visual-style"]`
   - Komponenty co se podle stylu mění: `StyledHero`, `StyledSections` (`src/components/shared/styled-*.tsx`)

2. **Light/dark theme** — `src/components/shared/theme-switcher.tsx`
   - Toggle přes class `dark` na `<html>` (Tailwind `@custom-variant dark`)

Při tvorbě nových sekcí/stránek v marketingu i v admin/portal:
- Pokud má reagovat na visual style → použij `useVisualStyle()` a větvi přes `style`
- Tokeny barev ber přes shadcn proměnné (`bg-background`, `text-foreground`, `bg-card`, `border-border`, …) — ne hardcoded `bg-slate-900`
<!-- END:styling-rules -->

<!-- BEGIN:deployment-rules -->
# Deployment

Uživatel může říct "nasaď na dev" nebo "nasaď na prod". Reaguj takto:

## "Nasaď na dev" / "spusť lokálně" / "dev"
1. `cd` do tohoto projektu
2. `npm install` (pokud chybí node_modules)
3. `npm run dev`
4. Ověř health: `curl http://localhost:3000/api/health`
5. Alternativa Docker: `cd /Users/tm/workspaces/infra && docker compose up fedicfinance-dev`

## "Nasaď na prod" / "deploy" / "prod"
1. Ověř, že build projde: `npm run build`
2. Ověř, že existuje GitHub repo a jsou nastavené secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)
3. Ověř, že Vercel Environment Variables obsahují: `FLEXI_URL`, `FLEXI_USERNAME`, `FLEXI_PASSWORD`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
4. `git add -A && git commit -m "deploy: <popis změn>" && git push origin main`
5. CI/CD pipeline se spustí automaticky (GitHub Actions → Vercel)
6. Po deployi ověř healthcheck na produkční URL

Alternativa bez Gitu: `vercel --prod` z rootu (projekt už linknutý na `qa-waves-projects/fedic`).

## Infrastruktura
- Lokální: Docker Compose (`/Users/tm/workspaces/infra/docker-compose.yml`), port 3040 (prod) / 3041 (dev)
- Online: Vercel, region `fra1` (Frankfurt), projekt `fedic`
- CI/CD: `.github/workflows/ci.yml` + `cd.yml`
<!-- END:deployment-rules -->

<!-- BEGIN:project-conventions -->
# Konvence

- **Path alias**: `@/*` → `src/*`
- **Auth**: NextAuth v5 beta, `src/auth.ts` exportuje `auth`, `signIn`, `signOut`, `handlers`. Server components: `await auth()`. Client: `useSession()` z `next-auth/react`.
- **Abra Flexi**: nikdy nevolat napřímo z klienta. Vždy přes proxy `api/flexi/[...path]` — server přidá Basic Auth z env vars.
- **Cache**: `/api/*` má v `vercel.json` `Cache-Control: no-store`. Pokud chceš ISR/cache, musí to být mimo `/api/*`.
- **Czech UI**: stringy v UI píšeme česky (faktury, pokladna, dashboard, …).
- **Demo data**: `src/lib/mock-data.ts` — používat když env vars pro Flexi nejsou.
<!-- END:project-conventions -->
