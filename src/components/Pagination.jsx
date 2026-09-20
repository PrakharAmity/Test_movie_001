import React from 'react';

export function Pagination({ currentPage, totalPages, onPageChange, hasPrev, hasNext }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination-container" aria-label="Pagination Navigation">
      <button
        id="pagination-prev"
        type="button"
        className="page-btn"
        disabled={!hasPrev}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Go to previous page"
      >
        ← Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          id={`pagination-page-${p}`}
          type="button"
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        id="pagination-next"
        type="button"
        className="page-btn"
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Go to next page"
      >
        Next →
      </button>
    </nav>
  );
}
