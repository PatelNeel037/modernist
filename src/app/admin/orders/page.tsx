'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './orders.module.css';
import { RefreshCw, Search, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Order {
    id: string; // The full "ORD-..." ID
    userId: string | null;
    userEmail?: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    user?: { name: string };
    guestInfo?: { name: string };
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
            const response = await fetch('/api/orders/all');
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
                const userName = order.user?.name || order.guestInfo?.name || 'Guest';
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
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
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
                                        <td className="font-mono text-gray-600">
                                            #{order.id.length > 10 ? order.id.substring(4, 10) + '...' : order.id}
                                        </td>
                                        <td>
                                            {order.user?.name || order.guestInfo?.name || 'Guest'}
                                        </td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>${Number(order.totalAmount).toFixed(2)}</td>
                                        <td>
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
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400">
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
