import { describe, it, expect } from 'vitest';
import { filterMovies, getAllMovies } from '../src/services/movieService';

describe('Bug 1: Release Year Upper Boundary Filter', () => {
  const sampleMovies = [
    { id: '1', title: 'Film 2022', year: 2022, rating: 8.0, genre: 'Action' },
    { id: '2', title: 'Film 2023', year: 2023, rating: 8.5, genre: 'Drama' },
    { id: '3', title: 'Film 2024 A', year: 2024, rating: 8.7, genre: 'Sci-Fi' },
    { id: '4', title: 'Film 2024 B', year: 2024, rating: 7.9, genre: 'Action' },
    { id: '5', title: 'Film 2025', year: 2025, rating: 7.5, genre: 'Comedy' }
  ];

  it('includes movies released in the specified maxYear boundary', () => {
    // When filtering up to 2024, films released in 2024 should be included
    const results = filterMovies(sampleMovies, {
      minYear: 2022,
      maxYear: 2024
    });

    const titles = results.map((m) => m.title);

    expect(titles).toContain('Film 2022');
    expect(titles).toContain('Film 2023');
    expect(titles).toContain('Film 2024 A');
    expect(titles).toContain('Film 2024 B');
    expect(titles).not.toContain('Film 2025');
  });

  it('includes current-year 2024 releases from the dataset when maxYear is set to 2024', () => {
    const dataset = getAllMovies();
    const filtered = filterMovies(dataset, { minYear: 2020, maxYear: 2024 });

    const dunePartTwo = filtered.find((m) => m.title === 'Dune: Part Two');
    expect(dunePartTwo).toBeDefined();
    expect(dunePartTwo?.year).toBe(2024);

    const year2024Count = filtered.filter((m) => m.year === 2024).length;
    expect(year2024Count).toBeGreaterThanOrEqual(3);
  });
});
