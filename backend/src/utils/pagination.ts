import type { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Extract pagination parameters from request
 */
export const getPaginationParams = (req: Request): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Create pagination metadata
 */
export const createPaginationMeta = (
  totalCount: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Create paginated response
 */
export const createPaginatedResponse = <T>(
  data: T[],
  totalCount: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  return {
    data,
    meta: createPaginationMeta(totalCount, page, limit),
  };
};

/**
 * Sequelize pagination helper
 */
export const getSequelizePagination = (req: Request) => {
  const { limit, offset } = getPaginationParams(req);
  return { limit, offset };
};
