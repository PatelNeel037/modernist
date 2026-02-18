'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
    User, Box, MapPin, Settings, LogOut,
    Plus, Edit2, Trash2, CheckCircle, AlertCircle, Ban
} from 'lucide-react';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    // Mock User Data
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '+1 (555) 123-4567',
        avatar: null
    });

    // Mock Addresses
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'Home',
            name: 'John Doe',
            street: '123 Fashion Ave, Apt 4B',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            mobile: '+1 (555) 123-4567',
            isDefault: true
        },
        {
            id: 2,
            type: 'Office',
            name: 'John Doe (Work)',
            street: '456 Tech Blvd, Suite 200',
            city: 'San Francisco',
            state: 'CA',
            zip: '94107',
            mobile: '+1 (555) 987-6543',
            isDefault: false
        }
    ]);

    const handleLogout = () => {
        // In a real app, this would clear tokens/cookies
        alert('Logged out successfully');
        window.location.href = '/login';
    };

    const handleDeleteAddress = (id: number) => {
        if (confirm('Are you sure you want to delete this address?')) {
            setAddresses(addresses.filter(a => a.id !== id));
        }
    };

    const handleSetDefault = (id: number) => {
        setAddresses(addresses.map(a => ({
            ...a,
            isDefault: a.id === id
        })));
        alert('Default address updated');
    };

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile updated successfully!');
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Password updated successfully!');
    };

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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <aside className="bg-white p-6 rounded-lg shadow-sm h-fit">
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
                                        onClick={() => setIsAddressModalOpen(true)}
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
                                    {addresses.map(addr => (
                                        <div key={addr.id} className="bg-white border border-gray-200 rounded-lg p-6 relative hover:shadow-md transition-shadow group">
                                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="text-gray-400 hover:text-black p-1"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${addr.type === 'Home' ? 'bg-blue-50 text-blue-700' :
                                                            addr.type === 'Office' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {addr.type}
                                                    </span>
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
                                                <p className="mt-2 text-gray-900 font-medium">Phone: {addr.mobile}</p>
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

                                {/* 1. Account Info */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold mb-6 pb-4 border-b border-gray-100">Account Information</h3>
                                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                defaultValue={user.name}
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                            <input
                                                type="tel"
                                                defaultValue={user.mobile}
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex justify-end">
                                            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">Save Changes</button>
                                        </div>
                                    </form>
                                </div>

                                {/* 2. Password */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold mb-6 pb-4 border-b border-gray-100">Change Password</h3>
                                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">Update Password</button>
                                        </div>
                                    </form>
                                </div>

                                {/* 3. Danger Zone */}
                                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                                    <h3 className="text-lg font-bold text-red-800 mb-6">Danger Zone</h3>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-red-700">Delete Account</h4>
                                            <p className="text-sm text-red-600">Permanently delete your account and all data.</p>
                                        </div>
                                        <button onClick={() => alert('Disabled for safety')} className="border border-red-300 text-red-700 px-4 py-2 rounded text-sm font-medium hover:bg-red-100 transition-colors">
                                            Delete Account
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
                        <h3 className="text-xl font-bold font-playfair mb-6">Add New Address</h3>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddressModalOpen(false); alert('Address saved!'); }}>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                                <input type="text" placeholder="Mobile Number" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                            </div>
                            <input type="text" placeholder="House No, Street" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="City" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                                <input type="text" placeholder="State" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Pincode" className="w-full px-4 py-2 border border-gray-300 rounded" required />
                                <select className="w-full px-4 py-2 border border-gray-300 rounded">
                                    <option>Home</option>
                                    <option>Office</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Save Address</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
