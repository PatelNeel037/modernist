/**
 * DATABASE ADAPTER (API VERSION)
 * connects frontend to the Node.js Backend API
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

const API_URL = '/api';

export const DB = {
    // --- Keys ---
    KEYS: {
        TOKEN: 'modernist_auth_token',
        USER: 'modernist_user_info',
        ADMIN_TOKEN: 'modernist_admin_token',
        ADMIN_USER: 'modernist_admin_user',
        GUEST_CART: 'modernist_cart_guest' // Keep guest cart local for now
    },

    // --- Admin Management ---

    getAdminUser: function (): any {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    },

    adminLogin: async function (email: string, password: string): Promise<{ success: boolean; message?: string }> {
        // Reusing the same API endpoint, but storing in different keys
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                if (data.user.role !== 'admin') {
                    return { success: false, message: 'Access Denied: Not an admin.' };
                }
                // Save Admin Token & User Info
                localStorage.setItem(this.KEYS.ADMIN_TOKEN, data.token);
                localStorage.setItem(this.KEYS.ADMIN_USER, JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.warn("Admin Login Error:", error);
            return { success: false, message: 'Network Error' };
        }
    },

    adminLogout: function () {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.KEYS.ADMIN_TOKEN);
        localStorage.removeItem(this.KEYS.ADMIN_USER);
        window.location.href = '/admin/login'; // Force reload/redirect
    },

    // --- User Management ---

    getCurrentUserId: function (): string | number | null {
        const user = this.getCurrentUser();
        return user ? user.id : null;
    },

    getCurrentUser: function (): any {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(this.KEYS.USER);
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            console.warn("Error parsing user data", e);
            return null;
        }
    },

    updateCurrentUser: function (user: any) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
        // Dispatch storage event to sync other contexts if needed
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.KEYS.USER,
            newValue: JSON.stringify(user)
        }));
    },

    getToken: function (): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.KEYS.TOKEN);
    },

    // --- Data Access (Cart) ---
    // Note: For this migration, we are keeping a "Hybrid" approach.
    // Guests use LocalStorage. Logged in users use LocalStorage (synced by Auth).

    getCart: function (): any[] {
        if (typeof window === 'undefined') return [];
        // Simple strategy: Always use the localStorage key for the current context
        const userId = this.getCurrentUserId();
        const key = userId ? `modernist_cart_${userId}` : 'modernist_cart_guest';
        const data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn("Error parsing cart data", e);
            return [];
        }
    },

    saveCart: function (cart: any[]) {
        if (typeof window === 'undefined') return;
        const userId = this.getCurrentUserId();
        const key = userId ? `modernist_cart_${userId}` : 'modernist_cart_guest';
        localStorage.setItem(key, JSON.stringify(cart));

        // Dispatch event for UI updates - IMPORTANT for React Context to sync
        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: JSON.stringify(cart)
        }));
    },

    // --- Wishlist (Same Logic) ---

    getWishlist: function (): any[] {
        if (typeof window === 'undefined') return [];
        const userId = this.getCurrentUserId();
        const key = userId ? `modernist_wishlist_${userId}` : 'modernist_wishlist_guest';
        const data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn("Error parsing wishlist data", e);
            return [];
        }
    },

    saveWishlist: function (wishlist: any[]) {
        if (typeof window === 'undefined') return;
        const userId = this.getCurrentUserId();
        const key = userId ? `modernist_wishlist_${userId}` : 'modernist_wishlist_guest';
        localStorage.setItem(key, JSON.stringify(wishlist));

        // Dispatch event for UI updates
        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: JSON.stringify(wishlist)
        }));
    },

    // --- API Calls (Auth) ---

    login: async function (email: string, password: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                // Save Token & User Info
                localStorage.setItem(this.KEYS.TOKEN, data.token);
                localStorage.setItem(this.KEYS.USER, JSON.stringify(data.user));

                // Merge Guest Data logic (simplified version of previous logic)
                this.mergeGuestData(data.user.id);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            // Using warn instead of error to prevent Next.js overlay
            console.warn("Login Error (Is Backend Running?):", error);
            return { success: false, message: 'Network Error: Is backend running on port 5000?' };
        }
    },

    register: async function (name: string, email: string, password: string): Promise<{ success: boolean; message?: string; requireVerification?: boolean }> {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();

            if (data.success) {
                if (data.requireVerification) {
                    return { success: true, message: data.message, requireVerification: true };
                }
                // Auto login after signup (Legacy behavior if verification disabled)
                localStorage.setItem(this.KEYS.TOKEN, data.token);
                localStorage.setItem(this.KEYS.USER, JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.warn("Registration failed (Network Error):", error);
            return { success: false, message: 'Network Error: Is backend running?' };
        }
    },

    forgotPassword: async function (email: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return await response.json();
        } catch (error) {
            console.warn("Forgot Password failed (Network Error):", error);
            return { success: false, message: 'Network Error' };
        }
    },

    changePassword: async function (email: string, current: string, newPass: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, currentPassword: current, newPassword: newPass })
            });
            return await response.json();
        } catch (error) {
            console.warn("Change Password failed:", error);
            return { success: false, message: 'Network Error' };
        }
    },

    updateProfile: async function (user: any): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            return await response.json();
        } catch (error) {
            console.warn("Update Profile failed:", error);
            return { success: false, message: 'Network Error' };
        }
    },

    logout: function () {
        if (typeof window === 'undefined') return;

        // We do NOT delete the user's cart/wishlist here anymore.
        // This ensures that when they log back in, their data is still there.

        sessionStorage.removeItem('modernist_buy_now_item');
        localStorage.removeItem(this.KEYS.TOKEN);
        localStorage.removeItem(this.KEYS.USER);
        window.location.reload();
    },

    // --- API Calls (Orders) ---

    addOrder: async function (order: any): Promise<boolean> {
        const userId = this.getCurrentUserId();

        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${this.getToken()}` // Uncomment if we add middleware later
                },
                body: JSON.stringify({
                    userId: userId, // Send null if guest
                    guestInfo: order.guestInfo,
                    shippingAddress: order.shippingAddress,
                    items: order.items,
                    totalAmount: typeof order.total === 'string' ? parseFloat(order.total.replace('$', '')) : order.total
                })
            });
            if (response.status === 403) {
                alert('Your account has been blocked. Logging out.');
                this.logout();
                return false;
            }
            const data = await response.json();
            return data.success;
        } catch (e) {
            console.warn("Order Failed (Network Error?)", e);
            return false;
        }
    },

    // --- API Calls (Products) ---

    // This replaces global productsDB access
    fetchProducts: async function () {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) return [];
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.warn("Failed to fetch products (Is backend running?)", e);
            return [];
        }
    },

    fetchProduct: async function (id: string | number) {
        try {
            const response = await fetch(`${API_URL}/products/${id}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (e) {
            console.warn("Failed to fetch product", e);
            return null;
        }
    },

    // --- Helper: Merge Guest Data ---
    mergeGuestData: function (newUserId: string | number) {
        if (typeof window === 'undefined') return;
        const guestCartKey = 'modernist_cart_guest';
        const userCartKey = `modernist_cart_${newUserId}`;

        let guestCart = [];
        try {
            guestCart = JSON.parse(localStorage.getItem(guestCartKey) || '[]');
        } catch (e) { }

        if (guestCart.length === 0) return;

        let userCart = [];
        try {
            userCart = JSON.parse(localStorage.getItem(userCartKey) || '[]');
        } catch (e) { }


        // Merge logic
        guestCart.forEach((gItem: any) => {
            const existing = userCart.find((u: any) => u.id === gItem.id);
            if (existing) {
                existing.quantity += gItem.quantity;
            } else {
                userCart.push(gItem);
            }
        });

        // Save & Clear Guest
        localStorage.setItem(userCartKey, JSON.stringify(userCart));
        localStorage.removeItem(guestCartKey);

        // Notify CartContext to reload
        window.dispatchEvent(new StorageEvent('storage', {
            key: userCartKey,
            newValue: JSON.stringify(userCart)
        }));
    }
};
