/**
 * Calculates pagination metadata and returns items for the current page
 * @param {Array} items - Full list of items
 * @param {number} page - Current page (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @returns {{
 *   items: Array,
 *   currentPage: number,
 *   totalPages: number,
 *   totalItems: number,
 *   hasNext: boolean,
 *   hasPrev: boolean
 * }}
 */
export function paginate(items = [], page = 1, pageSize = 6) {
  const safePageSize = Math.max(1, pageSize);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * safePageSize;

  // BUG 2: End index is calculated with '- 1', treating slice as inclusive.
  // In JavaScript Array.prototype.slice(start, end), end is exclusive,
  // causing the last item of each page to be cut off and skipped.
  const endIndex = startIndex + safePageSize - 1;

  const pageItems = items.slice(startIndex, endIndex);

  return {
    items: pageItems,
    currentPage,
    totalPages,
    totalItems,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}
