import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export interface DisputeItem {
  _id: string;
  booking: {
    _id: string;
    bookingId?: string;
    startDate?: string;
    endDate?: string;
    rentalAmount?: number;
  } | string;
  openedBy: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    avatar?: string;
  } | string;
  targetUser: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    avatar?: string;
  } | string;
  product: {
    _id: string;
    name: string;
    images?: string[];
    pricePerDay?: number;
    securityDeposit?: number;
  } | string;
  reason: string;
  description: string;
  status: 'OPENED' | 'UNDER_REVIEW' | 'EVIDENCE_REQUESTED' | 'MEDIATION' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
  evidenceUrls: string[];
  assignedAdmin?: any;
  resolution?: {
    action: string;
    amount?: number;
    reason: string;
    resolvedAt: string;
    resolvedBy?: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDisputePayload {
  bookingId: string;
  reason: string;
  description: string;
  evidenceUrls?: string[];
}

export const useDisputes = () => {
  return useQuery({
    queryKey: ['disputes'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: DisputeItem[] }>('/disputes');
      return data.data;
    },
  });
};

export const useDispute = (id: string) => {
  return useQuery({
    queryKey: ['disputes', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: DisputeItem }>(`/disputes/${id}`);
      return data.data;
    },
    enabled: Boolean(id),
  });
};

export const useCreateDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDisputePayload) => {
      const { data } = await apiClient.post<{ success: boolean; message: string; data: DisputeItem }>(
        '/disputes',
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
};
