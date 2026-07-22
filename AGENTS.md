<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Purpose

This file gives brief, actionable guidance for AI coding agents working in this repository: where to find the code, how to run it, and project-specific conventions that are hard to infer automatically.

## Quick Run / Dev Commands

- `npm run dev` — start Next.js dev server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run test` — run unit tests (Vitest)
- `npm run lint` — run ESLint

See `package.json` for exact scripts and versions.

## Key Files & Where to Look

- App router and pages: `app/` (Next.js app router entry)
- Layout and globals: `app/layout.tsx`, `app/globals.css`
- UI components: `components/` (Navbar, feed, map, search, ui primitives)
- Supabase integration: `lib/supabase.ts`, `utils/supabase/client.ts`, `utils/supabase/server.ts`
- Tests: `test/` (uses Vitest)
- Project README and config: `README.md`, `next.config.ts`, `tsconfig.json`, `package.json`

## Conventions & Notes

- Uses Next.js (app router). Prefer adding routes under `app/` and React Server Components where appropriate.
- TypeScript first: keep types in sync when editing components or API helpers.
- Supabase client is centralized in `lib/supabase.ts`; follow existing patterns for server vs client helpers in `utils/supabase/`.
- Styling uses Tailwind and global CSS in `app/globals.css`.
- Tests run with Vitest; prefer small, focused tests for components and utilities.

## When You Need More

- Link to docs rather than copy: cite `README.md` or other docs in the repo.
- Suggest creating focused agent prompts for repetitive tasks (e.g., "update supabase usage", "add route + tests").

---
_Generated/maintained for AI agents — keep short and link-first._
