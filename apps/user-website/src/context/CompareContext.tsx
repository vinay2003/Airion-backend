import React, { createContext, useContext, useState } from 'react';
import type { Event } from '../types';

interface CompareContextType {
    compareList: Event[];
    addToCompare: (vendor: Event) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [compareList, setCompareList] = useState<Event[]>([]);

    const addToCompare = (vendor: Event) => {
        setCompareList(prev => {
            if (prev.find(v => v.id === vendor.id)) return prev;
            if (prev.length >= 3) {
                // Max 3 for side-by-side
                return [...prev.slice(1), vendor];
            }
            return [...prev, vendor];
        });
    };

    const removeFromCompare = (id: string) => {
        setCompareList(prev => prev.filter(v => v.id !== id));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    const isInCompare = (id: string) => {
        return compareList.some(v => v.id === id);
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};
