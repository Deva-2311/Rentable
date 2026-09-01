import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Booking } from '@/types/booking';

interface CreateBookingPayload {
  product: string;
  startDate: string;
  endDate: string;
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const { data } = await apiClient.post<Booking>('/bookings', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'my-bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Booking[] }>('/bookings/my-bookings');
      return data.data;
    },
  });
};

export const useOwnerRequests = () => {
  return useQuery({
    queryKey: ['bookings', 'owner-requests'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Booking[] }>('/bookings/owner/requests');
      return data.data;
    },
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Booking }>(`/bookings/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'accept' | 'reject' | 'cancel' }) => {
      const { data } = await apiClient.patch<{ success: boolean, data: Booking }>(`/bookings/${id}/${action}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

