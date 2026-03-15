'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './customers.module.css';
import { Search, User, Filter, Trash2 } from 'lucide-react';

interface Customer {
    id: string; // Changed to string as MongoDB IDs are strings
    name: string;
    email: string;
    role: string;
    joined: number;
    totalOrders: number;
    totalSpent: number;
    status?: string; // active, blocked
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    async function loadCustomers() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you absolutely sure you want to PERMANENTLY delete user "${name}"? This action cannot be undone and will remove them from the database.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Remove from local state
                setCustomers(prev => prev.filter(c => c.id !== id));
                alert('User deleted successfully.');
            } else {
                const data = await res.json();
                alert(data.message || 'Error deleting user.');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to delete user.');
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    // Filter Logic
    const filteredCustomers = customers.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (filterStatus !== 'all') {
            // Mock status logic if not present in DB
            const status = c.status || 'active';
            matchesStatus = status === filterStatus;
        }

        return matchesSearch && matchesStatus;
    });

    return (
        <div className={styles.customersContent}>
            <div className={styles.headerSection}>
                <h2 className={styles.headerTitle}>Customer Database</h2>
            </div>

            <div className={styles.controlsContainer}>
                <div className={styles.searchBox}>
                    <Search size={18} className="absolute left-3 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className={styles.filterSelect}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option className="bg-[#0f172a] text-white" value="all">All Statuses</option>
                        <option className="bg-[#0f172a] text-white" value="active">Active</option>
                        <option className="bg-[#0f172a] text-white" value="blocked">Blocked</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Orders</th>
                            <th>Total Spent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-8">Loading Customers...</td></tr>
                        ) : filteredCustomers.length > 0 ? (
                            filteredCustomers.map(customer => (
                                <tr key={customer.id}>
                                    <td>
                                        <div className="flex items-center">
                                            <div className={styles.userAvatar}>
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="font-medium text-slate-200">{customer.name}</div>
                                        </div>
                                    </td>
                                    <td className="text-slate-400">{customer.email}</td>
                                    <td>
                                        <span className={`${styles.badge} ${customer.status === 'blocked' ? styles.blockedBadge : styles.activeBadge}`}>
                                            {customer.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="text-slate-500">{new Date(customer.joined).toLocaleDateString()}</td>
                                    <td className="text-center">{customer.totalOrders}</td>
                                    <td className="font-mono text-slate-200 font-medium">${customer.totalSpent.toFixed(2)}</td>
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <Link
                                                href={`/admin/customers/${customer.id}`}
                                                className="text-blue-500 hover:text-blue-400 transition-colors text-sm font-bold uppercase tracking-wider"
                                            >
                                                View
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(customer.id, customer.name)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all group outline-none focus:ring-1 focus:ring-red-500"
                                                title="Delete Permanently"
                                            >
                                                <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={7} className="text-center py-8 text-slate-500 uppercase tracking-widest text-sm font-semibold">No customers found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    );
}
