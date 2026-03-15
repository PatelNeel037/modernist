'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { usePathname } from 'next/navigation';
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
    login: (email: string, password: string) => Promise<{ success: boolean; message: string; requireVerification?: boolean }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string; requireVerification?: boolean }>;
    logout: () => void;
    addAddress: (address: Address) => void;
    updateAddress: (address: Address) => void;
    deleteAddress: (id: string) => void;
    updateUser: (updates: Partial<User>, currentEmail?: string) => Promise<{ success: boolean; message: string }> | void;
    deleteAccount: () => Promise<{ success: boolean; message: string }>;
    changePassword: (current: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
    isAuthenticated: boolean;
    isLoading: boolean;
    verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
    resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    const logout = useCallback(() => {
        DB.logout();
        setUser(null);
    }, []);

    const verifyUser = useCallback(async () => {
        const currentUser = DB.getCurrentUser();
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

            try {
                const response = await fetch('/api/auth/me');
                if (response.status === 404 || response.status === 401 || response.status === 403) {
                    // User was deleted, token expired, or account suspended
                    console.warn("User session invalid, deleted, or suspended. Logging out.");
                    logout();
                    window.location.href = '/login?deleted=true';
                } else if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                DB.updateCurrentUser(data.user);
            }
        } catch (error) {
            console.error("Auth verification failed:", error);
            // On network error, keep current local user
            setUser(currentUser);
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    // Verify user on mount and route changes
    useEffect(() => {
        verifyUser();
    }, [verifyUser, pathname]); // Re-verify whenever the URL changes

    // Also verify when tab is focused
    useEffect(() => {
        const handleFocus = () => verifyUser();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [verifyUser]);

    const login = async (email: string, password: string) => {
        const result = await DB.login(email, password);
        if (result.success) {
            const currentUser = DB.getCurrentUser();
            setUser(currentUser);
            return { success: true, message: 'Login successful!' };
        } else {
            return { 
                success: false, 
                message: result.message || 'Login failed',
                requireVerification: (result as any).requireVerification 
            };
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

    const updateUser = async (updates: Partial<User>, currentEmail?: string) => {
        if (!user) return { success: false, message: 'Not logged in' };

        // Pass currentEmail to backend so it knows WHICH user to update, even if updates contains a new email
        const payload = { ...user, ...updates, currentEmail: currentEmail || user.email };

        const result = await DB.updateProfile(payload);

        if (result.success && result.user) {
            setUser(result.user);
            DB.updateCurrentUser(result.user);
            return { success: true, message: 'Profile updated successfully!' };
        } else {
            return { success: false, message: result.message || 'Failed to update profile.' };
        }
    };

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

    const deleteAccount = async () => {
        if (!user || (!user.id && !(user as any)._id)) return { success: false, message: 'Not logged in' };
        
        const userId = user.id || (user as any)._id;
        const result = await DB.deleteProfile(userId);
        
        if (result.success) {
            logout();
            return { success: true, message: 'Account deleted' };
        }
        return { success: false, message: result.message || 'Failed to delete account' };
    };

    const changePassword = async (current: string, newPass: string) => {
        if (!user) return { success: false, message: 'Not logged in' };
        return await DB.changePassword(user.email, current, newPass);
    };

    const verifyEmail = async (email: string, code: string) => {
        const result = await DB.verifyEmail(email, code);
        if (result.success) {
            setUser(result.user);
            return { success: true, message: 'Account verified!' };
        } else {
            return { success: false, message: result.message || 'Verification failed' };
        }
    };

    const resendOTP = async (email: string) => {
        const result = await DB.resendOTP(email);
        return { 
            success: result.success, 
            message: result.message || 'Error resending code' 
        };
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, addAddress, updateAddress, deleteAddress, updateUser, deleteAccount, changePassword, isAuthenticated: !!user, isLoading, verifyEmail, resendOTP }}>
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
