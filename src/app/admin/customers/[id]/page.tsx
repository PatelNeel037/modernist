'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    User, Mail, Phone, Calendar, Shield, Ban, CheckCircle,
    Trash2, Edit, AlertTriangle, Clock, MapPin,
    ShoppingCart, DollarSign, TrendingUp, Key, LogOut
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
}

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

interface UserDetail {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string; // or joined timestamp
    lastLogin?: string;
    isActive: boolean; // For Block/Unblock
    isVerified: boolean;
    status?: string; // 'active', 'blocked', 'deleted'
    addresses: Address[];
    adminNotes?: string;
}

interface CustomerData {
    user: UserDetail;
    orders: Order[];
    stats: {
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: string | null;
        averageOrderValue: number;
    };
    activityLog: { action: string; date: string }[];
}

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchCustomerData(params.id as string);
        }
    }, [params.id]);

    async function fetchCustomerData(id: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${id}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
                setNotes(json.user.adminNotes || '');
            } else {
                alert('Customer not found');
                router.push('/admin/customers');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleAction = async (action: string) => {
        if (!data) return;

        let confirmMsg = '';
        if (action === 'block') confirmMsg = 'Are you sure you want to BLOCK this customer?';
        if (action === 'unblock') confirmMsg = 'Unblock this customer?';
        if (action === 'verify') confirmMsg = 'Manually verify this email?';
        if (action === 'delete') confirmMsg = 'WARNING: Are you sure you want to DELETE this account? This cannot be undone.';
        if (action === 'reset_password') confirmMsg = 'Send reset password link? (Simulation)';

        if (confirmMsg && !confirm(confirmMsg)) return;

        if (action === 'delete') {
            // Delete API
            try {
                const res = await fetch(`/api/admin/users/${data.user.id}`, { method: 'DELETE' });
                if (res.ok) {
                    alert('User deleted successfully');
                    router.push('/admin/customers');
                }
            } catch (e) {
                alert('Failed to delete user');
            }
            return;
        }

        // Other actions (PUT)
        try {
            const res = await fetch(`/api/admin/users/${data.user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            if (res.ok) {
                alert(`Action ${action} successful`);
                fetchCustomerData(data.user.id.toString());
            }
        } catch (e) {
            alert('Action failed');
        }
    };

    const saveNotes = async () => {
        if (!data) return;
        setIsSavingNotes(true);
        try {
            const res = await fetch(`/api/admin/users/${data.user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes })
            });
            if (res.ok) {
                alert('Notes saved');
            }
        } catch (e) {
            alert('Failed to save notes');
        } finally {
            setIsSavingNotes(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading customer profile...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Customer not found</div>;

    const { user, orders, stats, activityLog } = data;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            {/* Admin Navbar would transform here, but let's assume we use the layout or just basic header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/customers" className="text-gray-500 hover:text-black flex items-center gap-1 text-sm font-medium">
                            ← Back to Customers
                        </Link>
                        <h1 className="text-xl font-bold border-l border-gray-300 pl-4">{user.name}</h1>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isActive !== false ? 'Active' : 'Blocked'}
                        </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">ID: {user.id}</div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-6xl">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN - Main Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Basic Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <User size={18} className="text-gray-500" />
                                <h2 className="font-bold text-gray-800">Basic Information</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Full Name</label>
                                    <p className="font-medium text-lg text-gray-900">{user.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</label>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-lg text-gray-900">{user.email}</p>
                                        {user.isVerified ? (
                                            <span title="Verified"><CheckCircle size={16} className="text-green-500" /></span>
                                        ) : (
                                            <span title="Unverified"><AlertTriangle size={16} className="text-orange-500" /></span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</label>
                                    <p className="font-medium text-gray-900">{user.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Joined Date</label>
                                    <p className="font-medium text-gray-900">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Order History */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart size={18} className="text-gray-500" />
                                    <h2 className="font-bold text-gray-800">Order History</h2>
                                </div>
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">{stats.totalOrders} Orders</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3">Order ID</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.length === 0 ? (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No orders found.</td></tr>
                                        ) : (
                                            orders.map(order => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-3 font-medium text-black">#{order.id}</td>
                                                    <td className="px-6 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-blue-50 text-blue-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-right font-medium">${Number(order.totalAmount).toFixed(2)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Customer Insights (Optional Premium) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wide">Total Spent</span>
                                <div className="text-xl md:text-2xl font-bold text-green-600 mt-1">${stats.totalSpent.toFixed(2)}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wide">Avg Order Value</span>
                                <div className="text-xl md:text-2xl font-bold text-blue-600 mt-1">${stats.averageOrderValue.toFixed(2)}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wide">Return Rate</span>
                                <div className="text-xl md:text-2xl font-bold text-purple-600 mt-1">0%</div>
                                <span className="text-xs text-gray-400">Calculated</span>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wide">LTV Rating</span>
                                <div className="text-xl md:text-2xl font-bold text-orange-600 mt-1">
                                    {stats.totalSpent > 1000 ? 'Platinum' : stats.totalSpent > 500 ? 'Gold' : 'Silver'}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - Sidebar */}
                    <div className="space-y-8">

                        {/* 4. Account Control */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-900 text-white flex items-center gap-2">
                                <Shield size={18} />
                                <h2 className="font-bold">Account Controls</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                {user.isActive !== false ? (
                                    <button onClick={() => handleAction('block')} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 py-2 rounded text-sm font-bold hover:bg-red-100 transition-colors">
                                        <Ban size={16} /> Block Customer
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="bg-red-50 text-red-800 text-xs p-2 rounded text-center mb-2">
                                            Account is currently blocked.
                                        </div>
                                        <button onClick={() => handleAction('unblock')} className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-600 border border-green-200 py-2 rounded text-sm font-bold hover:bg-green-100 transition-colors">
                                            <CheckCircle size={16} /> Unblock Customer
                                        </button>
                                    </div>
                                )}

                                <button onClick={() => handleAction('reset_password')} className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                                    <Key size={16} /> Send Password Reset
                                </button>

                                <button onClick={() => handleAction('verify')} className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                                    <CheckCircle size={16} /> Manually Verify Email
                                </button>

                                <hr className="border-gray-100 my-2" />

                                <button onClick={() => handleAction('delete')} className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 py-2 rounded text-sm font-medium hover:bg-red-50 transition-colors">
                                    <Trash2 size={16} /> Delete Account
                                </button>
                            </div>
                        </div>

                        {/* 5. Address Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <MapPin size={18} className="text-gray-500" />
                                <h2 className="font-bold text-gray-800">Addresses</h2>
                            </div>
                            <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                                {!user.addresses || user.addresses.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-4">No addresses saved.</p>
                                ) : (
                                    user.addresses.map((addr, idx) => (
                                        <div key={idx} className="bg-gray-50 p-3 rounded text-sm relative border border-gray-100">
                                            {addr.isDefault && (
                                                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] uppercase font-bold rounded">Default</span>
                                            )}
                                            <p className="font-bold text-gray-800">{addr.name}</p>
                                            <p className="text-gray-600 leading-tight mt-1">{addr.street}</p>
                                            <p className="text-gray-500 mt-1">{addr.city}, {addr.state} {addr.zip}</p>
                                            <p className="text-gray-500 text-xs mt-2 flex items-center gap-1"><Phone size={10} /> {addr.phone}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 7. Admin Notes */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <Edit size={18} className="text-gray-500" />
                                <h2 className="font-bold text-gray-800">Admin Notes</h2>
                            </div>
                            <div className="p-4">
                                <textarea
                                    className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-black min-h-[120px]"
                                    placeholder="Add private notes about this customer..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                                <div className="mt-2 flex justify-end">
                                    <button
                                        onClick={saveNotes}
                                        disabled={isSavingNotes}
                                        className="bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    >
                                        {isSavingNotes ? 'Saving...' : 'Save Note'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 5. Activity Log (Optional) */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <Clock size={18} className="text-gray-500" />
                                <h2 className="font-bold text-gray-800">Activity Log</h2>
                            </div>
                            <div className="p-4">
                                <div className="space-y-4">
                                    {activityLog.map((log, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gray-300 mt-2 flex-shrink-0"></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{log.action}</p>
                                                <p className="text-xs text-gray-400">{new Date(log.date).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
