'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './order-details.module.css';
import {
    Printer,
    User,
    MapPin,
    CreditCard,
    Calendar,
    Package,
    Mail,
    Phone,
    ChevronLeft,
    CheckCircle,
    XCircle,
    Truck,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatINR, formatPrice } from '@/lib/currency';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statusInput, setStatusInput] = useState('');
    const [carrier, setCarrier] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [refundStatus, setRefundStatus] = useState('');

    const orderId = params.id as string;

    async function loadOrder() {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
                setStatusInput(data.status);
                setCarrier(data.carrier || '');
                setTrackingId(data.trackingId || '');
                setRefundStatus(data.refundStatus || '');
            } else {
                toast.error('Order not found');
                router.push('/admin/orders');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const handleStatusUpdate = async (overrides: any = {}) => {
        // Prepare payload with overrides taking precedence
        const payload = {
            status: overrides.status || statusInput,
            trackingId: overrides.trackingId !== undefined ? overrides.trackingId : trackingId,
            carrier: overrides.carrier !== undefined ? overrides.carrier : carrier,
            refundStatus: overrides.refundStatus !== undefined ? overrides.refundStatus : refundStatus
        };

        // Remove empty strings if needed, or keep them to clear fields? 
        // MockStore expects them as part of updates object.

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // Refresh data
                const updated = await res.json();
                setOrder(updated);

                // Sync state with updated data to ensure UI consistency
                if (updated.status) setStatusInput(updated.status);
                if (updated.trackingId !== undefined) setTrackingId(updated.trackingId || '');
                if (updated.carrier !== undefined) setCarrier(updated.carrier || '');
                if (updated.refundStatus !== undefined) setRefundStatus(updated.refundStatus || '');

                toast.success('Order updated successfully');
            } else {
                toast.error('Update failed');
            }
        } catch (e) {
            console.error(e);
            toast.error('Error updating status');
        }
    };

    async function handleDelete() {
        if (!confirm('Are you absolutely sure you want to PERMANENTLY delete this order? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('modernist_admin_token');
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            if (response.ok) {
                toast.success('Order permanently deleted');
                router.push('/admin/orders');
            } else {
                toast.error('Failed to delete order');
            }
        } catch (error) {
            console.error("Delete failed", error);
            toast.error('An error occurred during deletion');
        }
    }

    if (loading) return <div className="p-12 text-center text-gray-500">Loading Order Details...</div>;
    if (!order) return null;



    return (
        <div className={styles.orderDetailsContent}>
            {/* Header */}
            <div className={styles.headerSection}>
                <div>
                    <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm">
                        <Link href="/admin/orders" className="hover:text-white flex items-center gap-2 transition-colors">
                            <ChevronLeft size={16} /> <span className="uppercase tracking-widest font-bold text-[10px]">Back to Orders</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <h2 className={styles.headerTitle}>Order #{order.id}</h2>
                        <span className={`${styles.statusBadge} ${styles['status' + order.status]} mb-2`}>
                            {order.status}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className={`${styles.actionBtn} ${styles.printBtn}`} onClick={() => window.print()}>
                        <Printer size={18} /> Print Invoice
                    </button>
                    {/* <button className="px-4 py-2 border rounded hover:bg-gray-50 text-gray-700 font-medium">
                        Download PDF
                    </button> */}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.detailsGrid}>

                {/* LEFT COLUMN */}
                <div className="space-y-6">

                    {/* 1. Order Information */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3><Calendar size={18} className="inline mr-2 mb-1" /> Order Information</h3>
                        </div>
                        <div className={styles.infoRow}>
                            <div>
                                <div className={styles.infoLabel}>Order Date</div>
                                <div className={styles.infoValue}>{new Date(order.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className={styles.infoLabel}>Payment Method</div>
                                <div className={styles.infoValue}>Credit Card (Stripe)</div>
                            </div>
                            <div>
                                <div className={styles.infoLabel}>Payment Status</div>
                                <div className={styles.infoValue}>
                                    <span className="text-green-600 font-bold flex items-center gap-1">
                                        <CheckCircle size={14} /> Paid
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className={styles.infoLabel}>Shipping Method</div>
                                <div className={styles.infoValue}>Standard Free Shipping</div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Products List */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3><Package size={18} className="inline mr-2 mb-1" /> Items in Order</h3>
                        </div>
                        <table className={styles.itemsTable}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className={styles.prodWrapper}>
                                            <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden shrink-0 border border-white/5">
                                                    <img
                                                        src={item.image || '/images/placeholder.png'}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e: any) => { e.target.src = 'https://placehold.co/50x50?text=No+Img'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className={styles.prodName}>{item.name}</div>
                                                    <div className={styles.prodMeta}>Size: {item.size || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{formatPrice(item.price)}</td>
                                        <td>{item.quantity}</td>
                                        <td className="text-right font-medium">{formatPrice(Number(item.price) * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 5. Status Control */}
                    <div className={styles.card} style={{ borderLeft: '4px solid #3498db' }}>
                        <div className={styles.cardHeader}>
                            <h3><Truck size={18} className="inline mr-2 mb-1" /> Update Status</h3>
                        </div>
                        <div className="flex items-end gap-4 p-2">
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Change Order Status</label>
                                <select
                                    className="w-full p-3 bg-black/20 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={statusInput}
                                    onChange={(e) => setStatusInput(e.target.value)}
                                >
                                    <option className="bg-[#0f172a] text-white" value="Pending">Pending</option>
                                    <option className="bg-[#0f172a] text-white" value="Processing">Processing</option>
                                    <option className="bg-[#0f172a] text-white" value="Shipped">Shipped</option>
                                    <option className="bg-[#0f172a] text-white" value="Delivered">Delivered</option>
                                    <option className="bg-[#0f172a] text-white" value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                {statusInput === 'Shipped' && (
                                    <div className="flex gap-2 mb-2 animate-in fade-in slide-in-from-top-1">
                                        <input
                                            type="text"
                                            placeholder="Carrier (e.g. FedEx)"
                                            className="flex-1 p-3 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            value={carrier}
                                            onChange={(e) => setCarrier(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Tracking ID"
                                            className="flex-1 p-3 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            value={trackingId}
                                            onChange={(e) => setTrackingId(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        className="h-12 bg-blue-600/20 border border-blue-500/50 text-blue-400 px-8 py-2 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-blue-600/30 hover:text-blue-300 transition-all disabled:opacity-30 flex-1 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                                        onClick={handleStatusUpdate}
                                        disabled={statusInput === order.status && !trackingId && !carrier && !refundStatus}
                                    >
                                        Update Order State
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Refund Status Control */}
                        <div className="p-4 border-t border-white/5">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Refund Status</label>
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 p-3 bg-black/20 border border-white/5 rounded-xl text-white focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                                    value={refundStatus}
                                    onChange={(e) => setRefundStatus(e.target.value)}
                                >
                                    <option className="bg-[#0f172a] text-white" value="">None</option>
                                    <option className="bg-[#0f172a] text-white" value="Refund Initiated">Refund Initiated</option>
                                    <option className="bg-[#0f172a] text-white" value="Refund Processing">Refund Processing</option>
                                    <option className="bg-[#0f172a] text-white" value="Refunded">Refunded</option>
                                </select>
                                <button
                                    className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                                    onClick={handleStatusUpdate}
                                >
                                    Set Refund Status
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">

                    {/* 2. Customer Information */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3><User size={18} className="inline mr-2 mb-1" /> Customer Details</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className={styles.infoLabel}>Name</div>
                                <div className="font-medium text-lg">{order.shippingAddress?.name || order.guestInfo?.name || 'Guest User'}</div>
                            </div>
                            <div>
                                <div className={styles.infoLabel}>Contact Info</div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                    <Mail size={14} className="text-gray-400" />
                                    {order.user?.email || order.guestInfo?.email || order.userEmail || 'No Email'}
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                    <Phone size={14} className="text-gray-400" />
                                    {order.shippingAddress?.phone || 'No Phone'}
                                </div>
                            </div>
                            <hr className="border-white/5" />
                            <div>
                                <div className={styles.infoLabel}><MapPin size={14} className="inline mr-1" /> Shipping Address</div>
                                <div className="text-sm text-slate-300 leading-relaxed mt-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    {order.shippingAddress ? (
                                        <>
                                            <span className="font-bold text-white text-base">{order.shippingAddress.name}</span><br />
                                            <span className="opacity-70">{order.shippingAddress.street}</span><br />
                                            <span className="opacity-70">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</span><br />
                                        </>
                                    ) : (
                                        <span className="italic text-slate-500">Address not provided</span>
                                    )}
                                </div>
                            </div>
                            {/* Billing Address could be same */}
                        </div>
                    </div>

                    {/* 4. Order Summary */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3><CreditCard size={18} className="inline mr-2 mb-1" /> Order Summary</h3>
                        </div>
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between text-slate-400">
                                <span className="text-xs uppercase tracking-widest font-bold">Subtotal</span>
                                <span className="font-mono">{formatINR(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span className="text-xs uppercase tracking-widest font-bold">Shipping</span>
                                <span className="font-mono">{formatINR(0)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span className="text-xs uppercase tracking-widest font-bold">Tax (0%)</span>
                                <span className="font-mono">{formatINR(0)}</span>
                            </div>
                            <hr className="border-white/5 my-4" />
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span className="uppercase tracking-tighter">Total</span>
                                <span className="font-mono text-emerald-400">{formatINR(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 6. Extra Actions */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded p-2 hover:bg-gray-50 text-gray-700 text-sm font-medium transition">
                                <Mail size={16} /> Send Email to Customer
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 rounded p-2 hover:bg-red-50 text-sm font-medium transition"
                                onClick={() => { if (confirm('Are you sure you want to cancel this order?')) handleStatusUpdate({ status: 'Cancelled' }); }}
                            >
                                <XCircle size={16} /> Cancel Order
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-500 rounded p-2 hover:bg-red-500/10 text-sm font-medium transition"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} /> Permanently Delete
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
