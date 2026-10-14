# CinePulse

## Description
CinePulse is an interactive movie discovery and curation dashboard that allows users to explore an offline cinema vault, perform multi-criteria filtering by genre, rating, and release year range, execute debounced asynchronous title and director searches, navigate paginated catalog results, and curate a personal watchlist. Built with React 18, Vite 5, and Vanilla CSS with custom properties and responsive grid styling, the client-side single-page application mounts via `src/main.jsx` into `#root`, coordinates state and view composition through `src/App.jsx`, leverages `src/services/movieService.js` and `src/utils/pagination.js` for data retrieval and array partitioning over a bundled JSON dataset (`data/movies.json`), handles asynchronous query lifecycles through the `useMovieSearch` hook, and synchronizes watchlist state with browser `localStorage`.

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
|
└── vite.config.js          # Vite and Vitest build/test configuration


## Bugs and Bug Locations

### 1. Upper Boundary Year Movies Missing From Filtered Catalog
- **Bug location:** `src/services/movieService.js`, within the `filterMovies` function (lines 38–40).
- **How to observe it:** Apply a filter specifying `maxYear: 2024` (e.g., `filterMovies(movies, { minYear: 2020, maxYear: 2024 })` or by setting the max year input in the UI filter bar to 2024).
- **Failure:** Movies released in 2024 (such as *Dune: Part Two* and *Challengers*) are omitted from the filtered results because the comparison `movie.year >= maxYear` incorrectly excludes movies matching the upper bound year.
- **Expected:** Movies released in 2024 should be included; only movies with release years strictly greater than `maxYear` (`movie.year > maxYear`) should be filtered out.

### 2. Pagination Slicing Omits the Final Item on Each Page
- **Bug location:** `src/utils/pagination.js`, within the `paginate` function (lines 9–11).
- **How to observe it:** Call `paginate(items, 1, 6)` on an array of 18 items or view the catalog in the UI with the default page size of 6 items per page.
- **Failure:** The slice end index is computed as `startIndex + safePageSize - 1`, resulting in only 5 items being returned for page 1 instead of 6, and skipping every 6th item across consecutive pages.
- **Expected:** The slice end index should be `startIndex + safePageSize`, returning the full configured page size of 6 items on full pages and partitioning consecutive pages seamlessly without data loss.

### 3. Removing a Movie From Watchlist Deletes the Last Entry Instead
- **Bug location:** `src/context/WatchlistContext.jsx`, within the `removeFromWatchlist` function (lines 37–42).
- **How to observe it:** Add multiple movies to the watchlist (such as movies with IDs `'m-01'`, `'m-02'`, and `'m-03'`), open the Watchlist drawer, and click the "Remove" button on the first movie (`'m-01'`).
- **Failure:** The function runs `prev.indexOf(movieId)` on an array of movie objects, which returns `-1`. Executing `updated.splice(-1, 1)` deletes the last item in the array (`'m-03'`), leaving the clicked movie (`'m-01'`) in the list.
- **Expected:** The function should match the movie by its unique `id` property (e.g., via `filter` or `findIndex`), removing only the targeted movie without mutating or deleting unrelated entries.

### 4. Search Bar Remains Frozen in Loading State on Query Error
- **Bug location:** `src/hooks/useMovieSearch.js`, within the `executeSearch` function (lines 27–31).
- **How to observe it:** Execute a search query that fails or throws a network rejection (e.g., querying `'THROW_NETWORK_ERROR'` or `'__error__query'`).
- **Failure:** The `catch` block catches the error and sets the error message, but never calls `setIsLoading(false)`. As a result, `isLoading` remains permanently `true`, keeping the search input disabled with a spinning loading indicator and preventing future searches.
- **Expected:** The loading flag should be reset to `false` when a query fails (such as in a `finally` block or within the `catch` handler), allowing the user to immediately submit new searches after an error.


