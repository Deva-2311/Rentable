import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Product } from '@/types/product';

export const useAdminPendingProducts = () => {
  return useQuery({
    queryKey: ['admin-products', 'pending'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Product[] }>('/admin/products/pending');
      return data.data || [];
    },
  });
};

export const useAdminApproveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ success: boolean, data: Product }>(`/admin/products/${id}/approve`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useAdminRejectProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason: string }) => {
      const { data } = await apiClient.patch<{ success: boolean, data: Product }>(`/admin/products/${id}/reject`, { reason });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
