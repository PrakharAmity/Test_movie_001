import React, { useState, useMemo, useEffect } from 'react';
import { getAllMovies, filterMovies } from './services/movieService';
import { paginate } from './utils/pagination';
import { WatchlistProvider } from './context/WatchlistContext';
import { useMovieSearch } from './hooks/useMovieSearch';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { MovieGrid } from './components/MovieGrid';
import { Pagination } from './components/Pagination';
import { WatchlistModal } from './components/WatchlistModal';

const DEFAULT_FILTERS = {
  genre: 'ALL',
  minRating: 0,
  minYear: 1970,
  maxYear: 2024,
  sortBy: 'rating-desc'
};

const PAGE_SIZE = 6;

export function CinePulseApp() {
  const allMovies = useMemo(() => getAllMovies(), []);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    isLoading: isSearchLoading,
    error: searchError,
    executeSearch,
    clearError
  } = useMovieSearch();

  // Trigger search when query changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(searchQuery, allMovies);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, allMovies, executeSearch]);

  // Reset to page 1 on filter or search changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filter movies
  const filteredMovies = useMemo(() => {
    return filterMovies(allMovies, {
      search: searchQuery,
      genre: filters.genre,
      minRating: filters.minRating,
      minYear: filters.minYear,
      maxYear: filters.maxYear,
      sortBy: filters.sortBy
    });
  }, [allMovies, searchQuery, filters]);

  // Paginate results
  const paginationData = useMemo(() => {
    return paginate(filteredMovies, currentPage, PAGE_SIZE);
  }, [filteredMovies, currentPage]);

  return (
    <div className="app-container">
      <Navbar
        search={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        isLoading={isSearchLoading}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
      />

      <main className="main-content">
        <section className="hero">
          <span className="hero-tag">Curated Cinema Vault</span>
          <h2 className="hero-title">
            Explore Masterpieces of <span className="hero-highlight">Modern Cinema</span>
          </h2>
          <p className="hero-desc">
            Filter by era, discover award-winning ratings, and build your personalized film watchlist.
          </p>
        </section>

        {/* Error notification */}
        {searchError && (
          <div className="error-banner" role="alert" data-testid="search-error-banner">
            <span>⚠️ {searchError}</span>
            <button
              id="btn-dismiss-error"
              type="button"
              onClick={clearError}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="results-header">
          <p className="results-count" data-testid="results-count">
            Showing <strong>{paginationData.items.length}</strong> of <strong>{filteredMovies.length}</strong> films
            {filteredMovies.length !== allMovies.length && ` (filtered from ${allMovies.length} total)`}
          </p>
        </div>

        <MovieGrid movies={paginationData.items} />

        <Pagination
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          onPageChange={setCurrentPage}
          hasPrev={paginationData.hasPrev}
          hasNext={paginationData.hasNext}
        />
      </main>

      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <WatchlistProvider>
      <CinePulseApp />
    </WatchlistProvider>
  );
}
