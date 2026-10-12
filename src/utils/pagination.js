export function paginate(items = [], page = 1, pageSize = 6) {
  const safePageSize = Math.max(1, pageSize);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * safePageSize;

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
