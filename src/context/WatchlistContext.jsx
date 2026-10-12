import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext(null);

const STORAGE_KEY = 'cinepulse_watchlist';

export function WatchlistProvider({ children, initialItems = [] }) {
  const [watchlist, setWatchlist] = useState(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch {
    }
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => {
      const index = prev.indexOf(movieId);
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
