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
      // Ignore localStorage errors in restricted test environments
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
      // BUG 3: Developer used indexOf(movieId) on an array of movie objects.
      // Since `prev` contains objects, prev.indexOf(movieId) returns -1.
      // Calling splice(-1, 1) in JavaScript removes the LAST element of the array,
      // deleting the wrong record while leaving the target movie intact.
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
