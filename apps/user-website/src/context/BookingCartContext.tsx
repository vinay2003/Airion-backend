import React, { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import { useCart } from '../hooks/useCart';

export interface BookingAddon {
    id: string;
    name: string;
    price: number;
}

export interface BookingCartItem {
    vendorId: string;
    vendorName: string;
    vendorImage: string;
    vendorCategory: string;
    vendorCity: string;
    eventDate: string;
    eventTime: string;
    guestCount: string;
    occasion: string;
    selectedPackage: string;
    packagePrice: number;
    selectedAddons: BookingAddon[];
    specialInstructions: string;
    // Add-on services (makeup, DJ, etc.)
    addOnServices: string[];
}

interface BookingCartContextType {
    cartItems: BookingCartItem[];
    addToCart: (item: BookingCartItem) => void;
    removeFromCart: (vendorId: string) => void;
    updateCartItem: (vendorId: string, updates: Partial<BookingCartItem>) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isInCart: (vendorId: string) => boolean;
}

const BookingCartContext = createContext<BookingCartContextType | undefined>(undefined);

export const BookingCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { cart, addItem, removeItem, clearCart: apiClearCart } = useCart();

    const cartItems: BookingCartItem[] = useMemo(() => {
        return cart
            .filter((c: any) => c.itemType === 'BOOKING')
            .map((c: any) => c.metadata as BookingCartItem);
    }, [cart]);

    const addToCart = useCallback(async (item: BookingCartItem) => {
        await addItem({
            itemType: 'BOOKING',
            referenceId: item.vendorId,
            quantity: 1,
            metadata: item
        });
    }, [addItem]);

    const removeFromCart = useCallback(async (vendorId: string) => {
        const cartItem = cart.find((c: any) => c.itemType === 'BOOKING' && c.referenceId === vendorId);
        if (cartItem) {
            await removeItem({ itemId: cartItem.id, itemType: 'BOOKING', referenceId: vendorId });
        }
    }, [cart, removeItem]);

    const updateCartItem = useCallback(async (vendorId: string, updates: Partial<BookingCartItem>) => {
        const cartItem = cart.find((c: any) => c.itemType === 'BOOKING' && c.referenceId === vendorId);
        if (cartItem) {
            await addItem({
                itemType: 'BOOKING',
                referenceId: vendorId,
                quantity: 0, // indicates update if backend supports it, but our backend merges metadata in addItem!
                metadata: updates
            });
        }
    }, [cart, addItem]);

    const clearCart = useCallback(async () => {
        await apiClearCart();
    }, [apiClearCart]);

    const isInCart = useCallback((vendorId: string) => cartItems.some(i => i.vendorId === vendorId), [cartItems]);

    const cartTotal = cartItems.reduce((sum, item) => {
        const addonsTotal = item.selectedAddons?.reduce((a, b) => a + b.price, 0) || 0;
        return sum + (item.packagePrice || 0) + addonsTotal;
    }, 0);

    const cartCount = cartItems.length;

    return (
        <BookingCartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateCartItem,
            clearCart,
            cartTotal,
            cartCount,
            isInCart,
        }}>
            {children}
        </BookingCartContext.Provider>
    );
};

export const useBookingCart = (): BookingCartContextType => {
    const ctx = useContext(BookingCartContext);
    if (!ctx) throw new Error('useBookingCart must be used within BookingCartProvider');
    return ctx;
};
