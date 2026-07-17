import { useQuery } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';

interface DashboardStats {
    users: number;
    vendors: number;
    bookings: number;
    revenue: number;
    advertisementRevenue: number;
    subscriptionRevenue: number;
    commissionRevenue: number;
    charts: {
        revenue: { name: string; adRevenue: number; subRevenue: number; commission: number }[];
    };
    suspiciousLogins: any[];
    pendingApprovals: any[];
}

export const useAdminDashboard = () => {
    return useQuery<DashboardStats>({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            const { data } = await authApi.get('/admin/dashboard');
            return data;
        },
    });
};
