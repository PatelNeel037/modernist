'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    User, Box, MapPin, Settings, LogOut,
    Plus, Edit2, Trash2, CheckCircle, AlertCircle,
    Shield, Bell, Lock, Smartphone, Moon, Sun, Monitor
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const { user, logout, addAddress, updateAddress, deleteAddress, updateUser, deleteAccount, changePassword, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    // Address Form State
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [addressForm, setAddressForm] = useState({
        name: '',
        mobile: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        type: 'Home',
        isDefault: false
    });

    // Profile & Settings State
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        mobile: ''
    });

    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newArrivals: true,
        email: true,
        sms: false
    });

    // Sync user data to local state
    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name,
                email: user.email,
                mobile: ''
            });
            // In a real app, notifications comes from user.notifications
            if (user.notifications) {
                setNotifications(user.notifications);
            }
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    // --- Address Handlers ---

    const handleDeleteAddress = (id: string) => {
        if (confirm('Are you sure you want to delete this address?')) {
            deleteAddress(id);
        }
    };

    const handleSetDefault = (id: string) => {
        const address = user?.addresses?.find(a => a.id === id);
        if (address) {
            updateAddress({ ...address, isDefault: true });
            toast.success('Default address updated');
        }
    };

    const openAddressModal = (address?: any) => {
        if (address) {
            setEditingAddress(address);
            setAddressForm({
                name: address.name,
                mobile: address.phone,
                street: address.street,
                city: address.city,
                state: address.state,
                zip: address.zip,
                type: address.type || 'Home',
                isDefault: address.isDefault || false
            });
        } else {
            setEditingAddress(null);
            setAddressForm({
                name: '',
                mobile: '',
                street: '',
                city: '',
                state: '',
                zip: '',
                type: 'Home',
                isDefault: false
            });
        }
        setIsAddressModalOpen(true);
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            id: editingAddress ? editingAddress.id : Date.now().toString(),
            name: addressForm.name,
            street: addressForm.street,
            city: addressForm.city,
            state: addressForm.state,
            zip: addressForm.zip,
            phone: addressForm.mobile,
            isDefault: editingAddress ? editingAddress.isDefault : (user?.addresses?.length === 0),
            type: addressForm.type
        };

        if (editingAddress) {
            updateAddress(payload);
            toast.success('Address updated successfully!');
        } else {
            addAddress(payload);
            toast.success('Address added successfully!');
        }
        setIsAddressModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    // --- Settings Handlers ---

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (profileForm.name.trim() === '') {
            toast.error('Name cannot be empty.');
            return;
        }

        const result = await updateUser({ name: profileForm.name });
        if (result && result.success === false) {
            toast.error(result.message);
        } else {
            toast.success('Profile updated successfully!');
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.new !== passwordForm.confirm) {
            toast.error("New passwords do not match!");
            return;
        }

        const result = await changePassword(passwordForm.current, passwordForm.new);

        if (result.success) {
            toast.success('Password updated successfully!');
            setPasswordForm({ current: '', new: '', confirm: '' });
        } else {
            toast.error(result.message || 'Failed to update password');
        }
    };

    const handleNotificationToggle = async (key: keyof typeof notifications) => {
        const updated = { ...notifications, [key]: !notifications[key] };
        setNotifications(updated);
        
        try {
            const result = await updateUser({ notifications: updated });
            if (result && result.success) {
                toast.success('Notification preference updated');
            } else {
                // Rollback local state on failure
                setNotifications(notifications);
                toast.error(result?.message || 'Failed to update preference');
            }
        } catch (error) {
            setNotifications(notifications);
            toast.error('Network error updating preference');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmText = prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
        if (confirmText === 'DELETE') {
            const result = await deleteAccount();
            if (result.success) {
                toast.success('Account deleted successfully.');
                window.location.href = '/';
            } else {
                toast.error(result.message || 'Failed to delete account');
            }
        }
    };

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your profile...</p>
                </div>
            </main>
        );
    }

    const addresses = user.addresses || [];

    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />

            <div className="pt-32 pb-16 container mx-auto px-6 max-w-6xl">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200 pb-8">
                    <div>
                        <h1 className="text-3xl font-playfair font-bold mb-2">My Account</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    {user.isVerified && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                            <CheckCircle size={14} /> Verified Account
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-bg-main/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-bg-accent/50 h-fit sticky top-24"
                    >
                        <nav className="space-y-2 relative">
                            {['dashboard', 'addresses', 'settings'].map((tab) => {
                                const isActive = activeTab === tab;
                                const icons: Record<string, React.ReactNode> = {
                                    dashboard: <User size={18} />,
                                    addresses: <MapPin size={18} />,
                                    settings: <Settings size={18} />
                                };
                                const labels: Record<string, string> = {
                                    dashboard: 'Dashboard',
                                    addresses: 'Addresses',
                                    settings: 'Settings'
                                };
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative z-10 ${isActive ? 'text-bg-main' : 'text-content-body hover:text-brand-primary hover:bg-bg-soft'}`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabProfile"
                                                className="absolute inset-0 bg-brand-primary rounded-xl -z-10"
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            />
                                        )}
                                        {icons[tab]} {labels[tab]}
                                    </button>
                                );
                            })}
                            <Link
                                href="/orders"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-content-body hover:text-brand-primary hover:bg-bg-soft transition-colors mt-2"
                            >
                                <Box size={18} /> My Orders
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors mt-4 border-t border-bg-accent/50"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </nav>
                    </motion.aside>

                    {/* Main Content */}
                    <div className="md:col-span-3">

                        {/* Dashboard Tab */}
                        {activeTab === 'dashboard' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-bg-main p-8 rounded-3xl shadow-lg border border-bg-accent/30 backdrop-blur-sm">
                                    <h2 className="text-3xl font-playfair font-bold mb-4 text-content-heading">Welcome back, {user.name}</h2>
                                    <p className="text-content-body leading-relaxed text-lg">
                                        From your account dashboard you can view your <Link href="/orders" className="text-brand-primary underline font-medium">recent orders</Link>, manage your shipping and billing addresses, and edit your password and account details.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="bg-linear-to-br from-bg-soft to-bg-main p-6 rounded-2xl border border-bg-accent/50 text-center shadow-md hover:shadow-xl cursor-pointer"
                                            onClick={() => router.push('/orders')}
                                        >
                                            <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
                                                <Box size={28} />
                                            </div>
                                            <h3 className="font-bold mb-2 text-content-heading text-lg">Orders</h3>
                                            <span className="text-sm text-content-body font-medium flex justify-center items-center gap-1 group">View History <span className="transform group-hover:translate-x-1 transition-transform">→</span></span>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            onClick={() => setActiveTab('addresses')}
                                            className="bg-linear-to-br from-bg-soft to-bg-main p-6 rounded-2xl border border-bg-accent/50 text-center shadow-md hover:shadow-xl cursor-pointer"
                                        >
                                            <div className="w-14 h-14 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3">
                                                <MapPin size={28} />
                                            </div>
                                            <h3 className="font-bold mb-2 text-content-heading text-lg">Addresses</h3>
                                            <span className="text-sm text-content-body font-medium flex justify-center items-center gap-1 group">Manage saved <span className="transform group-hover:translate-x-1 transition-transform">→</span></span>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            onClick={() => setActiveTab('settings')}
                                            className="bg-linear-to-br from-bg-soft to-bg-main p-6 rounded-2xl border border-bg-accent/50 text-center shadow-md hover:shadow-xl cursor-pointer"
                                        >
                                            <div className="w-14 h-14 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
                                                <Settings size={28} />
                                            </div>
                                            <h3 className="font-bold mb-2 text-content-heading text-lg">Account Info</h3>
                                            <span className="text-sm text-content-body font-medium flex justify-center items-center gap-1 group">Edit Details <span className="transform group-hover:translate-x-1 transition-transform">→</span></span>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-3xl font-playfair font-bold text-content-heading">Saved Addresses</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openAddressModal()}
                                        className="bg-brand-primary text-bg-main px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors shadow-md"
                                    >
                                        <Plus size={16} /> Add New Address
                                    </motion.button>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6 border border-orange-200 dark:border-orange-800/50">
                                    <AlertCircle size={16} />
                                    Addresses cannot be modified for orders already shipped.
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {addresses.length === 0 && (
                                        <p className="text-content-body col-span-2 text-center py-8">No addresses saved yet.</p>
                                    )}
                                    <AnimatePresence>
                                        {addresses.map((addr, idx) => (
                                            <motion.div
                                                key={addr.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: idx * 0.1, type: "spring" }}
                                                className="bg-bg-main border border-bg-accent rounded-2xl p-6 relative hover:shadow-xl transition-shadow group overflow-hidden"
                                            >
                                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <motion.button whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); openAddressModal(addr); }} type="button" className="bg-bg-soft text-content-body hover:text-brand-primary p-2 rounded-full shadow-sm"><Edit2 size={16} /></motion.button>
                                                    <motion.button whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteAddress(addr.id); }} type="button" className="bg-bg-soft text-content-body hover:text-red-500 p-2 rounded-full shadow-sm"><Trash2 size={16} /></motion.button>
                                                </div>
                                                <div className="mb-4 relative z-10">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        {(addr as any).type && (
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${(addr as any).type === 'Home' ? 'bg-blue-600 text-white shadow-sm' :
                                                                (addr as any).type === 'Office' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-600 text-white shadow-sm'
                                                                }`}>
                                                                {(addr as any).type}
                                                            </span>
                                                        )}
                                                        {addr.isDefault && (
                                                            <span className="bg-brand-primary text-bg-main px-2 py-1 rounded-md text-[10px] flex items-center gap-1 font-bold">
                                                                <CheckCircle size={12} /> Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-bold text-xl text-content-heading">{addr.name}</h4>
                                                </div>
                                                <div className="text-sm text-content-body space-y-1 mb-4 relative z-10">
                                                    <p>{addr.street}</p>
                                                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                                                    <p className="mt-2 text-content-heading font-medium">Phone: {addr.phone}</p>
                                                </div>
                                                {!addr.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefault(addr.id)}
                                                        className="text-xs font-bold text-content-body relative z-10 hover:text-brand-primary transition-colors underline decoration-bg-accent hover:decoration-brand-primary underline-offset-4"
                                                    >
                                                        Set as Default
                                                    </button>
                                                )}

                                                {/* Decorative background shape */}
                                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-bg-soft rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* PROFILE INFORMATION SECTION (NEW) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, type: "spring" }}
                                    className="bg-bg-main rounded-2xl shadow-lg border border-bg-accent/50 overflow-hidden"
                                >
                                    <div className="p-5 border-b border-bg-accent/50 bg-bg-soft/50 flex items-center gap-3 backdrop-blur-md">
                                        <User size={20} className="text-brand-primary" />
                                        <h3 className="font-bold text-content-heading text-lg">Profile Details</h3>
                                    </div>
                                    <div className="p-6">
                                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-content-body ml-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium"
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-5 py-2.5 bg-brand-primary text-bg-main rounded-xl shadow-md font-bold hover:shadow-lg transition-all">Update Profile</motion.button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>

                                {/* SECURITY SECTION */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="bg-bg-main rounded-2xl shadow-lg border border-bg-accent/50 overflow-hidden"
                                >
                                    <div className="p-5 border-b border-bg-accent/50 bg-bg-soft/50 flex items-center gap-3 backdrop-blur-md">
                                        <Lock size={20} className="text-brand-primary" />
                                        <h3 className="font-bold text-content-heading text-lg">Security & Login</h3>
                                    </div>
                                    <div className="p-6 space-y-8">
                                        {/* Change Password */}
                                        <form onSubmit={handlePasswordUpdate}>
                                            <h4 className="font-semibold mb-5 text-[11px] uppercase tracking-widest text-content-body ml-1">Change Password</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-content-body ml-1">Current Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium"
                                                        value={passwordForm.current}
                                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-content-body ml-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium"
                                                        value={passwordForm.new}
                                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-content-body ml-1">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium"
                                                        value={passwordForm.confirm}
                                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-5 flex justify-end">
                                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-5 py-2.5 bg-brand-primary text-bg-main rounded-xl shadow-md font-bold hover:shadow-lg transition-all">Update Password</motion.button>
                                            </div>
                                        </form>

                                        <div className="border-t border-bg-accent/50 pt-6"></div>

                                        {/* Sessions */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-content-heading text-lg">Active Sessions</h4>
                                                <p className="text-sm text-content-body mt-1">You are currently logged in on this device.</p>
                                            </div>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} className="border border-bg-accent text-content-heading px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-bg-soft transition-colors shadow-sm">
                                                Logout All Devices
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* NOTIFICATIONS SECTION */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="bg-bg-main rounded-2xl shadow-lg border border-bg-accent/50 overflow-hidden"
                                >
                                    <div className="p-5 border-b border-bg-accent/50 bg-bg-soft/50 flex items-center gap-3 backdrop-blur-md">
                                        <Bell size={20} className="text-brand-primary" />
                                        <h3 className="font-bold text-content-heading text-lg">Notifications</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            {[
                                                { key: 'orderUpdates', label: 'Order Updates', desc: 'Receive updates about your order status, shipping, and delivery.' },
                                                { key: 'promotions', label: 'Promotions & Offers', desc: 'Be the first to know about sales, new arrivals, and exclusive offers.' },
                                                { key: 'email', label: 'Email Notifications', desc: `Receive emails at ` },
                                            ].map((item, i) => (
                                                <motion.div 
                                                    key={item.key} 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                                    className="flex items-center justify-between group/item p-2 rounded-xl hover:bg-bg-soft transition-colors"
                                                >
                                                    <div>
                                                        <p className="font-bold text-content-heading">{item.label}</p>
                                                        <p className="text-sm text-content-body max-w-sm mt-1">
                                                            {item.desc}
                                                            {item.key === 'email' && <span className="font-medium text-brand-primary">{user.email}</span>}
                                                        </p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={(notifications as any)[item.key]} 
                                                            onChange={() => handleNotificationToggle(item.key as any)} 
                                                        />
                                                        <div className="w-12 h-6 bg-bg-soft border-2 border-bg-accent peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary peer-checked:border-brand-primary shadow-inner"></div>
                                                    </label>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ACCOUNT STATUS SECTION */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className="bg-bg-main rounded-2xl shadow-lg border border-bg-accent/50 overflow-hidden"
                                >
                                    <div className="p-5 border-b border-bg-accent/50 bg-bg-soft/50 flex items-center gap-3 backdrop-blur-md">
                                        <Shield size={20} className="text-brand-primary" />
                                        <h3 className="font-bold text-content-heading text-lg">Account Status</h3>
                                    </div>
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-content-body mb-2 ml-1">Account Status</p>
                                            <p className={`text-lg font-bold flex items-center gap-2 ${user.isActive !== false ? 'text-emerald-600' : 'text-red-500'}`}>
                                                <span className={`w-2 h-2 rounded-full ${user.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                                                {user.isActive !== false ? 'Active & Secure' : 'Blocked'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-content-body mb-2 ml-1">Email Verification</p>
                                            <div className="flex items-center gap-3">
                                                <p className={`text-lg font-bold flex items-center gap-2 ${user.isVerified ? 'text-emerald-600' : 'text-orange-500'}`}>
                                                    <span className={`w-2 h-2 rounded-full ${user.isVerified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-orange-500'}`}></span>
                                                    {user.isVerified ? 'Verified Account' : 'Unverified'}
                                                </p>
                                                {!user.isVerified && (
                                                    <button 
                                                        onClick={async () => {
                                                            const result = await updateUser({ isVerified: true });
                                                            if (result && result.success) {
                                                                toast.success('Account verified successfully!');
                                                            } else {
                                                                toast.error('Failed to verify account');
                                                            }
                                                        }} 
                                                        className="text-[10px] uppercase font-bold tracking-wider bg-brand-primary text-bg-main px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all object-cover"
                                                    >
                                                        Verify Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-content-body mb-2 ml-1">Two-Factor Authentication</p>
                                            <div className="flex items-center gap-3">
                                                <p className="text-lg font-bold text-content-body opacity-50 flex items-center gap-2">
                                                    <Lock size={16} /> Disabled
                                                </p>
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-bg-soft border border-bg-accent px-2 py-1 rounded-md text-brand-primary shadow-sm">Coming Soon</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-content-body mb-2 ml-1">Member Since</p>
                                            <p className="text-lg font-bold text-content-heading">October 2023</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* DANGER ZONE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="bg-red-500/5 rounded-2xl border border-red-500/20 p-8 shadow-inner overflow-hidden relative group"
                                >
                                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-8 max-w-lg">Once you delete your account, there is no going back. All of your personal data, order history, and saved addresses will be permanently wiped from our servers.</p>

                                    <div className="flex flex-col md:flex-row items-center justify-between bg-bg-main/50 backdrop-blur-md p-6 rounded-xl border border-red-500/10 shadow-sm relative z-10">
                                        <div className="mb-4 md:mb-0">
                                            <h4 className="font-bold text-red-600 dark:text-red-400">Delete Account</h4>
                                            <p className="text-xs text-content-body mt-1">Permanently remove your account and all data.</p>
                                        </div>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDeleteAccount} className="w-full md:w-auto bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:bg-red-700 transition-all">
                                            Delete My Account
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </div>

            {/* Ultra-Premium 3D Address Modal */}
            <AnimatePresence>
                {isAddressModalOpen && (
                    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                        {/* Glassmorphism Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddressModalOpen(false)}
                            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
                        />

                        {/* 3D Spring Modal Frame */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: -15 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            style={{ transformPerspective: 1200 }}
                            className="relative w-full max-w-md bg-bg-main shadow-2xl rounded-2xl overflow-hidden border border-bg-accent z-10"
                        >
                            {/* Decorative Top Accent */}
                            <div className="h-2 w-full bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary"></div>

                            <div className="p-8">
                                <h3 className="text-2xl font-bold font-playfair mb-6 text-content-heading">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                                <form className="space-y-5" onSubmit={handleAddressSubmit}>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-content-body ml-1">Full Name</label>
                                            <input name="name" value={addressForm.name} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-content-body ml-1">Mobile</label>
                                            <input name="mobile" value={addressForm.mobile} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium" required />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-content-body ml-1">Street Address</label>
                                        <input name="street" value={addressForm.street} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-content-body ml-1">City</label>
                                            <input name="city" value={addressForm.city} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-content-body ml-1">State</label>
                                            <input name="state" value={addressForm.state} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-content-body ml-1">Pincode</label>
                                            <input name="zip" value={addressForm.zip} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-content-body ml-1">Address Type</label>
                                            <select name="type" value={addressForm.type} onChange={handleInputChange} className="w-full px-4 py-3 bg-bg-soft border-transparent border focus:border-brand-primary rounded-xl focus:outline-none transition-colors text-content-heading font-medium appearance-none">
                                                <option>Home</option>
                                                <option>Office</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-bg-accent/50">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => setIsAddressModalOpen(false)} className="px-5 py-3 rounded-xl font-bold text-content-body hover:bg-bg-soft transition-colors">Cancel</motion.button>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-5 py-3 bg-brand-primary text-bg-main rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 focus:outline-none font-bold">
                                            {editingAddress ? 'Update Details' : 'Save Address'}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
