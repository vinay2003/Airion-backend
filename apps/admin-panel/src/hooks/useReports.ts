import { useQuery } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';

export const useAdminReports = (timeRange: string) => {
    return useQuery({
        queryKey: ['adminReports', timeRange],
        queryFn: async () => {
            const { data } = await authApi.get(`/admin/reports?timeRange=${timeRange}`);
            return data;
        },
    });
};
