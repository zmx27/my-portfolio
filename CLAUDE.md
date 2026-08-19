# CLAUDE.md

Guidance for working in this repo: Zhi Ming Xu's portfolio site (Astro + Tailwind CSS v4, deployed to GitHub Pages at `zmx27.github.io/my-portfolio/`).

## Stack

- Astro (static output), Tailwind v4 via `@tailwindcss/vite`, TypeScript.
- `npm run dev` / `npm run build` / `npm run preview` / `npm run check` (typecheck).
- Deploys via `.github/workflows/deploy.yml` on push to `main`. Site has a base path (`/my-portfolio/`), so internal links must go through `import.meta.env.BASE_URL`, not hardcoded `/`.

## Adding a New Project

Everything lives in one typed array: `src/data/projects.ts`. Adding an entry there is enough, no new route file needed, the homepage grid and the detail page at `/projects/{slug}/` are both generated automatically from `src/pages/projects/[slug].astro`'s `getStaticPaths()`.

1. **Research first, from the real source.** Use `gh` CLI to pull the actual repo (README, source files, commit history). Never invent or exaggerate a feature, tech detail, or number that isn't traceable back to the repo, a resume, or something the user directly provided. If a fact can't be verified, ask rather than guess.
2. **Fill in the `Project` fields**: `slug`, `title`, `tagline`, `category` (`"embedded"` or `"software"`), `overview`, 3 `bullets`, `tags`, `sourceUrl`/`sourceLabel`, `image`, `video?`, `codeSnippet?`.
3. **Images**: `public/images/{slug}.{ext}`. Use a real photo or screenshot only. If nothing exists yet, don't generate placeholder art, either ask the user for one or, if a demo video already exists, extract a real poster frame from it (`qlmanage -t` or `avconvert` work fine locally, no `ffmpeg` on this machine).
4. **Video**: `public/videos/{slug}.mp4`, matching the card's hover-preview and the detail page's embed.
5. **Code snippets**: pull a short, real excerpt directly from the repo via `gh api`, never write pseudocode or paraphrase it. Keep it short and trim with a `// ...` marker if needed. The `codeSnippet.filename` field is the one place a specific filename belongs, don't put filenames or variable names in `overview`/`bullets`, keep those at a plain-English, high-level description of what the thing does.
6. **Diagrams are optional**, add one only if it clarifies something real (an architecture, a signal path, a control mapping) that prose alone doesn't. Build it as a new file in `src/components/diagrams/`, then register it in the `diagrams` record inside `src/pages/projects/[slug].astro`. Match the existing visual language (see Design System below) rather than introducing a new style. If a diagram shows a formula or a derived number, derive it step by step and verify it against the real source. Don't drop a formula on the page without explaining where it comes from.
7. **Tags**: 4-6 short, specific technologies, matching the density of existing projects' tags (e.g. `["C", "STM32 HAL", "Bare-metal", "I2C", "Timers"]`), not vague category words.
8. New project cards go wherever the user asks; there's no fixed ordering rule beyond "most impressive/recent first" as currently arranged.

## Writing Tone

This is the part most likely to drift if not enforced:

- **Casual and conversational.** Write like explaining the project to a person, not like a press release or a generated summary.
- **No em dashes, anywhere.** Restructure the sentence (split it, use a comma, use a colon) instead of reaching for one.
- **No uncommon or "AI-sounding" words.** Avoid: leverage, utilize, seamless, robust, cutting-edge, state-of-the-art, meticulous, delve, boast, showcase, comprehensive, elegant, powerful, and similar. If a word wouldn't come up in a normal conversation about the project, don't use it.
- **Prefer shorter sentences over dense, clause-stacked ones.** A sentence with two semicolons and a parenthetical is a sign to split it into two sentences.
- **No specific filenames or variable names in `overview`/`bullets`.** Say what a piece of code does, not what it's called. Exception: `codeSnippet.filename`.
- **Be honest about tradeoffs, not just wins.** If a fix has a real limitation (e.g. it also affects a case it wasn't meant to), say so, it reads as more credible, not less impressive.
- **Exception: the Experience section in `src/pages/index.astro`.** Those bullets intentionally keep a resume register (achievement-focused, metric-driven), that's the expected convention there and shouldn't be rewritten to be conversational.

## Design System

- Colors are CSS custom properties in `src/styles/global.css`: `--bg`, `--surface`, `--surface-raised`, `--text`, `--text-secondary`, `--accent`, `--indicator`, `--border`. Dark-first (`:root` defaults dark), light is an explicit `[data-theme="light"]` override. Any new color needs both a dark and a light value, and should pass WCAG AA contrast (check before locking it in, a couple of past additions failed contrast and had to be adjusted).
- `--accent` (teal) marks the "embedded" category and primary actions. `--indicator` (amber) marks the "software" category and secondary emphasis. Reuse this pairing instead of introducing a third color.
- Type: **Space Grotesk** for headings, **Inter** for body text, **IBM Plex Mono** for tags, labels, code, and anything number-like (dates, metrics use `tabular-nums`).
- Recurring motifs: the trace-line section dividers (`TraceDivider.astro`), the corner-bracket hover treatment on cards, the subtle grid-graticule background. New UI should reuse these rather than inventing a new decorative pattern.
- Diagrams are hand-authored inline SVG (no charting/diagram library), styled with the same CSS variables so they follow the active theme automatically. Keep them plain-English in their labels, no jargon or internal code identifiers.
- Motion is deliberate and minimal: a couple of one-time load-in animations, scroll reveals, hover states. Nothing looping or decorative for its own sake. Everything respects `prefers-reduced-motion` through the global rule in `global.css`, so new animations don't need their own guard.

## Verification

Before considering a change done:

1. `npm run check` (typecheck) and `npm run build` both clean.
2. Visually check the change in a real browser (Playwright + a headless Chromium works fine here since none is preinstalled), in both dark and light mode.
3. Run Lighthouse against the built/previewed site. This project has consistently scored ~96-100 across Performance/Accessibility/Best Practices/SEO, a change that drops that meaningfully should be investigated, not shipped as-is. Note: Lighthouse's default "simulate" throttling has been flaky/inaccurate in this environment before, prefer `--throttling-method=devtools` for a trustworthy read.
4. Check that new content doesn't reintroduce anything this file warns against (em dashes, filenames in prose, unverified claims).

## Git Workflow

- Work on a feature branch, not directly on `main`.
- Never commit or push without being explicitly asked to, even on a non-main branch.
