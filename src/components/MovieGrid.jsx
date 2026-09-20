import React from 'react';
import { MovieCard } from './MovieCard';

export function MovieGrid({ movies = [] }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>No films found</h3>
        <p>No films match your search criteria. Try adjusting the filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid" data-testid="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
