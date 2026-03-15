'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './orders.module.css';
import { RefreshCw, Search, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatINR } from '@/lib/currency';
import toast from 'react-hot-toast';

interface Order {
    id: string; // The full "ORD-..." ID
    userId: string | null;
    userEmail?: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    user?: { name: string };
    guestInfo?: { name: string };
    shippingAddress?: { name: string };
}

export default function AdminOrdersPage() {
    const { isAuthenticated } = useAuth();
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    async function loadOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem('modernist_admin_token');
            const response = await fetch('/api/orders/all', {
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAllOrders(data);
                setFilteredOrders(data);
            }
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteOrder(id: string) {
        if (!confirm('Are you absolutely sure you want to PERMANENTLY delete this order? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('modernist_admin_token');
            const response = await fetch(`/api/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            if (response.ok) {
                toast.success('Order deleted successfully');
                setAllOrders(prev => prev.filter(o => o.id !== id));
            } else {
                toast.error('Failed to delete order');
            }
        } catch (error) {
            console.error("Delete failed", error);
            toast.error('An error occurred during deletion');
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    // Apply Filters whenever inputs change
    useEffect(() => {
        let result = [...allOrders];

        // 1. Status Filter
        if (statusFilter) {
            result = result.filter(order => order.status === statusFilter);
        }

        // 2. Date Filter
        if (dateFilter) {
            result = result.filter(order => {
                // Formatting date to YYYY-MM-DD for comparison
                // Using local time assumption as per user request logic
                const orderDate = new Date(order.createdAt);
                const year = orderDate.getFullYear();
                const month = String(orderDate.getMonth() + 1).padStart(2, '0');
                const day = String(orderDate.getDate()).padStart(2, '0');
                const formatted = `${year}-${month}-${day}`;
                return formatted === dateFilter;
            });
        }

        // 3. Search Filter (ID or Name)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(order => {
                const matchesId = order.id.toLowerCase().includes(lowerSearch);
                const userName = order.shippingAddress?.name || order.guestInfo?.name || 'Guest';
                const matchesName = userName.toLowerCase().includes(lowerSearch);
                return matchesId || matchesName;
            });
        }

        setFilteredOrders(result);
    }, [statusFilter, dateFilter, searchTerm, allOrders]);

    return (
        <div className={styles.ordersContent}>
            <h2 className={styles.headerTitle}>Order Management</h2>

            {/* Filters */}
            <div className={styles.filtersContainer}>
                <div className={styles.filterGroup}>
                    <label>Status</label>
                    <select
                        className={styles.filterInput}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option className="bg-[#0f172a] text-white" value="">All Statuses</option>
                        <option className="bg-[#0f172a] text-white" value="Pending">Pending</option>
                        <option className="bg-[#0f172a] text-white" value="Processing">Processing</option>
                        <option className="bg-[#0f172a] text-white" value="Shipped">Shipped</option>
                        <option className="bg-[#0f172a] text-white" value="Delivered">Delivered</option>
                        <option className="bg-[#0f172a] text-white" value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Date Range</label>
                    <input
                        type="date"
                        className={styles.filterInput}
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label>Order ID / Customer</label>
                    <div className="relative">
                        <input
                            type="text"
                            className={styles.filterInput}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Icon could go here absolutely positioned if using pure CSS modules carefully */}
                    </div>
                </div>

                <div className={styles.filterGroup} style={{ flex: '0 0 auto' }}>
                    <button className={styles.btnFilter} onClick={loadOrders} disabled={loading}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.adminTable}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">Loading orders...</td>
                                </tr>
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="font-mono text-slate-400 font-medium">
                                            #{order.id.length > 10 ? order.id.substring(4, 10) + '...' : order.id}
                                        </td>
                                        <td className="text-slate-200">
                                            {order.shippingAddress?.name || order.guestInfo?.name || 'Guest'}
                                        </td>
                                        <td className="text-slate-300">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="text-slate-100 font-medium">{formatINR(order.totalAmount)}</td>
                                        <td className="flex items-center gap-3">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className={styles.btnView}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <Eye size={16} />
                                                View
                                            </Link>
                                            <button
                                                className={styles.btnIconDelete}
                                                onClick={() => handleDeleteOrder(order.id)}
                                                title="Delete Permanently"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-500 uppercase tracking-widest text-sm font-semibold">
                                        No orders found matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
