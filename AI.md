# AI Context

## Project
CinePulse is an interactive movie discovery and catalog dashboard. It enables users to browse a collection of films, apply multi-criteria filters and sorting, perform debounced searches, navigate paginated results, and manage a personal watchlist with local storage persistence.

## Tech Stack
- Language: JavaScript (ES Modules, JSX)
- Framework: React 18 (`react`, `react-dom`)
- Runtime: Node.js (Node 22 runtime environment)
- Database / Data: Bundled static JSON dataset (`data/movies.json`)
- Styling: Vanilla CSS (`src/index.css`) utilizing CSS variables and responsive grid layouts
- Testing: Vitest (`vitest`), React Testing Library (`@testing-library/react`), `@testing-library/jest-dom`, and `jsdom`
- Build / Tooling: Vite 5 (`vite`, `@vitejs/plugin-react`)

## Repository Structure
```
.
├── challenge.json          # Container runtime and execution specification
├── data/
│   └── movies.json         # Static catalog dataset
├── index.html              # HTML document root
├── package.json            # Node.js dependencies and script definitions
├── src/
│   ├── App.jsx             # Top-level application coordinator component
│   ├── index.css           # Global theme tokens and component styles
│   ├── main.jsx            # Application bootstrap and DOM mounting
│   ├── components/
│   │   ├── FilterBar.jsx   # Filter controls (genre, rating, year, sorting)
│   │   ├── MovieCard.jsx   # Individual movie presentation and actions
│   │   ├── MovieGrid.jsx   # Responsive grid container for movie cards
│   │   ├── Navbar.jsx      # Header with search bar and watchlist counter
│   │   ├── Pagination.jsx  # Page navigation controls
│   │   └── WatchlistModal.jsx # Watchlist dialog drawer and item management
│   ├── context/
│   │   └── WatchlistContext.jsx # React Context and provider for watchlist state
│   ├── hooks/
│   │   └── useMovieSearch.js   # Custom hook managing search state and query execution
│   ├── services/
│   │   └── movieService.js     # Data retrieval, filtering, and sorting logic
│   └── utils/
│       └── pagination.js       # Dataset slicing and pagination metadata calculations
├── tests/
│   ├── bug1_filter.test.js     # Catalog filtering tests
│   ├── bug2_pagination.test.js # Pagination calculation tests
│   ├── bug3_watchlist.test.js  # Watchlist context operations tests
│   ├── bug4_search_error.test.js # Search error and loading lifecycle tests
│   ├── challengeReporter.js   # Custom Vitest reporter generating execution JSON
│   └── setup.js               # Vitest environment setup
└── vite.config.js          # Vite and Vitest build/test configuration
```

## Entry Points
- HTML Root: [index.html](file:///c:/Users/prakh/Desktop/Application%20project/index.html) loads fonts, sets viewport metadata, and specifies `/src/main.jsx`.
- Application Entry: [src/main.jsx](file:///c:/Users/prakh/Desktop/Application%20project/src/main.jsx) mounts `<App />` wrapped in `React.StrictMode` into `#root`.
- Main Component: [src/App.jsx](file:///c:/Users/prakh/Desktop/Application%20project/src/App.jsx) wraps `<CinePulseApp />` with `<WatchlistProvider />`.
- Test Entry: Vitest executes test suites defined in `tests/`, configured via [vite.config.js](file:///c:/Users/prakh/Desktop/Application%20project/vite.config.js) with setup at [tests/setup.js](file:///c:/Users/prakh/Desktop/Application%20project/tests/setup.js).

## Architecture
CinePulse operates as a client-side single-page application (SPA):
- Presentation Layer: Modular React components in `src/components/` handle UI rendering and user interactions.
- Orchestration Layer: `src/App.jsx` coordinates query filters, current page state, modal toggling, and binds search hook results to catalog views.
- Domain Logic & Services: `src/services/movieService.js` provides querying, filtering, and sorting routines against the static dataset. `src/utils/pagination.js` provides pure pagination math and item slicing.
- State Management: `WatchlistContext` manages user watchlist collections across components, synchronizing state with browser `localStorage`.
- Search & Async Logic: `src/hooks/useMovieSearch.js` decouples asynchronous query processing, debounce delays, and error tracking from the view.

## Important Modules

### Catalog & Filtering (`src/services/movieService.js`)
Loads `data/movies.json` and exposes `getAllMovies()` and `filterMovies()`. Evaluates filtering predicates across text search (title/director), genre matching, minimum rating thresholds, and release year bounds, followed by sorting by rating, year, or title.

### Pagination (`src/utils/pagination.js`)
Exposes `paginate(items, page, pageSize)`. Calculates derived properties such as `totalPages`, `currentPage`, `hasNext`, `hasPrev`, and extracts the active slice of items.

### Watchlist Context (`src/context/WatchlistContext.jsx`)
Supplies `WatchlistProvider` and `useWatchlist()` hook. Exposes methods to add (`addToWatchlist`), remove (`removeFromWatchlist`), query (`isInWatchlist`), and clear (`clearWatchlist`) entries, persisting state to `localStorage` under `cinepulse_watchlist`.

### Search Hook (`src/hooks/useMovieSearch.js`)
Encapsulates search lifecycle state: `query`, `isLoading`, `error`, and `searchResults`. Manages asynchronous query dispatch via `executeSearch()` and state clearing via `resetSearch()`.

### View Components (`src/components/`)
- `Navbar.jsx`: Brand banner, search text input with loading indicator, and watchlist badge counter button.
- `FilterBar.jsx`: Inputs for genre selection, minimum rating, release year range, sort order, and a filter reset trigger.
- `MovieGrid.jsx` & `MovieCard.jsx`: Grid layout rendering movie poster details, ratings, genres, and watchlist toggle buttons.
- `Pagination.jsx`: Numbered page selectors and previous/next page navigation buttons.
- `WatchlistModal.jsx`: Modal drawer listing saved movies with removal actions and a clear all option.

## Data Flow
1. Catalog Ingestion & Filtering:
   `movies.json` → `movieService.getAllMovies()` → `App.jsx` evaluates `filterMovies()` with active filter state → outputs `filteredMovies`.
2. Pagination Pipeline:
   `filteredMovies` + `currentPage` + `PAGE_SIZE` (6) → `pagination.paginate()` → provides `items` to `MovieGrid` → maps individual items to `MovieCard`.
3. Search Flow:
   User input in `Navbar` updates `searchQuery` → debounced effect in `App.jsx` invokes `useMovieSearch.executeSearch()` → updates `isLoading`, `searchResults`, or `error` banner.
4. Watchlist Persistence Flow:
   Toggle button on `MovieCard` or `WatchlistModal` invokes `addToWatchlist` or `removeFromWatchlist` → `WatchlistContext` state updates → `useEffect` persists to `localStorage` → `Navbar` badge count and card state update reactively.

## Testing
- Framework: Vitest running in `jsdom` environment with `@testing-library/react` and `@testing-library/jest-dom`.
- Test Directory: `tests/`
- Configuration: `vite.config.js` sets `globals: true`, points `setupFiles` to `./tests/setup.js`, and specifies `./tests/challengeReporter.js` as reporter.
- Test Organization:
  - `bug1_filter.test.js`: Validates `filterMovies` behavior against sample movie fixtures and full dataset.
  - `bug2_pagination.test.js`: Tests `paginate` slice calculations and consecutive page boundary partitioning.
  - `bug3_watchlist.test.js`: Tests `WatchlistProvider` and `useWatchlist` item removal and state retention using `renderHook`.
  - `bug4_search_error.test.js`: Tests `useMovieSearch` hook state transitions during error and recovery scenarios.
  - `challengeReporter.js`: Custom reporter producing a structured JSON summary of test suite outcomes and execution times.

## Runtime / Commands
- Start Development Server:
  `npm run dev` (starts Vite dev server listening on `0.0.0.0:3000`)
- Run Automated Test Suite:
  `npm test` (runs Vitest in single-run mode via `vitest run`)
- Build Production Bundle:
  `npm run build` (outputs compiled assets to `dist/`)
- Preview Production Build:
  `npm run preview` (serves the `dist/` directory on `0.0.0.0:3000`)

## Debugging Context
- Module Separation: Core data manipulation logic is isolated from UI components. Filtering resides entirely in `movieService.js`, pagination slicing logic is isolated in `pagination.js`, and search lifecycle handling lives in `useMovieSearch.js`.
- State Boundaries: Global state is limited to the watchlist (`WatchlistContext`). Catalog filters, pagination indices, and modal visibility are managed locally in `App.jsx`.
- Data Formats: Movie objects contain `id` (string), `title` (string), `year` (number), `genre` (string), `rating` (number), `director` (string), `runtime` (string), `synopsis` (string), and styling attributes (`themeColor`, `accentColor`, `featured`).
- Boundaries & Type Handling: Numeric filter inputs for `minRating`, `minYear`, and `maxYear` are converted via `Number()` in `FilterBar.jsx` before reaching `filterMovies`. Pagination calculates slice bounds based on 1-indexed page arguments and zero-based array indexing.
- Storage Fallbacks: `WatchlistContext.jsx` wraps `localStorage` calls in try/catch blocks to gracefully handle restricted browser/test environments.
