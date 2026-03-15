'use client';
import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import {
    Users,
    DollarSign,
    ShoppingBag,
    TrendingUp,
    ArrowUp,
    Package,
    AlertTriangle
} from 'lucide-react';
import { formatINR } from '@/lib/currency';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const statsRes = await fetch('/api/admin/stats');
                const statsData = await statsRes.json();
                setStats(statsData);

                const ordersRes = await fetch('/api/orders/all');
                const ordersData = await ordersRes.json();
                if (Array.isArray(ordersData)) {
                    setRecentOrders(ordersData.slice(0, 5)); // Top 5
                } else {
                    console.error("API Error fetching orders:", ordersData);
                    setRecentOrders([]);
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        }
        fetchData();
    }, []);

    if (!stats) return <div className="p-8">Loading Dashboard...</div>;

    return (
        <>
            <div className={styles.header}>
                <div>
                    <h2>Dashboard</h2>
                    <p className={styles.subHeader}>How is your business doing today?</p>
                </div>
                <div>
                    <span className="text-slate-400 font-medium font-mono text-sm tracking-wide uppercase">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Revenue</span>
                        <div className={`${styles.statIcon} ${styles.iconGreen}`}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>{formatINR(stats.revenue.total)}</div>
                    <div className={styles.statChange}>
                        <ArrowUp size={14} />
                        <span className="text-green-500 font-bold mr-1">+{formatINR(stats.revenue.today)}</span> today
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Orders</span>
                        <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>
                        {Number(Object.values(stats.orders).reduce((a: any, b: any) => a + Number(b), 0))}
                    </div>
                    <div className={styles.statChange}>
                        <span className="text-blue-500 font-medium">{stats.orders.Pending || 0} Pending</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Customers</span>
                        <div className={`${styles.statIcon} ${styles.iconPurple}`}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>{stats.customers}</div>
                    <div className={styles.statChange}>Active Users</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Sales This Month</span>
                        <div className={`${styles.statIcon} ${styles.iconOrange}`}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className={styles.statValue}>{formatINR(stats.revenue.month)}</div>
                    <div className={styles.statChange}>Growth</div>
                </div>
            </div>

            {/* Status Overview */}
            <div className={styles.statusOverview}>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Order Status Summary</h3>
                <div className={styles.statusGrid}>
                    <div className={styles.statusCard}>
                        <h4 className="text-orange-400 font-bold">{stats.orders.Pending || 0}</h4>
                        <p>Pending</p>
                    </div>
                    <div className={styles.statusCard}>
                        <h4 className="text-blue-400 font-bold">{stats.orders.Processing || 0}</h4>
                        <p>Processing</p>
                    </div>
                    <div className={styles.statusCard}>
                        <h4 className="text-green-400 font-bold">{stats.orders.Shipped || 0}</h4>
                        <p>Shipped</p>
                    </div>
                    <div className={styles.statusCard}>
                        <h4 className="text-teal-400 font-bold">{stats.orders.Delivered || 0}</h4>
                        <p>Delivered</p>
                    </div>
                    <div className={styles.statusCard}>
                        <h4 className="text-red-400 font-bold">{stats.orders.Cancelled || 0}</h4>
                        <p>Cancelled</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders & Alerts */}
            <div className={styles.dashboardRow}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Orders</h3>
                        <a href="/admin/orders" className="text-blue-500 text-sm font-medium hover:underline">View All</a>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order: any) => (
                                        <tr key={order.id}>
                                            <td className="font-mono text-slate-400 font-medium">
                                                #{order.id && typeof order.id === 'string' && order.id.length > 10 ? order.id.substring(4, 10) + '...' : order.id}
                                            </td>
                                            <td className="text-slate-200"> {order.shippingAddress?.name || order.guestInfo?.name || order.userEmail || 'Guest'}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${styles['status' + order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{formatINR(order.totalAmount || 0)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="text-center py-4 text-gray-400">No orders yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3>Low Stock Alert</h3>
                        <AlertTriangle className="text-red-500" size={20} />
                    </div>
                    <table className={styles.table}>
                        <tbody>
                            {stats.lowStock && stats.lowStock.length > 0 ? (
                                stats.lowStock.map((p: any) => (
                                    <tr key={p.id}>
                                        <td className="flex items-center gap-2">
                                            <span className="text-red-400 font-bold text-xs bg-red-400/10 px-2 py-1 rounded">{p.stock} left</span>
                                            <span className="text-slate-200 font-medium">{p.name}</span>
                                        </td>
                                        <td className="text-right text-slate-500 text-xs uppercase tracking-wider font-semibold hover:text-white cursor-pointer transition-colors">Manage</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td className="text-green-500 text-center">All Stock Healthy</td></tr>
                            )}
                        </tbody>
                    </table>

                    <div className={`${styles.cardHeader} mt-8`}>
                        <h3>Top Selling</h3>
                        <TrendingUp className="text-yellow-500" size={20} />
                    </div>
                    {stats.topSelling && stats.topSelling.length > 0 ? (
                        <table className={styles.table}>
                            <tbody>
                                {stats.topSelling.map((p: any, i: number) => (
                                    <tr key={i}>
                                        <td className="font-medium text-slate-200">{p.name}</td>
                                        <td className="text-right text-slate-400 font-mono text-sm">{p.count} sold</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-slate-500 text-sm py-4 uppercase tracking-widest font-semibold">No sales data yet</div>
                    )}
                </div>
            </div>
        </>
    );
}
