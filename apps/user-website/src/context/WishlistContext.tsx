import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Event } from '../types';

interface WishlistContextType {
    wishlist: Event[];
    addToWishlist: (vendor: Event) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Event[]>(() => {
        const saved = localStorage.getItem('ease2event_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('ease2event_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (vendor: Event) => {
        setWishlist(prev => {
            if (prev.find(v => v.id === vendor.id)) return prev;
            return [...prev, vendor];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(prev => prev.filter(v => v.id !== id));
    };

    const isInWishlist = (id: string) => {
        return wishlist.some(v => v.id === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
