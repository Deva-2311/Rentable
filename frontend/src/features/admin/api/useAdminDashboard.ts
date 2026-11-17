import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/stats');
      return data.data;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/users');
      return data.data || [];
    },
  });
};

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin-products', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/products');
      return data.data || [];
    },
  });
};

export const useAdminToggleProductAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/admin/products/${id}/toggle-availability`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useAdminUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, any> }) => {
      const { data } = await apiClient.patch(`/admin/products/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useAdminBookings = () => {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/bookings');
      return data.data || [];
    },
  });
};

export const useAdminBooking = (id: string) => {
  return useQuery({
    queryKey: ['admin-booking', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/bookings/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useAdminUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
      const { data } = await apiClient.patch(`/admin/bookings/${id}/status`, { status, reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-booking'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });
};

export const useAdminToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'activate' | 'suspend' }) => {
      const { data } = await apiClient.patch(`/admin/users/${id}/${action}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });
};

export const useToggleUserStatus = useAdminToggleUserStatus;

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories');
      return data.data || [];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string; slug?: string }) => {
      const { data } = await apiClient.post('/categories', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { name?: string; slug?: string; description?: string; isActive?: boolean } }) => {
      const { data } = await apiClient.patch(`/categories/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/categories/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });
};

export const useAdminAuditLogs = () => {
  return useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/audit-logs');
      return data.data || [];
    },
  });
};

export const useAdminPayments = () => {
  return useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/payments');
      return data.data || [];
    },
  });
};

export const useAdminReviews = () => {
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/reviews');
      return data.data || [];
    },
  });
};

export const useAdminDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/admin/reviews/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });
};


