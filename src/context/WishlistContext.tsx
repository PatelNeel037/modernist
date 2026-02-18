'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

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

    // Load from localStorage on mount (client-side only)
    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setWishlist(JSON.parse(storedWishlist));
            } catch (error) {
                console.error("Failed to parse wishlist:", error);
            }
        }
    }, []);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlist((prev) => {
            if (prev.some((i) => i.id === item.id)) {
                showToast("Item already in wishlist", 'info');
                return prev;
            }
            showToast("Added to wishlist", 'success');
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: number) => {
        setWishlist((prev) => {
            showToast("Removed from wishlist", 'info');
            return prev.filter((item) => item.id !== id);
        });
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
