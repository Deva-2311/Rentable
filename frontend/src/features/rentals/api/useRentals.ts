import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Rental } from '@/types/rental';

export const useAllRentals = () => {
  return useQuery({
    queryKey: ['rentals', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Rental[] }>('/rentals');
      return data.data;
    },
  });
};

export const useActiveRentals = () => {
  return useQuery({
    queryKey: ['rentals', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Rental[] }>('/rentals/active');
      return data.data;
    },
  });
};

export const useRentalHistory = () => {
  return useQuery({
    queryKey: ['rentals', 'history'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Rental[] }>('/rentals/history');
      return data.data;
    },
  });
};

export const useRental = (id: string) => {
  return useQuery({
    queryKey: ['rentals', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Rental }>(`/rentals/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useRequestReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post<{ success: boolean, data: Rental }>(`/rentals/${id}/return-request`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
  });
};

export const useCompleteRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ success: boolean, data: Rental }>(`/rentals/${id}/complete`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
  });
};
