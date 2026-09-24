# AI Context

## Project

CinePulse is a client-side movie discovery dashboard that allows users to browse, search, filter, and paginate through a film catalog, as well as curate a personal watchlist.

## Stack

- JavaScript (ES Modules, JSX)
- React 18
- Vite
- Vanilla CSS
- Browser LocalStorage
- Static JSON (`data/movies.json`)

## Repository Structure

- `data/movies.json` — Static catalog containing movie objects with id, title, genre, year, rating, and metadata
- `src/App.jsx` — Root component coordinating search, filter, pagination states, and modal visibility
- `src/components/` — UI components (`Navbar`, `FilterBar`, `MovieGrid`, `MovieCard`, `Pagination`, `WatchlistModal`)
- `src/context/WatchlistContext.jsx` — React context providing watchlist state and management actions backed by LocalStorage
- `src/hooks/useMovieSearch.js` — Custom hook managing asynchronous movie search query execution, loading status, and error states
- `src/services/movieService.js` — Service functions for loading movies and applying search, genre, rating, year, and sorting filters
- `src/utils/pagination.js` — Utility function for calculating pagination metadata and slicing page items

## Important Logic

### movieService.js
`getAllMovies()` returns the raw catalog list. `filterMovies(movies, criteria)` filters items by search string, genre, minimum rating, release year range, and sorts the result by rating, year, or title.

### pagination.js
`paginate(items, page, pageSize)` calculates `currentPage`, `totalPages`, `totalItems`, navigation flags (`hasNext`, `hasPrev`), and slices the items array for the current page view.

### WatchlistContext.jsx
Maintains `watchlist` state, automatically synchronizing changes to `localStorage` under `cinepulse_watchlist`. Exposes `addToWatchlist`, `removeFromWatchlist`, `isInWatchlist`, and `clearWatchlist` via the `useWatchlist` hook.

### useMovieSearch.js
Manages query string, `isLoading` flag, `error` string, and `searchResults`. Simulates asynchronous retrieval with a delay, handling matching via `filterMovies` and surfacing failures to error state.

### App.jsx
Contains top-level application state, including active filters, current page number, and watchlist modal visibility. Debounces query input changes to trigger searches and computes filtered and paginated movie subsets.

## Debugging Facts

- Movies are keyed by a unique string `id` (e.g., `'m-01'`).
- Changing search query or filter values resets `currentPage` back to `1`.
- Search matches query against both movie title and director (case-insensitive).
- Catalog filtering occurs before pagination; `paginate()` only slices already-filtered results.
- Default page size is 6 items per page.
- Watchlist persistence is scoped to the `localStorage` key `'cinepulse_watchlist'` and initializes from stored JSON if present.
- `filterMovies()` and `paginate()` are pure functions with no React or DOM dependencies.
- `Navbar` search input is disabled and displays a spinner when `isLoading` is true.
