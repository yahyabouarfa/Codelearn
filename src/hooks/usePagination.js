import { useState, useCallback } from 'react';

/**
 * Custom hook for pagination
 */
export const usePagination = (initialPage = 0, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const nextPage = useCallback(() => {
    setPage(prev => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(prev - 1, 0));
  }, []);

  const goToPage = useCallback((pageNumber) => {
    setPage(Math.max(0, Math.min(pageNumber, totalPages - 1)));
  }, [totalPages]);

  const changeSize = useCallback((newSize) => {
    setSize(newSize);
    setPage(0); // Reset to first page when size changes
  }, []);

  const updatePaginationInfo = useCallback((paginationData) => {
    if (paginationData) {
      setTotalPages(paginationData.totalPages || 0);
      setTotalElements(paginationData.totalElements || 0);
    }
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setSize(initialSize);
    setTotalPages(0);
    setTotalElements(0);
  }, [initialPage, initialSize]);

  return {
    page,
    size,
    totalPages,
    totalElements,
    nextPage,
    prevPage,
    goToPage,
    changeSize,
    updatePaginationInfo,
    reset,
    hasNextPage: page < totalPages - 1,
    hasPrevPage: page > 0,
  };
};

export default usePagination;
