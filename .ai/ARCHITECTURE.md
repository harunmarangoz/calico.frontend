# Architecture — calico.frontend

What is built today: the frame of the Calico web panel. The panel is cloud-only (it will call
Calico Cloud's API behind Cloudflare + Nginx) and never reaches a box directly.

## Stack

| Piece         | Choice                                              | Why                                                                                        |
| ------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Build         | Vite 8, TypeScript 7                                | Static SPA: `dist/` is plain files Nginx can serve, no Node server to run                  |
| UI            | React 19                                            | Same library as the mobile app                                                             |
| Routing       | React Router 8 (data router, `createBrowserRouter`) | Nested layout with an `Outlet`; a memory router in tests                                   |
| Design        | `@harunmarangoz/calico-design` (GitHub Packages)    | `tokens.css` (variables, light/dark, type classes), `fonts.css` (Google Fonts), icon paths |
| Lint / format | oxlint, Prettier                                    | The Vite template's linter; one style checked in CI                                        |
| Tests         | Vitest + jsdom + Testing Library                    | Runs on the Vite config                                                                    |

## Structure

- `main.tsx` imports the package's `fonts.css` and `tokens.css`, applies the stored theme before
  the first render (no light flash for a dark choice), and mounts the router.
- `routes.tsx`: `Layout` with `/homes`, `/fleet`, `/themes` and a catch-all not-found page; `/`
  redirects to `/homes`.
- `Layout`: sidebar on `--surface-sunken` with the brand, the section links (active link on
  `--calico-orange-soft`), and the theme picker (system / light / dark, stored in
  `localStorage` under `calico.theme`, applied as `<html data-theme>`). Below 720px the
  sidebar stacks above the page.

## Deployment

- **Image** (`Dockerfile`): `npm ci` + `npm run build` on the build platform (the output is
  static, so the arm64 image needs no emulation), then `nginxinc/nginx-unprivileged` serving
  `dist/` on 8080 as a non-root user. The design package token is a BuildKit secret: it never
  lands in a layer. A `/healthz` endpoint backs the image's `HEALTHCHECK`.
- **Nginx** (`nginx/`): every unknown path → `index.html` (client routes like `/fleet`),
  `/assets/*` cached for a year (content-hashed names), `index.html` never cached, and on every
  response a CSP (`'self'` plus Google Fonts), `X-Frame-Options: DENY`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`. HSTS and compression to the browser are Cloudflare's.
- **Publishing** (`.github/workflows/image.yml`): `ghcr.io/harunmarangoz/calico-web` for amd64
  and arm64; `:main` and `:sha-<commit>` on main, `:<version>` on a `v<version>` tag; pull
  requests build without publishing.
- **Running it:** `calico.root/deploy`. A gateway in front routes `/api/` to the Cloud API and
  everything else here, so the panel calls its API on the same origin (no CORS, `connect-src
'self'`). Cloudflare Tunnel reaches the gateway on staging and prod.

## Known gaps

- The three sections are placeholders: no cloud API, no sign-in (KED-275), no data.
- Fonts load from Google Fonts at runtime (`fonts.css`); self-hosting is a later choice.
