import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
    const [cartItems, setCartItems] = useState<BookingCartItem[]>([]);

    const addToCart = useCallback((item: BookingCartItem) => {
        setCartItems(prev => {
            const exists = prev.find(i => i.vendorId === item.vendorId);
            if (exists) {
                return prev.map(i => i.vendorId === item.vendorId ? { ...i, ...item } : i);
            }
            return [...prev, item];
        });
    }, []);

    const removeFromCart = useCallback((vendorId: string) => {
        setCartItems(prev => prev.filter(i => i.vendorId !== vendorId));
    }, []);

    const updateCartItem = useCallback((vendorId: string, updates: Partial<BookingCartItem>) => {
        setCartItems(prev => prev.map(i => i.vendorId === vendorId ? { ...i, ...updates } : i));
    }, []);

    const clearCart = useCallback(() => setCartItems([]), []);

    const isInCart = useCallback((vendorId: string) => cartItems.some(i => i.vendorId === vendorId), [cartItems]);

    const cartTotal = cartItems.reduce((sum, item) => {
        const addonsTotal = item.selectedAddons.reduce((a, b) => a + b.price, 0);
        return sum + item.packagePrice + addonsTotal;
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
