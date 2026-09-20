import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';

export function MovieCard({ movie }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inList = isInWatchlist(movie.id);

  const handleWatchlistClick = () => {
    if (inList) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <article className="movie-card" data-testid={`movie-card-${movie.id}`}>
      {/* Poster / Header Graphic */}
      <div
        className="card-poster"
        style={{
          background: `linear-gradient(135deg, ${movie.accentColor}33, #0f172a)`
        }}
      >
        <div className="poster-overlay" />
        
        {/* Rating Pill */}
        <div className="card-badge-rating">
          <span>★</span>
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {movie.featured && (
          <div className="card-badge-featured">Featured</div>
        )}

        <div className="poster-content">
          <span className="card-genre">{movie.genre}</span>
          <h3 className="card-title">{movie.title}</h3>
        </div>
      </div>

      {/* Body details */}
      <div className="card-body">
        <p className="card-synopsis">{movie.synopsis}</p>

        <div>
          <div className="card-meta">
            <span>Dir: {movie.director}</span>
            <span>{movie.year} • {movie.runtime}</span>
          </div>

          <button
            id={`btn-watchlist-${movie.id}`}
            type="button"
            className={`btn-card-action ${inList ? 'in-watchlist' : ''}`}
            onClick={handleWatchlistClick}
            aria-label={inList ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
          >
            {inList ? '✓ In Watchlist' : '+ Add to Watchlist'}
          </button>
        </div>
      </div>
    </article>
  );
}
