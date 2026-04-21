import { api } from '@ease2event/shared';

export default api;

<<<<<<< HEAD
export const fetchWalletOverview = async () => (await api.get('/wallet/overview')).data;
export const requestWithdrawal = async (amount: number, bankDetails?: any) => (await api.post('/wallet/withdraw', { amount, bankDetails })).data;
export const fetchVendorPerformance = async (vId: string, days: number = 7) => (await api.get(`/analytics/vendor/${vId}/performance`, { params: { days } })).data;
export const fetchVendorSchedule = async (vId: string) => (await api.get(`/availability/vendor/${vId}`)).data;
export const blockDate = async (date: string, reason?: string) => (await api.post('/availability/block', { date, reason })).data;
export const unblockDate = async (date: string) => (await api.delete(`/availability/block/${date}`)).data;
export const generateEasyReply = async (inquiry: string, voice?: string) => (await api.post('/ai/easy-reply', { inquiry, voice })).data;
export const uploadImage = async (file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return (await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
=======
// AI & Chat
export const generateEasyReply = async (inquiry: string, voice?: string) => 
    (await api.post('/ai/easy-reply', { inquiry, voice }));

// Analytics & Performance
export const fetchVendorPerformance = async (vendorId: string, days: number = 7) => 
    (await api.get(`/analytics/vendor/${vendorId}/performance`, { params: { days } }));

// Wallet & Financials
export const fetchWalletOverview = async () => 
    (await api.get('/wallet/overview'));

export const requestWithdrawal = async (amount: number, bankDetails?: any) => 
    (await api.post('/wallet/withdraw', { amount, bankDetails }));

// Availability & Calendar
export const fetchVendorSchedule = async (vendorId: string) => 
    (await api.get(`/availability/vendor/${vendorId}`));

export const blockDate = async (date: string, reason?: string) => 
    (await api.post('/availability/block', { date, reason }));

export const unblockDate = async (date: string) => 
    (await api.delete(`/availability/block/${date}`));

// Profile & Public
export const updateProfile = async (data: any) => 
    (await api.patch('/auth/profile', data));

export const uploadImage = async (file: File) => {
    const fd = new FormData(); 
    fd.append('file', file);
    return (await api.post('/uploads/image', fd, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
    }));
>>>>>>> 82555b1fe5e23add49389357020b304e7f63fef5
};
