'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    size?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number, size?: string) => void;
    updateQuantity: (id: number, size: string | undefined, quantity: number) => void;
    getCartCount: () => number;
    getCartTotal: () => number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { showToast } = useToast();

    // Load from localStorage on mount and listen for storage changes
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCart(JSON.parse(storedCart));
            } catch (error) {
                console.error("Failed to parse cart:", error);
            }
        }

        const handleStorage = (event: StorageEvent) => {
            if (event.key === 'cart') {
                try {
                    setCart(JSON.parse(event.newValue || '[]'));
                } catch (e) { }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        // We only write if the cart state changes. 
        // Note: writing to localStorage does NOT trigger 'storage' event in the same window,
        // so this won't cause an infinite loop with the listener above.
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: CartItem) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                item => item.id === newItem.id && item.size === newItem.size
            );

            // Create a new array to ensure state immutability
            let updatedCart;
            if (existingItemIndex > -1) {
                updatedCart = [...prevCart];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + newItem.quantity
                };
            } else {
                updatedCart = [...prevCart, newItem];
            }
            return updatedCart;
        });
        showToast(`Added ${newItem.name} to cart`, 'success');
    };

    const removeFromCart = (id: number, size?: string) => {
        setCart((prevCart) => {
            const item = prevCart.find(i => i.id === id && i.size === size);
            if (item) showToast(`Removed ${item.name} from cart`, 'info');
            return prevCart.filter((item) => !(item.id === id && item.size === size));
        });
    };

    const updateQuantity = (id: number, size: string | undefined, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.size === size
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartCount, getCartTotal, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
