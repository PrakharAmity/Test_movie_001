# AI Context

## Project
CinePulse is an offline movie discovery dashboard with catalog browsing, filtering, search, pagination, and watchlist curation.

## Tech Stack
- Language: JavaScript (ES Modules, JSX)
- Framework: React 18
- Runtime: Node.js (Node 22)
- Testing: Vitest, React Testing Library, JSDOM
- Build/Tooling: Vite 5
- Styling: Vanilla CSS
- Storage: Static JSON (`data/movies.json`), browser `localStorage`

## Repository Structure
```
data/movies.json   # Movie catalog
src/
  components/      # UI components
  context/         # WatchlistContext
  hooks/           # useMovieSearch
  services/        # movieService
  utils/           # pagination
  App.jsx          # App root & state
  index.css        # Styling
  main.jsx         # DOM entry
tests/             # Test suites & reporter
vite.config.js     # Build & test config
```

## Entry Points
- HTML: `index.html` (mounts `#root`)
- App Mount: `src/main.jsx` (mounts `App` in `React.StrictMode`)
- Root: `src/App.jsx` (provides `WatchlistProvider`, coordinates filters, search, and pages)
- Config: `vite.config.js` (dev server, build settings, Vitest environment)

## Architecture
Client-side React SPA:
Components (`Navbar`, `FilterBar`, `MovieGrid`, `Pagination`, `WatchlistModal`)
→ `App.jsx` / `useMovieSearch`
→ `WatchlistContext` (`localStorage`)
→ `movieService.js` / `pagination.js`
→ `data/movies.json`

## Important Modules

### Catalog Service (`src/services/movieService.js`)
Loads `data/movies.json`. `getAllMovies()` returns data; `filterMovies()` handles search, genre, rating, year, sorting.

### Pagination (`src/utils/pagination.js`)
`paginate()` calculates bounds, total pages, navigation flags, and slices items.

### Watchlist Context (`src/context/WatchlistContext.jsx`)
Global state synced with `localStorage` (`cinepulse_watchlist`). Exposes add, remove, has, and clear methods.

### Search Hook (`src/hooks/useMovieSearch.js`)
Manages query, loading, error, and results state with simulated async search.

### UI Components (`src/components/`)
`Navbar` (search, badge), `FilterBar` (filters), `MovieCard`/`MovieGrid` (cards), `Pagination` (pages), `WatchlistModal` (drawer).

## Data Flow
1. Catalog: `data/movies.json` → `movieService.getAllMovies()` → `App.jsx`.
2. Filter/Search: UI inputs → `App.jsx` → `filterMovies()`.
3. Pagination/Render: Filtered list → `paginate()` → page items → `MovieGrid`.
4. Watchlist: User actions → `WatchlistContext` → `localStorage` sync → UI updates.

## Testing
- Framework: Vitest (`jsdom`) with `@testing-library/react`.
- Directory: `tests/` (`setup.js` for matchers, `challengeReporter.js` for JSON output).
- Suites:
  - `bug1_filter.test.js`: Release year boundary filtering.
  - `bug2_pagination.test.js`: Page slicing and item partitioning.
  - `bug3_watchlist.test.js`: Watchlist state updates and item deletion.
  - `bug4_search_error.test.js`: Loading state recovery on error.

## Runtime / Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start dev server (`0.0.0.0:3000`).
- `npm test`: Run Vitest test suites.
- `npm run build`: Compile bundle into `dist/`.
- `npm run preview`: Preview production build.

## Debugging Context
- State Locations: Watchlist in `WatchlistContext`; filters, search, and page index in `App.jsx`.
- Boundary Conditions: Filter or search changes reset page index to 1.
- Persistence: Serialized to `localStorage` under `cinepulse_watchlist`.
- Item Keying: Movies identified by string `id` (e.g., `'m-01'`).
- Async Latency: `useMovieSearch` simulates latency; UI disables input and shows spinner during loading.
- Pure Functions: `filterMovies` and `paginate` are pure functions with no React dependencies.
