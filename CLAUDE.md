# CLAUDE.md

Guidance for Claude Code in `calico.frontend`: the Calico web panel (admin, fleet, tenant
themes). It runs in the browser and talks only to Calico Cloud, never to a box directly.

## MVP Stage

Ship working functionality over polish: cover the critical path with tests, don't build
abstractions for requirements that don't exist yet, file gaps in Linear.

**Status:** skeleton only. Vite + React + TypeScript, React Router, the Calico design system
wired in (tokens, fonts, icons, light/dark/system theme picker), and a sidebar with three
sections (Evler, Filo, Temalar) that are placeholders until the cloud services exist: identity
(KED-275), home registry (KED-276), fleet (KED-280, KED-281). No API client, no sign-in yet.

## Essential Docs

- **Architecture (what is built):** `.ai/ARCHITECTURE.md`
- Cross-repo map and plan: `calico.root/docs/service-map.md`,
  `calico.root/docs/plans/hibrit-mimari-plani.md`. Contracts the panel will use go in
  `calico.root/docs/contracts/` first.

## Open Work

Tracked in **Linear** — team Kedy Tech, project
[Calico Smart Homes – Hibrit Mimari](https://linear.app/kedy-tech/project/calico-smart-homes-hibrit-mimari-32dd1648a46d).
No `TASKS.md`.

## Commands

`@harunmarangoz/calico-design` (design tokens and icons, repo `calico.design`) is a private
package on GitHub Packages; `.npmrc` reads `NPM_TOKEN`. Locally: a GitHub token with
`read:packages` in `NPM_TOKEN`. CI uses the workflow's `GITHUB_TOKEN` (the package must grant
this repository read access).

```sh
npm ci              # install (needs NPM_TOKEN)
npm run dev         # http://localhost:5173
npm run lint        # oxlint
npm run typecheck   # tsc -b
npm test            # vitest
npm run build       # typecheck + production build into dist/
npm run format      # Prettier (CI runs prettier --check)

# Production image (Nginx serving dist/): the token reaches npm ci only, as a build secret
docker build --secret id=npm_token,env=NPM_TOKEN -t calico-web .
```

**Deploying:** `.github/workflows/image.yml` publishes `ghcr.io/harunmarangoz/calico-web`
(`:sha-<commit>` from main, `:<version>` from a `v<version>` tag). The stack that runs it —
local, staging, prod, Cloudflare Tunnel — is `calico.root/deploy` (README there); the panel
reaches the Cloud API at `/api` on its own origin through that stack's gateway. With the local
stack up, `npm run dev` proxies `/api` to it (`CALICO_API_URL`, default `http://localhost:8000`).

## Layout

```
src/main.tsx        # imports the package's fonts.css + tokens.css, applies the stored theme, router
src/routes.tsx      # route table (Layout + pages); tests render it with createMemoryRouter
src/ui/             # Layout (sidebar + page), Icon, theme choice (data-theme + localStorage)
src/pages/          # one component per section
src/i18n/strings.ts # every user-facing string (Turkish)
src/app.css         # layout only, all values are token variables
nginx/              # the image's server config: SPA fallback, caching, security headers (CSP)
```

## Rules

- Every color, spacing, radius, size and text style comes from the design package: CSS
  variables (`var(--surface)`, `var(--space-4)`, `var(--radius-lg)`) and the type classes
  (`.title-md`, `.body`, `.caption`). No hex values, pixel sizes outside layout widths, or
  font declarations in `src/`. Read each token's `usage` note (the package's `tokens.json`)
  before picking one; e.g. text on `--calico-orange` is `--on-orange`, orange text is
  `--calico-orange-text`, the sidebar is `--surface-sunken`. Token changes happen in
  `calico.design`, then `npm update @harunmarangoz/calico-design` here.
- Theme: `tokens.css` follows the OS until `<html data-theme>` is set; only `src/ui/theme.ts`
  touches that attribute.
- The CSP (`nginx/security-headers.conf`) allows scripts and connections to the panel's own
  origin only, styles and fonts from Google Fonts besides. A new external origin (an API host, a
  CDN, analytics) needs a CSP change in the same commit, checked in a browser.
- Every user-facing string lives in `src/i18n/strings.ts`. Never "Home Assistant" (or its
  logo): `strings.test.ts` guards it.
- Tests: Vitest + Testing Library, colocated `*.test.ts(x)`; query by role and label.
- Conventional Commits mentioning the Linear issue.

## Definition of Done

- [ ] `npx prettier --check .`, `npm run lint`, `npm test` and `npm run build` pass (CI runs all four)
- [ ] Works in light and dark theme and at phone width
- [ ] New strings in `strings.ts`, nothing branded "Home Assistant"
- [ ] Linear issue updated, including known gaps
