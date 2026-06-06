# CV Builder

Application web de création de CV : assistant pas-à-pas, 14 modèles, import PDF/DOCX,
export PDF (texte réel, lisible par les ATS) / Word / JSON, et fonctions IA (analyse et
traduction FR↔EN via Gemini). React 19 + Vite, sans base de données — les données du CV
sont conservées dans le `localStorage` du navigateur.

## Démarrage

```bash
npm install
npm run dev          # serveur de dev Vite
```

> Les fonctions IA passent par une **fonction serverless** (`/api/gemini`) que `vite dev`
> ne sert pas. Pour les tester en local, lancez **`vercel dev`** (voir ci-dessous).

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement (HMR) |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production |
| `npm run lint` | ESLint |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:watch` | Tests en mode watch |

**Node 20.19+ / 22.12+ requis** (Vite 8). Sous Node 18, `vite` échoue avec `CustomEvent is not defined`.

## Configuration (clé Gemini)

La clé Gemini est **uniquement côté serveur** — elle ne doit jamais se retrouver dans le
bundle navigateur. La variable n'a donc **pas** de préfixe `VITE_`.

```bash
cp .env.example .env
# puis renseigner :
GEMINI_API_KEY=...
```

- **Local** : `npm i -g vercel` puis `vercel dev` (sert l'app **et** `/api`).
- **Production (Vercel)** : définir `GEMINI_API_KEY` dans Project → Settings → Environment Variables.

Sans clé configurée, les fonctions IA (analyse à l'import, traduction) sont simplement
indisponibles — le reste de l'application fonctionne normalement.

## Architecture

- État global unique dans `src/context/CvContext.jsx` (contenu du CV + navigation),
  persisté en `localStorage` (débouncé), routing par hash maison.
- Les modèles (`src/templates/`) sont des composants présentationnels nourris par
  `mapCvDataToTemplate` (`src/utils/templateMapper.js`) — ils ne lisent jamais `cvData`
  directement.
- Aperçu mis à l'échelle de façon responsive via `src/components/Preview/ScaledPreview.jsx`.
- Export PDF par impression navigateur (`src/utils/printCv.js`) → texte vectoriel sélectionnable.

Détails complets pour les contributeurs (et agents) dans **`CLAUDE.md`**.

## Tests

Logique pure couverte par Vitest : mapping des données (`templateMapper`) et parsing du
texte de CV importé (`cvTextParser`).

```bash
npm test
```
