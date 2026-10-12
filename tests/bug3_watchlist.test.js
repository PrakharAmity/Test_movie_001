import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WatchlistProvider, useWatchlist } from '../src/context/WatchlistContext';

describe('Bug 3: Watchlist Deletion State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const sampleWatchlist = [
    { id: 'm-01', title: 'Dune: Part Two', year: 2024 },
    { id: 'm-02', title: 'Oppenheimer', year: 2023 },
    { id: 'm-03', title: 'Interstellar', year: 2014 }
  ];

  it('removes the selected movie by its ID without purging the last record in the list', () => {
    const { result } = renderHook(() => useWatchlist(), {
      wrapper: ({ children }) =>
        React.createElement(WatchlistProvider, { initialItems: sampleWatchlist }, children)
    });

    act(() => {
      result.current.removeFromWatchlist('m-01');
    });

    const remainingIds = result.current.watchlist.map((m) => m.id);

    expect(remainingIds).not.toContain('m-01');

    expect(remainingIds).toContain('m-02');
    expect(remainingIds).toContain('m-03');
    expect(result.current.watchlist).toHaveLength(2);
  });

  it('removes a middle record accurately without mutating unrelated entries', () => {
    const { result } = renderHook(() => useWatchlist(), {
      wrapper: ({ children }) =>
        React.createElement(WatchlistProvider, { initialItems: sampleWatchlist }, children)
    });

    act(() => {
      result.current.removeFromWatchlist('m-02');
    });

    const remainingIds = result.current.watchlist.map((m) => m.id);

    expect(remainingIds).not.toContain('m-02');
    expect(remainingIds).toContain('m-01');
    expect(remainingIds).toContain('m-03');
    expect(result.current.watchlist).toHaveLength(2);
  });
});
