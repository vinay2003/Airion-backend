import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

export const useAdminTickets = () => {
    return useQuery({
        queryKey: ['adminTickets'],
        queryFn: async () => {
            const { data } = await authApi.get('/admin/tickets');
            return data;
        },
    });
};

export const useUpdateTicketStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data } = await authApi.patch(`/admin/tickets/${id}/status`, { status });
            return data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Ticket marked as ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
        },
        onError: () => {
            toast.error('Failed to update ticket status');
        }
    });
};

export const useReplyToTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
            const { data } = await authApi.post(`/admin/tickets/${id}/reply`, { reply });
            return data;
        },
        onSuccess: () => {
            toast.success('Reply sent successfully');
            queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
        },
        onError: () => {
            toast.error('Failed to send reply');
        }
    });
};
