# Museum Intelligence Dashboard

A research tool for curators built on the [Metropolitan Museum of Art open API](https://metmuseum.github.io/). Discover, filter, and analyse artworks across the full Met collection.

## Stack

- **React 19** + **TypeScript**
- **Material UI v9** — component library
- **TanStack Query v5** — data fetching and caching
- **React Router v7** — routing and URL state
- **Vite** — bundler
- **Vitest** + **React Testing Library** — test suite

## Getting started

```bash
npm install
npm run dev       # development server
npm test          # run test suite
npm run build     # production build
```

## Features

### Feature A — Research Gallery
- Artwork grid with thumbnail, title, artist, and date
- Filters: keyword (debounced), department (from API), date range with BCE support (negative years)
- All filter state persisted in the URL — deep-linkable and refresh-safe
- Progressive loading: fetches 20 artworks at a time, loads more on scroll via `IntersectionObserver`
- All Departments selected by default on first visit; filter bar hidden on the detail page

### Feature B — Artifact Detail View
- High-resolution image with fallback placeholder
- Full metadata: accession number, medium, dimensions, credit line, tags
- Null/missing fields silently omitted — no empty rows
- Related Works: up to 8 artworks from the same department within ±50 years

---

## Experience using AI (Claude Code)

The entire application was built collaboratively with Claude Code as the primary development tool. The workflow was deliberately incremental — each layer was discussed, built, and verified before moving to the next.

### What worked well

**Architecture up front.** Before writing any code, I asked Claude to produce a full implementation plan covering the file structure, internal data model, URL state strategy, progressive loading approach, and test plan. Having this blueprint meant every subsequent step had clear context — the AI wasn't guessing what came next.

**Incremental, reviewer-style collaboration.** Rather than generating the entire codebase at once, we built layer by layer: config → providers → Header → FilterBar → ArtworkCard → ArtworkGrid → API layer → hooks → pages → tests. At each step I could review the output, make direct edits in the IDE, and the AI adapted to my changes rather than reverting them.

**Catching its own bugs.** Two notable self-corrections happened during the session:
- The `loading` prop passed to `ArtworkGrid` only reflected the search phase, not the individual artwork-fetch phase. After the search resolved but before artworks loaded, the grid briefly showed "No artworks found". The AI identified this as the root cause when I reported no results with date filters.
- The `q=*` wildcard combined with `hasImages=true` was too restrictive with date range queries, not matching the Met API's documented pattern. Comparing against the official example URL (`?q=African&dateBegin=1700&dateEnd=1800`) made the discrepancy clear.

**Good product instincts.** When I asked whether cards should show by default or only after a search, Claude reasoned through the UX tradeoff (empty screen vs. noisy unfiltered results) and proposed a middle ground: default to a randomly selected department on first load. That decision came from a product conversation, not just a technical one.

### Where I directed the AI

The AI required clear steering on structure and ownership. Left to its own defaults it would have embedded the `FilterBar` inside the `Header` — I redirected it to be a standalone component. Similarly, it initially co-located layout concerns inside `App.tsx` that belonged in dedicated page components.

Some decisions needed explicit input from me:
- Moving the FilterBar outside the AppBar
- Choosing a random department instead of a hardcoded default
- Confirming that date params require both `dateBegin` and `dateEnd` by sharing the API documentation directly

### Overall

AI was most valuable for the high-volume, high-accuracy work: wiring TanStack Query hooks, writing the data transformation layer with consistent null-handling, and generating a comprehensive test suite (33 tests across 3 files). The architectural decisions and product choices still needed human judgement — the AI's role was to execute them correctly and flag when something looked wrong.

---

## File map

| File | Purpose |
|---|---|
| **Config** | |
| `vite.config.ts` | Vitest config (jsdom, globals, setup file), `@/` path alias |
| `tsconfig.app.json` | `@/*` path alias, Vitest global types |
| `package.json` | `test` and `test:ui` scripts |
| **Entry points** | |
| `src/main.tsx` | `QueryClientProvider`, `ThemeProvider`, `CssBaseline`, `BrowserRouter` |
| `src/App.tsx` | Routes: `/` → `/gallery`, `/gallery`, `/artwork/:id`; FilterBar shown only on gallery route |
| **Types & API** | |
| `src/types/artwork.ts` | Raw API shapes + normalized `ArtworkSummary`, `ArtworkDetail`, `GalleryFilters` |
| `src/api/client.ts` | Base `apiGet` fetch wrapper with `ApiError` |
| `src/api/transforms.ts` | `transformArtworkDetail`, `toArtworkSummary` — raw → normalized |
| `src/api/met.ts` | `searchArtworks`, `getArtwork`, `getDepartments` |
| **Hooks** | |
| `src/hooks/useGalleryParams.ts` | Read/write all filter state in URL (supports BCE negative years) |
| `src/hooks/useDepartments.ts` | Fetch department list, cached forever |
| `src/hooks/useArtworkSearch.ts` | Two-step fetch: search IDs → batch 20 objects, `loadMore()` for infinite scroll |
| `src/hooks/useArtwork.ts` | Single artwork detail, shared TanStack cache |
| `src/hooks/useRelatedWorks.ts` | Same dept ±50 years, up to 8 related works |
| **Gallery components** | |
| `src/components/layout/Header.tsx` | MUI `AppBar` with project title |
| `src/components/FilterBar/index.tsx` | Keyword (debounced), department dropdown (from API), BCE/CE date range |
| `src/components/ArtworkCard/index.tsx` | Card with thumbnail, title, artist, date — image placeholder for nulls |
| `src/components/ArtworkGrid/index.tsx` | Responsive 4-column grid, 20-skeleton loading state, empty state |
| `src/components/LoadMoreTrigger/index.tsx` | `IntersectionObserver` sentinel — fires `loadMore()` on scroll |
| **Detail components** | |
| `src/components/detail/ArtworkHero.tsx` | High-res image, title, artist, accession number, Met Museum link |
| `src/components/detail/ArtworkMetadata.tsx` | Medium, dimensions, credit line table + tags chips — nulls silently omitted |
| `src/components/detail/RelatedWorksRow.tsx` | Horizontal scroll row of related `ArtworkCard`s with skeleton loading |
| **Pages** | |
| `src/pages/GalleryPage.tsx` | Live search, all departments shown by default, result count, error state |
| `src/pages/ArtworkDetailPage.tsx` | Skeleton load, error alert, wires Hero + Metadata + RelatedWorks |
| **Tests** | |
| `src/tests/setup.ts` | Imports `@testing-library/jest-dom` matchers |
| `src/tests/transforms.test.ts` | 15 tests — field mapping, all fallbacks, BCE dates, null handling |
| `src/tests/useGalleryParams.test.tsx` | 11 tests — URL read/write, BCE encoding, param preservation, reset |
| `src/tests/ArtworkCard.test.tsx` | 7 tests — renders, image/placeholder, click handler |
