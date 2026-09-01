import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Booking } from '@/types/booking';
import { Product } from '@/types/product';
import { User } from '@/types/user';

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalBookings: number;
  activeRentals: number;
  pendingBookings: number;
  totalRevenue: number;
  recentUsers: User[];
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: AdminStats }>('/admin/stats');
      return data.data;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: User[] }>('/admin/users');
      return data.data;
    },
  });
};

export const useAdminBookings = () => {
  return useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Booking[] }>('/admin/bookings');
      return data.data;
    },
  });
};

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean, data: Product[] }>('/admin/products');
      return data.data;
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: { id: string, action: 'suspend' | 'activate' }) => {
      const { data } = await apiClient.patch<{ success: boolean, message: string }>(`/admin/users/${id}/${action}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};
