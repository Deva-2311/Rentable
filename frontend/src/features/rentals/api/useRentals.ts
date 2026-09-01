import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Booking } from '@/types/booking'; // Rentals are bookings under the hood with ACTIVE/COMPLETED status

export const useActiveRentals = () => {
  return useQuery({
    queryKey: ['rentals', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Booking[] }>('/rentals/active');
      return data.data;
    },
  });
};

export const useRentalHistory = () => {
  return useQuery({
    queryKey: ['rentals', 'history'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Booking[] }>('/rentals/history');
      return data.data;
    },
  });
};

export const useRequestReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post<{ success: boolean, data: Booking }>(`/rentals/${id}/return-request`);
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
      const { data } = await apiClient.patch<{ success: boolean, data: Booking }>(`/rentals/${id}/complete`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
  });
};
