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

export default function ProfilePage() {
    const { user, logout, addAddress, updateAddress, deleteAddress, updateUser, changePassword, isLoading } = useAuth();
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
            alert('Default address updated');
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
            alert('Address updated successfully!');
        } else {
            addAddress(payload);
            alert('Address added successfully!');
        }
        setIsAddressModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    // --- Settings Handlers ---

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ name: profileForm.name, email: profileForm.email });
        alert('Profile updated successfully!');
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.new !== passwordForm.confirm) {
            alert("New passwords do not match!");
            return;
        }

        const result = await changePassword(passwordForm.current, passwordForm.new);

        if (result.success) {
            alert('Password updated successfully!');
            setPasswordForm({ current: '', new: '', confirm: '' });
        } else {
            alert(result.message || 'Failed to update password');
        }
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        const updated = { ...notifications, [key]: !notifications[key] };
        setNotifications(updated);
        updateUser({ notifications: updated });
    };

    const handleDeleteAccount = () => {
        const confirmText = prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
        if (confirmText === 'DELETE') {
            alert('Account deleted.');
            logout();
            window.location.href = '/';
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
                    <aside className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <User size={18} /> Dashboard
                            </button>
                            <Link
                                href="/orders"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <Box size={18} /> My Orders
                            </Link>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'addresses' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <MapPin size={18} /> Addresses
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Settings size={18} /> Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4 border-t border-gray-100"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="md:col-span-3">

                        {/* Dashboard Tab */}
                        {activeTab === 'dashboard' && (
                            <div className="animate-fade-in space-y-6">
                                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-playfair font-bold mb-4">Welcome back, {user.name}</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        From your account dashboard you can view your <Link href="/orders" className="text-black underline">recent orders</Link>, manage your shipping and billing addresses, and edit your password and account details.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                        <div className="bg-gray-50 p-6 rounded border border-gray-100 text-center hover:bg-white hover:shadow-md transition-all">
                                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Box size={24} />
                                            </div>
                                            <h3 className="font-bold mb-1">Orders</h3>
                                            <Link href="/orders" className="text-sm text-gray-500 hover:text-black">View History →</Link>
                                        </div>
                                        <div
                                            onClick={() => setActiveTab('addresses')}
                                            className="bg-gray-50 p-6 rounded border border-gray-100 text-center hover:bg-white hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <MapPin size={24} />
                                            </div>
                                            <h3 className="font-bold mb-1">Addresses</h3>
                                            <span className="text-sm text-gray-500">Manage saved →</span>
                                        </div>
                                        <div
                                            onClick={() => setActiveTab('settings')}
                                            className="bg-gray-50 p-6 rounded border border-gray-100 text-center hover:bg-white hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Settings size={24} />
                                            </div>
                                            <h3 className="font-bold mb-1">Account Info</h3>
                                            <span className="text-sm text-gray-500">Edit Details →</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="animate-fade-in space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-playfair font-bold">Saved Addresses</h2>
                                    <button
                                        onClick={() => openAddressModal()}
                                        className="bg-black text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
                                    >
                                        <Plus size={16} /> Add New Address
                                    </button>
                                </div>
                                <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded text-sm flex items-center gap-2 mb-6">
                                    <AlertCircle size={16} />
                                    Addresses cannot be modified for orders already shipped.
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {addresses.length === 0 && (
                                        <p className="text-gray-500 col-span-2 text-center py-8">No addresses saved yet.</p>
                                    )}
                                    {addresses.map(addr => (
                                        <div key={addr.id} className="bg-white border border-gray-200 rounded-lg p-6 relative hover:shadow-md transition-shadow group">
                                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openAddressModal(addr)} className="text-gray-400 hover:text-black p-1"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="mb-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {(addr as any).type && (
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${(addr as any).type === 'Home' ? 'bg-blue-50 text-blue-700' :
                                                            (addr as any).type === 'Office' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {(addr as any).type}
                                                        </span>
                                                    )}
                                                    {addr.isDefault && (
                                                        <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                            <CheckCircle size={12} /> Default
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-lg">{addr.name}</h4>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1 mb-4">
                                                <p>{addr.street}</p>
                                                <p>{addr.city}, {addr.state} {addr.zip}</p>
                                                <p className="mt-2 text-gray-900 font-medium">Phone: {addr.phone}</p>
                                            </div>
                                            {!addr.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefault(addr.id)}
                                                    className="text-xs font-medium text-gray-500 underline hover:text-black"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="animate-fade-in space-y-8">

                                {/* SECURITY SECTION */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                        <Lock size={18} className="text-gray-500" />
                                        <h3 className="font-bold text-gray-900">Security & Login</h3>
                                    </div>
                                    <div className="p-6 space-y-8">
                                        {/* Change Password */}
                                        <form onSubmit={handlePasswordUpdate}>
                                            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-500">Change Password</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-gray-500">Current Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black focus:outline-none transition-colors"
                                                        value={passwordForm.current}
                                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-gray-500">New Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black focus:outline-none transition-colors"
                                                        value={passwordForm.new}
                                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-gray-500">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-black focus:outline-none transition-colors"
                                                        value={passwordForm.confirm}
                                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <button type="submit" className="text-sm bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition-colors">Update Password</button>
                                            </div>
                                        </form>

                                        <div className="border-t border-gray-100 pt-6"></div>

                                        {/* Sessions */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Active Sessions</h4>
                                                <p className="text-sm text-gray-500">You are currently logged in on this device.</p>
                                            </div>
                                            <button onClick={handleLogout} className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                                                Logout All Devices
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* NOTIFICATIONS SECTION */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                        <Bell size={18} className="text-gray-500" />
                                        <h3 className="font-bold text-gray-900">Notifications</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Order Updates</p>
                                                    <p className="text-sm text-gray-500 max-w-sm">Receive updates about your order status, shipping, and delivery.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked={notifications.orderUpdates} onChange={() => handleNotificationToggle('orderUpdates')} />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Promotions & Offers</p>
                                                    <p className="text-sm text-gray-500 max-w-sm">Be the first to know about sales, new arrivals, and exclusive offers.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked={notifications.promotions} onChange={() => handleNotificationToggle('promotions')} />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                                </label>
                                            </div>
                                            <hr className="border-gray-100 my-4" />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                                    <p className="text-sm text-gray-500">Receive emails at {user.email}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked={notifications.email} onChange={() => handleNotificationToggle('email')} />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACCOUNT STATUS SECTION */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                        <Shield size={18} className="text-gray-500" />
                                        <h3 className="font-bold text-gray-900">Account Status</h3>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Account Status</p>
                                            <p className={`font-bold ${user.isActive !== false ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.isActive !== false ? 'Active' : 'Blocked'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Email Verification</p>
                                            <div className="flex items-center gap-2">
                                                <p className={`font-bold ${user.isVerified ? 'text-green-600' : 'text-orange-500'}`}>
                                                    {user.isVerified ? 'Verified' : 'Unverified'}
                                                </p>
                                                {!user.isVerified && (
                                                    <button onClick={() => alert('Verification email sent!')} className="text-xs bg-black text-white px-2 py-1 rounded">Verify Now</button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Two-Factor Authentication</p>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-gray-400">Disabled</p>
                                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Coming Soon</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Member Since</p>
                                            <p className="font-medium text-gray-900">October 2023</p>
                                        </div>
                                    </div>
                                </div>

                                {/* DANGER ZONE */}
                                <div className="bg-red-50 rounded-lg border border-red-100 p-6">
                                    <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-red-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>

                                    <div className="flex items-center justify-between bg-white p-4 rounded border border-red-100">
                                        <div>
                                            <h4 className="font-bold text-red-700">Delete Account</h4>
                                            <p className="text-xs text-gray-500 mt-1">Permanently remove your account and all data.</p>
                                        </div>
                                        <button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                                            Delete My Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
                        <h3 className="text-xl font-bold font-playfair mb-6">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                        <form className="space-y-4" onSubmit={handleAddressSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="name" value={addressForm.name} onChange={handleInputChange} type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                                <input name="mobile" value={addressForm.mobile} onChange={handleInputChange} type="text" placeholder="Mobile Number" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                            </div>
                            <input name="street" value={addressForm.street} onChange={handleInputChange} type="text" placeholder="House No, Street" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="city" value={addressForm.city} onChange={handleInputChange} type="text" placeholder="City" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                                <input name="state" value={addressForm.state} onChange={handleInputChange} type="text" placeholder="State" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="zip" value={addressForm.zip} onChange={handleInputChange} type="text" placeholder="Pincode" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                                <select name="type" value={addressForm.type} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded">
                                    <option>Home</option>
                                    <option>Office</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                                    {editingAddress ? 'Update Address' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
