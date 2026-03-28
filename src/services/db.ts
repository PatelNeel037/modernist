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
        // Check both possible keys, just in case
        return localStorage.getItem(this.KEYS.TOKEN) || localStorage.getItem('modernist_token');
    },

    // --- Data Access (Cart) ---

    getCart: function (): any[] {
        if (typeof window === 'undefined') return [];
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

        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: JSON.stringify(cart)
        }));
    },

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

        window.dispatchEvent(new StorageEvent('storage', {
            key: key,
            newValue: JSON.stringify(wishlist)
        }));
    },

    // --- API Calls (Auth) ---

    login: async function (email: string, password: string): Promise<{ success: boolean; message?: string; requireVerification?: boolean }> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem(this.KEYS.TOKEN, data.token);
                localStorage.setItem(this.KEYS.USER, JSON.stringify(data.user));
                this.mergeGuestData(data.user.id);
                return { success: true };
            } else {
                return { success: false, message: data.message, requireVerification: data.requireVerification };
            }
        } catch (error) {
            console.warn("Login Error:", error);
            return { success: false, message: 'Network Error' };
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
                localStorage.setItem(this.KEYS.TOKEN, data.token);
                localStorage.setItem(this.KEYS.USER, JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.warn("Registration failed:", error);
            return { success: false, message: 'Network Error' };
        }
    },

    verifyEmail: async function (email: string, code: string): Promise<{ success: boolean; message?: string; user?: any }> {
        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem(this.KEYS.USER, JSON.stringify(data.user));
                this.mergeGuestData(data.user.id);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.warn("Verification failed:", error);
            return { success: false, message: 'Network Error' };
        }
    },

    resendOTP: async function (email: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return await response.json();
        } catch (error) {
            console.warn("Resend OTP failed:", error);
            return { success: false, message: 'Network Error' };
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
            console.warn("Forgot Password failed:", error);
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

    updateProfile: async function (user: any): Promise<{ success: boolean; message?: string; user?: any }> {
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

    deleteProfile: async function (userId: string | number): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(`${API_URL}/auth/profile?id=${userId}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.warn("Delete Profile failed:", error);
            return { success: false, message: 'Network Error' };
        }
    },

    logout: function () {
        if (typeof window === 'undefined') return;
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
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
            console.warn("Order Failed:", e);
            return false;
        }
    },

    // --- API Calls (Products) ---

    fetchProducts: async function () {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) return [];
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.warn("Failed to fetch products:", e);
            return [];
        }
    },

    fetchProduct: async function (id: string | number) {
        try {
            const response = await fetch(`${API_URL}/products/${id}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (e) {
            console.warn("Failed to fetch product:", e);
            return null;
        }
    },

    fetchReviews: async function (productId: string | number) {
        try {
            const response = await fetch(`${API_URL}/products/${productId}/reviews`);
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.warn("Failed to fetch reviews:", e);
            return [];
        }
    },

    submitReview: async function (productId: string | number, rating: number, comment: string, reviewerName?: string) {
        try {
            const token = this.getToken();
            const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ rating, comment, reviewerName })
            });
            const data = await response.json();
            return {
                success: response.ok,
                message: data.message,
                review: data.review
            };
        } catch (e) {
            console.warn("Failed to submit review:", e);
            return { success: false, message: 'Network error submitting review' };
        }
    },

    // --- API Calls (Testimonials) ---

    fetchTestimonials: async function (all: boolean = false) {
        try {
            const url = all ? `${API_URL}/testimonials?all=true` : `${API_URL}/testimonials`;
            const response = await fetch(url);
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.warn("Failed to fetch testimonials:", e);
            return [];
        }
    },

    addTestimonial: async function (data: any) {
        try {
            const response = await fetch(`${API_URL}/testimonials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    updateTestimonial: async function (id: string, data: any) {
        try {
            const response = await fetch(`${API_URL}/testimonials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    deleteTestimonial: async function (id: string) {
        try {
            const response = await fetch(`${API_URL}/testimonials/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    // --- API Calls (Instagram) ---

    fetchInstagramPosts: async function (all: boolean = false) {
        try {
            const url = all ? `${API_URL}/instagram?all=true` : `${API_URL}/instagram`;
            const response = await fetch(url);
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.warn("Failed to fetch instagram posts:", e);
            return [];
        }
    },

    addInstagramPost: async function (data: any) {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const response = await fetch(`${API_URL}/instagram`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    updateInstagramPost: async function (id: string, data: any) {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const response = await fetch(`${API_URL}/instagram/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    deleteInstagramPost: async function (id: string) {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const response = await fetch(`${API_URL}/instagram/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    // --- API Calls (Collections) ---

    fetchCollections: async function () {
        try {
            const response = await fetch(`${API_URL}/admin/collections`);
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.warn("Failed to fetch collections:", e);
            return [];
        }
    },

    addCollection: async function (data: any) {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const response = await fetch(`${API_URL}/admin/collections`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    updateCollection: async function (id: string, data: any) {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const response = await fetch(`${API_URL}/admin/collections/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    deleteCollection: async function (id: string) {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const response = await fetch(`${API_URL}/admin/collections/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    // --- API Calls (Newsletter) ---

    subscribeNewsletter: async function (email: string) {
        try {
            const response = await fetch(`${API_URL}/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return await response.json();
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    fetchSubscribers: async function () {
        try {
            const response = await fetch(`${API_URL}/newsletter`);
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.warn("Failed to fetch subscribers:", e);
            return [];
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

        guestCart.forEach((gItem: any) => {
            const existing = userCart.find((u: any) => u.id === gItem.id);
            if (existing) {
                existing.quantity += gItem.quantity;
            } else {
                userCart.push(gItem);
            }
        });

        localStorage.setItem(userCartKey, JSON.stringify(userCart));
        localStorage.removeItem(guestCartKey);

        window.dispatchEvent(new StorageEvent('storage', {
            key: userCartKey,
            newValue: JSON.stringify(userCart)
        }));
    }
};
