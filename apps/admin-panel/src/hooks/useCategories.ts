import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

// Categories
export const useAdminCategories = () => {
    return useQuery({
        queryKey: ['adminCategories'],
        queryFn: async () => {
            const { data } = await authApi.get('/admin/categories');
            return data;
        },
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryData: any) => {
            const { data } = await authApi.post('/admin/categories', categoryData);
            return data;
        },
        onSuccess: () => {
            toast.success('Category created successfully');
            queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
        },
        onError: () => {
            toast.error('Failed to create category');
        }
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await authApi.patch(`/admin/categories/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Category updated successfully');
            queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
        },
        onError: () => {
            toast.error('Failed to update category');
        }
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await authApi.post(`/admin/categories/${id}/delete`);
            return data;
        },
        onSuccess: () => {
            toast.success('Category deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
        },
        onError: () => {
            toast.error('Failed to delete category');
        }
    });
};

// Locations
export const useAdminLocations = () => {
    return useQuery({
        queryKey: ['adminLocations'],
        queryFn: async () => {
            const { data } = await authApi.get('/admin/locations');
            return data;
        },
    });
};

export const useCreateLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (locationData: any) => {
            const { data } = await authApi.post('/admin/locations', locationData);
            return data;
        },
        onSuccess: () => {
            toast.success('Location created successfully');
            queryClient.invalidateQueries({ queryKey: ['adminLocations'] });
        },
        onError: () => {
            toast.error('Failed to create location');
        }
    });
};

export const useUpdateLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await authApi.patch(`/admin/locations/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Location updated successfully');
            queryClient.invalidateQueries({ queryKey: ['adminLocations'] });
        },
        onError: () => {
            toast.error('Failed to update location');
        }
    });
};

export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await authApi.post(`/admin/locations/${id}/delete`);
            return data;
        },
        onSuccess: () => {
            toast.success('Location deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['adminLocations'] });
        },
        onError: () => {
            toast.error('Failed to delete location');
        }
    });
};
