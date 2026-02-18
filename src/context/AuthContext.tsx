'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Mock DB Layer (Simulating the user's DB object requirements) ---
const DB = {
    getUsers: () => {
        if (typeof window === 'undefined') return [];
        const users = localStorage.getItem('modernist_users');
        return users ? JSON.parse(users) : [];
    },
    saveUser: (user: any) => {
        const users = DB.getUsers();
        users.push(user);
        localStorage.setItem('modernist_users', JSON.stringify(users));
    },
    getCurrentUser: () => {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('modernist_current_user');
        return user ? JSON.parse(user) : null;
    },
    setCurrentUser: (user: any) => {
        if (user) {
            localStorage.setItem('modernist_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('modernist_current_user');
        }
    }
};

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
    name: string;
    email: string;
    addresses?: Address[];
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    addAddress: (address: Address) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Init: Check for logged in user
    useEffect(() => {
        const currentUser = DB.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const login = async (email: string, password: string) => {
        // Mock DB Login
        return new Promise<{ success: boolean; message: string }>((resolve) => {
            setTimeout(() => {
                const users = DB.getUsers();
                const foundUser = users.find((u: any) => u.email === email && u.password === password);

                if (foundUser) {
                    const sessionUser = { name: foundUser.name, email: foundUser.email };
                    DB.setCurrentUser(sessionUser);
                    setUser(sessionUser);
                    resolve({ success: true, message: 'Login successful!' });
                } else {
                    resolve({ success: false, message: 'Invalid email or password.' });
                }
            }, 500); // Simulate network delay
        });
    };

    const register = async (name: string, email: string, password: string) => {
        // Mock DB Register
        return new Promise<{ success: boolean; message: string }>((resolve) => {
            setTimeout(() => {
                const users = DB.getUsers();
                if (users.find((u: any) => u.email === email)) {
                    resolve({ success: false, message: 'Email already registered.' });
                    return;
                }

                const newUser = { name, email, password }; // ID would be generated here in real app
                DB.saveUser(newUser);

                // Auto login after register? The snippet doesn't explicitly say, but usually yes. 
                // However, snippet `Auth.register` just says "Account created".
                // We'll require login unless user wants auto-login.
                // Let's auto-login for better UX.
                const sessionUser = { name, email };
                DB.setCurrentUser(sessionUser);
                setUser(sessionUser);

                resolve({ success: true, message: 'Account created successfully!' });
            }, 500);
        });
    };

    const addAddress = (address: Address) => {
        if (!user) return;

        const updatedUser = { ...user, addresses: [...(user.addresses || []), address] };
        setUser(updatedUser);
        DB.setCurrentUser(updatedUser);

        // Update in "Database"
        const users = DB.getUsers();
        const userIndex = users.findIndex((u: any) => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], addresses: updatedUser.addresses };
            localStorage.setItem('modernist_users', JSON.stringify(users));
        }
    };

    const logout = () => {
        DB.setCurrentUser(null);
        setUser(null);
        // window.location.href = '/login'; // Optional: Redirect or just clear state
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, addAddress, isAuthenticated: !!user }}>
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
