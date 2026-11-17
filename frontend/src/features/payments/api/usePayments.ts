import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

interface CreateOrderPayload {
  bookingId: string;
}

interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const { data } = await apiClient.post('/payments/create-order', payload);
      return data;
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: VerifyPaymentPayload) => {
      const { data } = await apiClient.post('/payments/verify', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
