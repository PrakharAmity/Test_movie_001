import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMovieSearch } from '../src/hooks/useMovieSearch';

describe('Bug 4: Search Loading State Reset On Error', () => {
  it('resets isLoading to false when search query throws an error', async () => {
    const { result } = renderHook(() => useMovieSearch());

    await act(async () => {
      await result.current.executeSearch('THROW_NETWORK_ERROR');
    });

    expect(result.current.error).toBe('Search service network timeout. Please retry.');

    expect(result.current.isLoading).toBe(false);
  });

  it('allows subsequent searches after a failed query without remaining locked in loading state', async () => {
    const { result } = renderHook(() => useMovieSearch());

    await act(async () => {
      await result.current.executeSearch('__error__query');
    });
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.executeSearch('Inception');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.searchResults.length).toBeGreaterThan(0);
    expect(result.current.searchResults[0].title).toBe('Inception');
  });
});
