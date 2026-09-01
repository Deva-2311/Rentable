import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Booking } from '@/types/booking';
import { Product } from '@/types/product';

interface OwnerStats {
  myProducts: number;
  pendingRequests: number;
  activeRentals: number;
  completedRentals: number;
  totalEarnings: number;
}

export const useOwnerStats = () => {
  return useQuery({
    queryKey: ['owner', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: OwnerStats }>('/owner/stats');
      return data.data;
    },
  });
};

export const useOwnerBookings = () => {
  return useQuery({
    queryKey: ['owner', 'bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Booking[] }>('/owner/bookings');
      return data.data;
    },
  });
};

export const useOwnerProducts = () => {
  return useQuery({
    queryKey: ['owner', 'products'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Product[] }>('/owner/products');
      return data.data;
    },
  });
};
