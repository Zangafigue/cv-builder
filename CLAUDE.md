# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (HMR). Does **not** serve `/api`; use `vercel dev` to exercise the AI functions locally.
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint over all `.js`/`.jsx` (currently clean)
- `npm test` / `npm run test:watch` — Vitest unit tests (pure logic only)

No TypeScript. Lint rule of note: unused vars error unless they match `^[A-Z_]` (capitalized/constant names are ignored). **Vitest is pinned to `^2`** on purpose — v4 needs Node 20+ (`node:util` `styleText`); v2 runs on Node 18 too.

`.env` holds **`GEMINI_API_KEY`** (server-side only, no `VITE_` prefix — see `.env.example`). It is read by the `/api/gemini` serverless function; never expose it to the client bundle. Locally it requires `vercel dev`; in production set it in Vercel → Settings → Environment Variables.

## Architecture

A single-page React 19 + Vite CV builder. **All UI text is in French.** There is no React Router — navigation and all CV content live in one global context.

### State & navigation (`src/context/CvContext.jsx`)

`CvProvider` is the single source of truth. It holds:
- `cvData` — the entire CV (shape defined by `initialCvData`), persisted to `localStorage` under `cv-builder-data-v2`.
- `currentPage` (`'landing' | 'template-select' | 'wizard' | 'final'`) and `currentStep`, mirrored to the URL hash (`#wizard/2`) and to localStorage. `App.jsx` renders one page component based on `currentPage`; there are no route components.

Mutate `cvData` only through the context helpers: `updatePersonalInfo`, `addItem/updateItem/removeItem(field, ...)` (list sections keyed by stable `uuid` ids), `updateTemplateSettings(field, value)` (template, themeColor, typography, sectionsOrder), `setCvData` (bulk replace, used by import/translation). `useCv()` throws if used outside the provider.

### The data-mapping boundary (`src/utils/templateMapper.js`)

This is the most important seam in the codebase. **Templates never read `cvData` directly.** `Preview.jsx` calls `mapCvDataToTemplate(cvData, templateId)` and passes the result as a single `data` prop. The mapper transforms the app's internal shape into the flatter shape templates expect — e.g. `personalInfo.fullName → data.name`, `experience[].position → data.experience[].title`, builds `period` strings from `startDate`/`endDate`/`current`, and splits newline descriptions into `bullets`. The `bit` template gets a different skills shape (grouped `{label, value}` pairs). When you change `initialCvData` or add a field, update the mapper too, or templates won't see it.

### Templates (`src/templates/`)

14 self-contained presentational components (`CVTemplate*.jsx`). Each:
- Takes `{ data }`, injects its own scoped CSS via an inline `<style>` block with a unique class prefix (e.g. `jl-`, `bit-`), and falls back to a built-in `defaultData` when `data` is absent.
- **Must put `className="cv-document"` on its root element** — the PDF/print path (`printCv.js`) clones the `.cv-document` node. A template missing this silently breaks PDF export.

The live preview is wrapped in `ScaledPreview` (`src/components/Preview/ScaledPreview.jsx`), which measures its container and applies a `transform: scale()` so the fixed-width (210mm) document fits responsively — used by the wizard, final page, and template thumbnails (`clipHeight` mode). Template render is also wrapped in an `ErrorBoundary` (keyed by template id) so a throwing template shows a fallback instead of white-screening.

**Adding/renaming a template requires editing three places in sync:** `templates/index.js` (barrel export), `components/Preview/Preview.jsx` (the `cvData.template === '<id>'` dispatch), and the `TEMPLATES` array in `pages/FinalPage.jsx` (selector UI). The string `id` is the contract across all three.

### Wizard (`src/pages/WizardPage.jsx`)

Steps are **dynamic**, not hardcoded. Fixed first steps (personal info, summary) + one step per section in `cvData.sectionsOrder` (mapped via `SECTION_MAP`) + a fixed Structure step. Reordering or toggling sections in `sectionsOrder` changes both the wizard steps and the rendered CV section order. Step components live in `src/components/wizard/Step*.jsx`.

### AI, import, export (`src/utils/`)

- **AI proxy** — `api/gemini.js` is a Vercel serverless function holding `GEMINI_API_KEY`; it builds the prompts and calls `@google/generative-ai` (`gemini-2.5-flash`). The client `geminiService.js` is a thin `fetch('/api/gemini')` wrapper exposing `analyzeCvData` (suggestions) and `translateCvData` (FR↔EN). The client strips base64 photos before sending and restores them after; `translateCvData` also sets `cvData.language` so template labels switch FR↔EN.
- `ImportService.js` — `parseFile` extracts text from PDF (`pdfjs-dist`) and DOCX (`mammoth`, also pulls the first image as photo). The **pure parsing logic lives in `cvTextParser.js`** (`extractDataFromText` + helpers) so it can be unit-tested without the heavy IO deps. Parsing is regex/heuristic (FR/EN section headers, date-range *anchors*, skill/language splitting) — best-effort; works best when date ranges are on their own line. `ImportService` is **lazy-loaded** (dynamic `import()` in `LandingPage`) to keep pdfjs/mammoth out of the main bundle.
- `exportDocx.js` — builds a Word doc with the `docx` library (half-points / twips); **lazy-loaded** from `FinalPage`. PDF/print export goes through `printCv.js` (opens an isolated print window with the cloned `.cv-document` → real, selectable, ATS-readable text, not a raster). JSON export dumps `cvData`. Translation in `FinalPage` previews non-destructively (`translatedData` state) until "Appliquer".
- `downscaleImage.js` / `cropImage.js` — photos are bounded (source ≤1024px, cropped ≤512px JPEG) before being stored, and `CvContext` persists `cvData` **debounced** with a `localStorage` quota guard, to avoid bloating/exceeding storage.

### i18n in templates (`src/templates/shared/translations.js`)

`getTranslation(key, lang)` with FR/EN dictionaries. Templates do `const t = (key) => getTranslation(key, data?.language || 'FR')` and use `{t('experience')}` for section headings. `data.language` is threaded through by the mapper.

### Styling

Global design tokens (CSS variables like `--primary-600`, `--surface-50`, `--radius-xl`) are defined in `src/styles/components.css` / `src/index.css`. Page/component layout is mostly **inline `style={{}}`** using those vars; templates are styled by their own scoped `<style>` blocks. There is no CSS framework or CSS modules.

## Gotchas

- A past `translate_templates.js` codemod (now **deleted**) did naive whole-file string replacement to wire i18n and corrupted live code across ~11 templates (literal-string attributes, unbraced attributes, mangled identifiers). **All live-code damage has been repaired** and every template uses `title={t('key')}` / a clean `renderCertifications`. What remains are cosmetically corrupted **comments** (e.g. `{/* {t('profile')} Summary */}`) — harmless. If you re-wire i18n, do it by hand; do not reintroduce a blind string-replace codemod.
- Every template root **must** keep `className="cv-document"` — `printCv.js` clones it for the PDF/print export, so a template missing it silently breaks export.
- AI runs through the `/api/gemini` serverless function and needs `GEMINI_API_KEY` **server-side**. `vite dev` does not serve `/api` (use `vercel dev`); the public endpoint still consumes your Gemini quota, so rate-limiting is a sensible follow-up.
- The build needs **Node 20.19+ / 22.12+** (Vite 8). On older Node, `vite build`/`vite dev` fail with `CustomEvent is not defined` before any of your code runs (the repo currently runs on Node 18, where only `npm test`/lint work).
- `initialCvData` lives in its own module (`src/context/initialCvData.js`), not exported from `CvContext`, so CvContext only exports components/hooks (Fast Refresh). Import it from there.
- Templates live in `src/templates/` (the old `src/components/Preview/*Template.jsx` copies are gone). `CVTemplateBIT` keeps its `defaultData` in a separate `CVTemplateBIT.data.js`; the others inline it.
