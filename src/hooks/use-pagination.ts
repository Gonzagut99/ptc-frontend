import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  size: number;
}

interface UsePaginationReturn {
  page: number;
  size: number;
  setPagination: (page: number, size: number) => void;
  resetPagination: () => void;
}

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;

export function usePagination(
  initialPage: number = DEFAULT_PAGE,
  initialSize: number = DEFAULT_SIZE
): UsePaginationReturn {
  const [pagination, setPaginationState] = useState<PaginationState>({
    page: initialPage,
    size: initialSize,
  });

  const setPagination = useCallback((page: number, size: number) => {
    setPaginationState({ page, size });
  }, []);

  const resetPagination = useCallback(() => {
    setPaginationState({ page: DEFAULT_PAGE, size: DEFAULT_SIZE });
  }, []);

  return {
    page: pagination.page,
    size: pagination.size,
    setPagination,
    resetPagination,
  };
}
