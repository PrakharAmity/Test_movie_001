# CinePulse — Movie Explorer & Studio Dashboard

CinePulse is an interactive movie discovery and curation dashboard built for film enthusiasts and studio catalog managers. It allows users to browse an offline cinema vault, apply multi-criteria filtering (by genre, rating, and release era), inspect film synopses, and curate a personal watchlist.

---

## 1. Application Overview

### Core Functionality
- **Dynamic Catalog Browsing**: View top-rated films with rich visual metadata, genres, and ratings.
- **Multi-Dimensional Filtering & Sorting**: Filter by release year range, minimum rating threshold, and genre categories; sort by rating or release date.
- **Interactive Watchlist**: Save and remove films to/from a personal drawer with real-time badge count updates and offline persistence.
- **Fast Search**: Search by title or director with debounced asynchronous query simulation.
- **Paginated Navigation**: Clean page partitioning to smoothly navigate large catalogs.

### Technology Stack
- **Framework**: React 18
- **Build Tool / Dev Server**: Vite 5
- **Styling**: Vanilla CSS (CSS custom properties, glassmorphism, responsive grid, dark mode)
- **Testing**: Vitest, React Testing Library, jsdom
- **Data**: Bundled local JSON dataset (`data/movies.json`)

---

## 2. Debugging Challenge

QA engineers and early users have flagged several issues in the CinePulse studio platform. Your goal is to investigate the codebase, reproduce each bug, and implement the necessary fixes so that all automated test suites pass.

### Reported Issues & Tasks:

#### Issue 1: Boundary Year Movies Missing From Filtered Catalog
- **User Symptom**: Users selecting a release year range (e.g., 2020 to 2024) report that new releases from the selected end year (such as 2024 films like *Dune: Part Two* and *Challengers*) fail to appear in the results.
- **Task**: Ensure that the release year filter includes films released in the maximum boundary year selected by the user.

#### Issue 2: Pagination Omits the Final Film on Each Page
- **User Symptom**: The catalog is configured to display 6 films per page, but users notice only 5 films show up on full pages, and the final movie in each block of items is skipped when moving between pages.
- **Task**: Correct the page slicing calculation so that every page displays the configured number of items and no catalog items are skipped during page transitions.

#### Issue 3: Removing a Movie From Watchlist Deletes the Wrong Entry
- **User Symptom**: When a user opens their Watchlist and clicks "Remove" on a specific film (for example, the first item in the list), the clicked film remains in the list, but whichever movie is at the bottom of the list is deleted instead!
- **Task**: Fix the watchlist removal logic so that removing an item by its ID accurately removes that exact film without deleting other entries.

#### Issue 4: Search Bar Freezes in "Loading..." State After a Failed Query
- **User Symptom**: If an unexpected network timeout or error occurs during an asynchronous search query, an error alert appears, but the search input remains disabled and the spinning loading indicator never disappears, blocking subsequent searches.
- **Task**: Ensure the search state properly clears the loading state even when an error or rejection occurs.

---

## 3. Expected Behavior After Fixing Bugs

After resolving the issues:
1. Setting the year filter to 2024 includes all 2024 movies up to and including that year.
2. Each pagination page accurately displays up to 6 films, and navigating consecutive pages displays all movies without gaps.
3. Clicking "Remove" on any film in the Watchlist drawer reliably removes only that specific film.
4. When a search fails, the loading spinner stops and the user is able to perform subsequent searches immediately.
5. All automated tests in `tests/` pass with exit code `0`.
