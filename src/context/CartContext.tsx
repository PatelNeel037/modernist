'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { DB } from '@/services/db';

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
    const { user } = useAuth(); // Dependency on Auth to switch carts

    // Load cart when user changes or on mount
    useEffect(() => {
        setCart(DB.getCart());
    }, [user]);

    // Listen for storage events (e.g. from other tabs or DB adapter dispatch)
    useEffect(() => {
        const handleStorage = () => {
            // Reload cart logic handled by checking DB again
            const freshCart = DB.getCart();
            // Optional: deep compare to avoid unnecessary re-renders
            setCart(freshCart);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [user]); // Re-bind if user context changes (affects DB.getCart internal logic)

    // Save to DB (localStorage) whenever cart changes
    useEffect(() => {
        // Prevent writing if the state matches DB (avoids loops)
        const currentDB = JSON.stringify(DB.getCart());
        const currentState = JSON.stringify(cart);

        if (currentDB !== currentState) {
            DB.saveCart(cart);
        }
    }, [cart]); // Removed 'user' dependency to avoid overwriting DB on context switch with stale cart state

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
        const itemToRemove = cart.find(i => i.id === id && i.size === size);
        if (itemToRemove) {
            showToast(`Removed ${itemToRemove.name} from cart`, 'info');
        }
        setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.size === size)));
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
