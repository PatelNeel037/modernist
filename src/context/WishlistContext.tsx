'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { DB } from '@/services/db';

// Define the shape of a wishlist item. We'll store basic info to avoid complex lookups.
interface WishlistItem {
    id: number;
    name: string;
    price: number | string; // Handle both types
    image: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: number) => void;
    isInWishlist: (id: number) => boolean;
    getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const { showToast } = useToast();
    const { user } = useAuth();

    // Load wishlist on mount or user change
    useEffect(() => {
        setWishlist(DB.getWishlist());
    }, [user]); // user dependency ensures we reload when switching users

    // Sync across tabs
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            // Only update if the key matches current user's wishlist
            const userId = user ? user.id : null;
            const key = userId ? `modernist_wishlist_${userId}` : 'modernist_wishlist_guest';

            if (e.key === key) {
                setWishlist(DB.getWishlist());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [user]);

    const addToWishlist = (item: WishlistItem) => {
        const isAlreadyInWishlist = wishlist.some((i) => i.id === item.id);

        if (isAlreadyInWishlist) {
            showToast("Item already in wishlist", 'info');
            return;
        }

        const newWishlist = [...wishlist, item];
        setWishlist(newWishlist);
        DB.saveWishlist(newWishlist);
        showToast("Added to wishlist", 'success');
    };

    const removeFromWishlist = (id: number) => {
        const newWishlist = wishlist.filter((item) => item.id !== id);
        setWishlist(newWishlist);
        DB.saveWishlist(newWishlist);
        showToast("Removed from wishlist", 'info');
    };

    const isInWishlist = (id: number) => {
        return wishlist.some((item) => item.id === id);
    };

    const getWishlistCount = () => {
        return wishlist.length;
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
