import { useState, useCallback } from 'react';
import { filterMovies, getAllMovies } from '../services/movieService';

export function useMovieSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const executeSearch = useCallback(async (searchQuery, dataset = getAllMovies()) => {
    setIsLoading(true);
    setError(null);

    try {
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
    setIsLoading,
    error,
    setError,
    searchResults,
    executeSearch,
    resetSearch
  };
}
