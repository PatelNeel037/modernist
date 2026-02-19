'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DB } from '@/services/db';

interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    isDefault?: boolean;
}

interface User {
    id?: string | number;
    name: string;
    email: string;
    role?: string;
    addresses?: Address[];
    isVerified?: boolean;
    isActive?: boolean;
    twoFactorEnabled?: boolean;
    notifications?: {
        orderUpdates: boolean;
        promotions: boolean;
        newArrivals: boolean;
        email: boolean;
        sms: boolean;
    };
    theme?: 'light' | 'dark';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    addAddress: (address: Address) => void;
    updateAddress: (address: Address) => void;
    deleteAddress: (id: string) => void;
    updateUser: (updates: Partial<User>) => void;
    changePassword: (current: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ... (Init effect remains same)
    useEffect(() => {
        const currentUser = DB.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setIsLoading(false);
    }, []);
    // ...

    // ... (login/register remains same)
    const login = async (email: string, password: string) => {
        const result = await DB.login(email, password);
        if (result.success) {
            const currentUser = DB.getCurrentUser();
            setUser(currentUser);
            localStorage.setItem('modernist_token', 'mock-token-' + Date.now());
            return { success: true, message: 'Login successful!' };
        } else {
            return { success: false, message: result.message || 'Login failed' };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const result = await DB.register(name, email, password);
        if (result.success) {
            if (result.requireVerification) {
                return { success: true, message: result.message || 'Please verify your email.' };
            }
            const currentUser = DB.getCurrentUser();
            setUser(currentUser);
            return { success: true, message: 'Account created successfully!' };
        } else {
            return { success: false, message: result.message || 'Registration failed' };
        }
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        DB.updateCurrentUser(updatedUser);
        DB.updateProfile(updatedUser);
    };

    // ... (Address methods remain same, just ensure they are included in Provider value)
    const addAddress = (address: Address) => {
        if (!user) return;

        let currentAddresses = user.addresses || [];
        let newAddress = { ...address };

        if (currentAddresses.length === 0) {
            newAddress.isDefault = true;
        }

        if (newAddress.isDefault) {
            currentAddresses = currentAddresses.map(a => ({ ...a, isDefault: false }));
        }

        const updatedUser = { ...user, addresses: [...currentAddresses, newAddress] };
        setUser(updatedUser);
        DB.updateCurrentUser(updatedUser);
        DB.updateProfile(updatedUser);
    };

    const updateAddress = (updatedAddress: Address) => {
        if (!user || !user.addresses) return;

        let updatedAddresses = user.addresses.map(addr => {
            if (addr.id === updatedAddress.id) return updatedAddress;
            if (updatedAddress.isDefault) return { ...addr, isDefault: false };
            return addr;
        });

        if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
            updatedAddresses[0] = { ...updatedAddresses[0], isDefault: true };
        }

        const updatedUser = { ...user, addresses: updatedAddresses };
        setUser(updatedUser);
        DB.updateCurrentUser(updatedUser);
        DB.updateProfile(updatedUser);
    };

    const deleteAddress = (addressId: string) => {
        if (!user || !user.addresses) return;
        let updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);

        if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
            updatedAddresses[0] = { ...updatedAddresses[0], isDefault: true };
        }

        const updatedUser = { ...user, addresses: updatedAddresses };
        setUser(updatedUser);
        DB.updateCurrentUser(updatedUser);
        DB.updateProfile(updatedUser);
    };

    const changePassword = async (current: string, newPass: string) => {
        if (!user) return { success: false, message: 'Not logged in' };
        return await DB.changePassword(user.email, current, newPass);
    };

    const logout = () => {
        DB.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, addAddress, updateAddress, deleteAddress, updateUser, changePassword, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
