/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum GenreApiRoutes {
  // Public routes
  LIST = '/catalog/genres',
  GET = '/catalog/genres/:genreId',

  // Admin routes (same URLs, different HTTP methods)
  ADMIN_LIST = '/admin/catalog/genres',
  ADMIN_CREATE = '/admin/catalog/genres',
  ADMIN_UPDATE = '/admin/catalog/genres/:genreId',
  ADMIN_DELETE = '/admin/catalog/genres/:genreId',
}