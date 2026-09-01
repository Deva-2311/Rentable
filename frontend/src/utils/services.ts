import api from '../utils/api';

export const productsService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get('/products', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get(`/products/${id}`).then((r) => r.data),

  getMyProducts: () =>
    api.get('/products/my-products').then((r) => r.data),

  create: (data: Record<string, unknown>) =>
    api.post('/products', data).then((r) => r.data),

  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/products/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/products/${id}`).then((r) => r.data),
};

export const categoriesService = {
  getAll: () => api.get('/categories').then((r) => r.data),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`).then((r) => r.data),
};

export const bookingsService = {
  create: (data: { product: string; startDate: string; endDate: string }) =>
    api.post('/bookings', data).then((r) => r.data),

  getMyBookings: () => api.get('/bookings/my-bookings').then((r) => r.data),

  getOwnerRequests: () => api.get('/bookings/owner/requests').then((r) => r.data),

  getById: (id: string) => api.get(`/bookings/${id}`).then((r) => r.data),

  accept: (id: string) => api.patch(`/bookings/${id}/accept`).then((r) => r.data),

  reject: (id: string) => api.patch(`/bookings/${id}/reject`).then((r) => r.data),

  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`).then((r) => r.data),
};

export const rentalsService = {
  getActive: () => api.get('/rentals/active').then((r) => r.data),
  getHistory: () => api.get('/rentals/history').then((r) => r.data),
  getById: (id: string) => api.get(`/rentals/${id}`).then((r) => r.data),
  requestReturn: (id: string) => api.post(`/rentals/${id}/return-request`).then((r) => r.data),
  complete: (id: string) => api.patch(`/rentals/${id}/complete`).then((r) => r.data),
};

export const reviewsService = {
  create: (data: { booking: string; product: string; rating: number; comment: string }) =>
    api.post('/reviews', data).then((r) => r.data),

  getByProduct: (productId: string) =>
    api.get(`/reviews/product/${productId}`).then((r) => r.data),
};

export const wishlistService = {
  get: () => api.get('/wishlist').then((r) => r.data),
  add: (productId: string) => api.post(`/wishlist/${productId}`).then((r) => r.data),
  remove: (productId: string) => api.delete(`/wishlist/${productId}`).then((r) => r.data),
};

export const notificationsService = {
  get: () => api.get('/notifications').then((r) => r.data),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),
};

export const ownerService = {
  getStats: () => api.get('/owner/stats').then((r) => r.data),
  getBookings: () => api.get('/owner/bookings').then((r) => r.data),
  getProducts: () => api.get('/owner/products').then((r) => r.data),
};

export const adminService = {
  getStats: () => api.get('/admin/stats').then((r) => r.data),
  getUsers: () => api.get('/admin/users').then((r) => r.data),
  getProducts: () => api.get('/admin/products').then((r) => r.data),
  getBookings: () => api.get('/admin/bookings').then((r) => r.data),
};
