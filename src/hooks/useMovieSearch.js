import { useState, useCallback } from 'react';
import { filterMovies, getAllMovies } from '../services/movieService';

/**
 * Custom hook for searching movies with simulated async latency and error handling
 */
export function useMovieSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const executeSearch = useCallback(async (searchQuery, dataset = getAllMovies()) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate asynchronous query delay / network request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (searchQuery && (searchQuery.includes('__error__') || searchQuery === 'THROW_NETWORK_ERROR')) {
            reject(new Error('Search service network timeout. Please retry.'));
          } else {
            resolve();
          }
        }, 150);
      });

      const matches = filterMovies(dataset, { search: searchQuery });
      setSearchResults(matches);
      setIsLoading(false);
      return matches;
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during search.');
      // BUG 4: Developer omitted `setIsLoading(false)` inside the catch block
      // (or in a `finally` block). When a search fails, `isLoading` remains `true`
      // permanently, leaving the search bar stuck in a loading state.
    }
  }, []);

  const resetSearch = useCallback(() => {
    setQuery('');
    setError(null);
    setIsLoading(false);
    setSearchResults([]);
  }, []);

  return {
    query,
    setQuery,
    isLoading,
    setIsLoading, // exported if candidate needs or for direct test inspection
    error,
    setError,
    searchResults,
    executeSearch,
    resetSearch
  };
}
