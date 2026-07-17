import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Event } from '../types';

interface RecentlyViewedContextType {
    recentlyViewed: Event[];
    addRecentlyViewed: (vendor: Event) => void;
    clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [recentlyViewed, setRecentlyViewed] = useState<Event[]>(() => {
        const saved = localStorage.getItem('ease2event_recently_viewed');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('ease2event_recently_viewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    const addRecentlyViewed = (vendor: Event) => {
        setRecentlyViewed(prev => {
            const filtered = prev.filter(v => v.id !== vendor.id);
            return [vendor, ...filtered].slice(0, 10); // Keep max 10
        });
    };

    const clearRecentlyViewed = () => {
        setRecentlyViewed([]);
    };

    return (
        <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
};

export const useRecentlyViewed = () => {
    const context = useContext(RecentlyViewedContext);
    if (context === undefined) {
        throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
    }
    return context;
};
