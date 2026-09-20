import React from 'react';

const GENRES = ['ALL', 'Sci-Fi', 'Action', 'Drama', 'Animation', 'Crime', 'Comedy'];

export function FilterBar({ filters, onFilterChange, onReset }) {
  return (
    <div className="filter-panel" role="region" aria-label="Movie filters">
      {/* Genre Filter */}
      <div className="filter-group">
        <label htmlFor="filter-genre" className="filter-label">Genre</label>
        <select
          id="filter-genre"
          className="select-dropdown"
          value={filters.genre}
          onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g === 'ALL' ? 'All Genres' : g}
            </option>
          ))}
        </select>
      </div>

      {/* Min Rating Filter */}
      <div className="filter-group">
        <label htmlFor="filter-rating" className="filter-label">Min Rating</label>
        <select
          id="filter-rating"
          className="select-dropdown"
          value={filters.minRating}
          onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
        >
          <option value={0}>Any Rating</option>
          <option value={7.5}>★ 7.5+</option>
          <option value={8.0}>★ 8.0+</option>
          <option value={8.5}>★ 8.5+</option>
          <option value={9.0}>★ 9.0+</option>
        </select>
      </div>

      {/* Release Year Range Filter */}
      <div className="filter-group">
        <span className="filter-label">Year Range</span>
        <div className="year-input-group">
          <input
            id="filter-min-year"
            type="number"
            className="year-input"
            aria-label="Minimum release year"
            value={filters.minYear}
            min={1970}
            max={2025}
            onChange={(e) => onFilterChange({ ...filters, minYear: Number(e.target.value) })}
          />
          <span style={{ color: 'var(--text-tertiary)' }}>to</span>
          <input
            id="filter-max-year"
            type="number"
            className="year-input"
            aria-label="Maximum release year"
            value={filters.maxYear}
            min={1970}
            max={2025}
            onChange={(e) => onFilterChange({ ...filters, maxYear: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Sort Selector */}
      <div className="filter-group">
        <label htmlFor="filter-sort" className="filter-label">Sort By</label>
        <select
          id="filter-sort"
          className="select-dropdown"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
        >
          <option value="rating-desc">Rating: Highest First</option>
          <option value="rating-asc">Rating: Lowest First</option>
          <option value="year-desc">Year: Newest First</option>
          <option value="year-asc">Year: Oldest First</option>
          <option value="title-asc">Title: A to Z</option>
        </select>
      </div>

      {/* Reset */}
      <button
        id="btn-reset-filters"
        type="button"
        className="btn-reset"
        onClick={onReset}
      >
        Reset Filters
      </button>
    </div>
  );
}
