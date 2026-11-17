import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Product } from '@/types/product';

interface FetchProductsParams {
  search?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export const useProducts = (params?: FetchProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Product[], pagination?: { total: number, page: number, totalPages: number } }>('/products', {
        params,
      });
      return {
        products: data.data || [],
        total: data.pagination?.total || 0,
        page: data.pagination?.page || 1,
        pages: data.pagination?.totalPages || 1,
      };
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Product }>(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useMyProducts = () => {
  return useQuery({
    queryKey: ['products', 'my-products'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Product[] }>('/products/my-products');
      return data.data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      const { data } = await apiClient.post<{ success: boolean, data: Product }>('/products', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: Partial<Product> }) => {
      const { data } = await apiClient.patch<{ success: boolean, data: Product }>(`/products/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

