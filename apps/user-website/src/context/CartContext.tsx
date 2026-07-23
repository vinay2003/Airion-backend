import React, { createContext, useContext, useState, useMemo } from 'react';
import { useCart as useServerCart } from '../hooks/useCart';

export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    vendorId?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { cart, addItem, updateItem, removeItem, clearCart: apiClearCart } = useServerCart();
    
    const [isCartOpen, setIsCartOpen] = useState(false);

    const items: CartItem[] = useMemo(() => {
        return cart
            .filter((c: any) => c.itemType === 'MERCHANDISE')
            .map((c: any) => ({
                ...(c.metadata as Product),
                quantity: c.quantity,
                cartItemId: c.id // internal use if needed
            }));
    }, [cart]);

    const addToCart = async (product: Product, quantity = 1) => {
        await addItem({
            itemType: 'MERCHANDISE',
            referenceId: product.id,
            quantity: quantity,
            metadata: product
        });
    };

    const removeFromCart = async (id: string) => {
        const cartItem = cart.find((c: any) => c.itemType === 'MERCHANDISE' && c.referenceId === id);
        if (cartItem) {
            await removeItem({ itemId: cartItem.id, itemType: 'MERCHANDISE', referenceId: id });
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) return removeFromCart(id);
        
        const cartItem = cart.find((c: any) => c.itemType === 'MERCHANDISE' && c.referenceId === id);
        if (cartItem) {
            if (updateItem) {
                // If the backend has updateItem
                await updateItem({ itemId: cartItem.id, quantity });
            } else {
                // Fallback for our unified hook, we might just re-add which isn't perfect for setting absolute qty.
                // Wait, useCart exposes updateItem! Let me verify. Yes, it does.
                await updateItem({ itemId: cartItem.id, quantity });
            }
        }
    };

    const clearCart = async () => {
        // Technically clearCart in API clears BOTH bookings and merch.
        // For CartContext, maybe just removing all merch items is better?
        // Let's just remove all MERCHANDISE items one by one or clear the whole cart.
        const merchItems = cart.filter((c: any) => c.itemType === 'MERCHANDISE');
        for (const item of merchItems) {
            await removeItem({ itemId: item.id, itemType: 'MERCHANDISE', referenceId: item.referenceId });
        }
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, updateQuantity, clearCart,
            totalItems, totalPrice, isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
