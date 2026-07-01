# AGENTS.md

Event management app — event registration, QR check-in, attendance tracking, and event analytics powered by React, TanStack Query, and Firebase.

## Setup commands

- Install deps: `yarn install`
- Start dev:   `yarn dev`
- Build:       `yarn build`
- Deploy test: `yarn deploy:test`
- Deploy prod: `yarn deploy:prod`
- Lint:       `yarn lint`
- Typecheck:  `tsc --noEmit` (run via `yarn build:prod` which includes it)

## Project layout

- `src/`         — React app (components, routes, hooks, models, config)
- `base/`        — Shared backend/base layer
- `public/`      — Static assets
- `docker/`      — Docker configuration

## Code style

- TypeScript strict mode (`tsconfig.app.json` extends base)
- ESLint flat config (`eslint.config.js`) — TypeScript-ESLint + React Hooks + React Refresh
- `no-console`: warn; `no-unused-vars`: off (TypeScript version enforced with `_` prefix ignores)
- Run `yarn lint` before committing

## Testing instructions

- No unit test framework configured yet — add Vitest when writing new features
- Manual smoke test: `yarn build` must pass with zero errors

## PR & commit conventions

- Branch from `main`; never push to it directly
- Commit message: conventional commits (`feat:` / `fix:` / `docs:` / `refactor:`)
- Open PR once build and lint are clean

## Security

- Never commit secrets — `.env` files are gitignored; use `env-cmd` with `-f .env.*.local`
- Firebase credentials live only in environment files, never hardcoded
