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

Not set up yet. `npm run build` produces a static `dist/`; serving it needs an SPA fallback
(every unknown path → `index.html`) so deep links like `/fleet` work.

## Known gaps

- The three sections are placeholders: no cloud API, no sign-in (KED-275), no data.
- Fonts load from Google Fonts at runtime (`fonts.css`); self-hosting is a later choice.
- No deployment (Dockerfile / Nginx config) yet.
