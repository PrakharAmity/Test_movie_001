import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';

export function Navbar({ search, onSearchChange, isLoading, onOpenWatchlist }) {
  const { watchlist } = useWatchlist();

  return (
    <header className="navbar" role="banner">
      <div className="brand-section" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="brand-logo" aria-hidden="true">C</div>
        <div>
          <h1 className="brand-title">CinePulse</h1>
        </div>
        <span className="brand-badge">Studio</span>
      </div>

      <div className="navbar-center">
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            id="movie-search-input"
            type="text"
            className="search-input"
            placeholder="Search films by title or director..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={isLoading}
            aria-label="Search movies"
          />
          {isLoading && (
            <div className="search-spinner" data-testid="search-spinner" aria-label="Loading results" />
          )}
        </div>
      </div>

      <div className="navbar-actions">
        <button
          id="watchlist-toggle-btn"
          className="btn-watchlist"
          onClick={onOpenWatchlist}
          aria-label={`View watchlist containing ${watchlist.length} movies`}
        >
          <span>⭐ Watchlist</span>
          <span className="badge-count" data-testid="watchlist-count">{watchlist.length}</span>
        </button>
      </div>
    </header>
  );
}
