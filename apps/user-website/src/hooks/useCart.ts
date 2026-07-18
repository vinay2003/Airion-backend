import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { BookingCartItem } from '../context/BookingCartContext';

export interface ServerCartItem {
    id: string;
    itemType: 'BOOKING' | 'MERCHANDISE';
    referenceId: string;
    quantity: number;
    metadata: any;
}

const LOCAL_CART_KEY = 'ease2event_guest_cart';

export const useCart = () => {
    const { user, isAuthenticated } = useAuth(); // Assuming isAuthenticated is available or infer from user
    const isLoggedIn = !!user;
    const queryClient = useQueryClient();

    // Local cart state for guests
    const [localCart, setLocalCart] = useState<ServerCartItem[]>(() => {
        try {
            const stored = localStorage.getItem(LOCAL_CART_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const mergeCart = async () => {
        try {
            const stored = localStorage.getItem(LOCAL_CART_KEY);
            if (stored) {
                const items: ServerCartItem[] = JSON.parse(stored);
                if (items.length > 0) {
                    await api.post('/cart/merge', { 
                        items: items.map(i => ({
                            itemType: i.itemType,
                            referenceId: i.referenceId,
                            quantity: i.quantity,
                            metadata: i.metadata
                        }))
                    });
                    localStorage.removeItem(LOCAL_CART_KEY);
                    setLocalCart([]);
                    queryClient.invalidateQueries({ queryKey: ['cart'] });
                }
            }
        } catch (e) {
            console.error('Failed to merge cart', e);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            const stored = localStorage.getItem(LOCAL_CART_KEY);
            if (stored && JSON.parse(stored).length > 0) {
                mergeCart();
            }
        }
    }, [isLoggedIn]);

    // Server cart queries
    const { data: serverCart, isLoading: serverLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const res = await api.get('/cart');
            return res.data;
        },
        enabled: isLoggedIn,
    });

    const addItemMutation = useMutation({
        mutationFn: async (item: { itemType: 'BOOKING' | 'MERCHANDISE'; referenceId: string; quantity?: number; metadata?: any }) => {
            if (isLoggedIn) {
                const res = await api.post('/cart/items', item);
                return res.data;
            } else {
                // Local state update
                setLocalCart(prev => {
                    const exists = prev.find(i => i.itemType === item.itemType && i.referenceId === item.referenceId);
                    if (exists) {
                        return prev.map(i => i.id === exists.id ? { ...i, quantity: i.quantity + (item.quantity || 1), metadata: { ...i.metadata, ...item.metadata } } : i);
                    }
                    return [...prev, { id: Date.now().toString(), ...item, quantity: item.quantity || 1 }];
                });
                return null;
            }
        },
        onSuccess: () => {
            if (isLoggedIn) queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const removeItemMutation = useMutation({
        mutationFn: async (args: { itemId: string, itemType?: 'BOOKING' | 'MERCHANDISE', referenceId?: string }) => {
            if (isLoggedIn) {
                // To remove from server, we need the cartItem ID (which might be passed, or we find it)
                // Assuming we pass the actual DB ID, or referenceId
                // The backend uses cart_item.id for DELETE. So we need to match it.
                // For simplicity, let's just delete by itemId.
                const res = await api.delete(`/cart/items/${args.itemId}`);
                return res.data;
            } else {
                setLocalCart(prev => prev.filter(i => i.id !== args.itemId && i.referenceId !== args.referenceId));
                return null;
            }
        },
        onSuccess: () => {
            if (isLoggedIn) queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const clearCartMutation = useMutation({
        mutationFn: async () => {
            if (isLoggedIn) {
                const res = await api.delete('/cart');
                return res.data;
            } else {
                setLocalCart([]);
                return null;
            }
        },
        onSuccess: () => {
            if (isLoggedIn) queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const updateItemMutation = useMutation({
        mutationFn: async (args: { itemId: string, quantity: number }) => {
            if (isLoggedIn) {
                const res = await api.put(`/cart/items/${args.itemId}`, { quantity: args.quantity });
                return res.data;
            } else {
                setLocalCart(prev => prev.map(i => i.id === args.itemId ? { ...i, quantity: args.quantity } : i));
                return null;
            }
        },
        onSuccess: () => {
            if (isLoggedIn) queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const cart = isLoggedIn ? (serverCart?.items || []) : localCart;

    return {
        cart,
        isLoading: isLoggedIn ? serverLoading : false,
        addItem: addItemMutation.mutateAsync,
        updateItem: updateItemMutation.mutateAsync,
        removeItem: removeItemMutation.mutateAsync,
        clearCart: clearCartMutation.mutateAsync,
        mergeCart,
    };
};
