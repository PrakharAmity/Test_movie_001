import React, { useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';

export function WatchlistModal({ isOpen, onClose }) {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="watchlist-modal-title"
      data-testid="watchlist-modal"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="watchlist-modal-title" className="modal-title">
            My Watchlist ({watchlist.length})
          </h2>
          <button
            id="close-watchlist-modal"
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close watchlist"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {watchlist.length === 0 ? (
            <div className="empty-state">
              <p>Your watchlist is empty.</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                Click "+ Add to Watchlist" on any film card to track it here.
              </p>
            </div>
          ) : (
            <div>
              {watchlist.map((movie) => (
                <div
                  key={movie.id}
                  className="watchlist-item"
                  data-testid={`watchlist-item-${movie.id}`}
                >
                  <div className="watchlist-info">
                    <h4>{movie.title}</h4>
                    <p>
                      {movie.year} • {movie.genre} • ★ {movie.rating.toFixed(1)}
                    </p>
                  </div>
                  <button
                    id={`btn-remove-${movie.id}`}
                    type="button"
                    className="btn-remove"
                    onClick={() => removeFromWatchlist(movie.id)}
                    aria-label={`Remove ${movie.title} from watchlist`}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button
                  type="button"
                  className="btn-reset"
                  onClick={clearWatchlist}
                  style={{ fontSize: '0.8rem' }}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
