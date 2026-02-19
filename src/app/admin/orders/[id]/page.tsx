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
    Truck
} from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statusInput, setStatusInput] = useState('');

    const orderId = params.id as string;

    async function loadOrder() {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
                setStatusInput(data.status); // Initialize dropdown
            } else {
                alert('Order not found');
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

    const handleStatusUpdate = async () => {
        if (!statusInput) return;
        if (statusInput === order.status) return; // No change

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: statusInput })
            });

            if (res.ok) {
                // Refresh data
                const updated = await res.json();
                setOrder(prev => ({ ...prev, status: updated.status || statusInput }));
                alert('Order status updated successfully');
            } else {
                alert('Update failed');
            }
        } catch (e) {
            console.error(e);
            alert('Error updating status');
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading Order Details...</div>;
    if (!order) return null;

    // Helper to format currency
    const formatPrice = (amount: any) => {
        const num = Number(amount);
        return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
    };

    return (
        <div className={styles.orderDetailsContent}>
            {/* Header */}
            <div className={styles.headerSection}>
                <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
                        <Link href="/admin/orders" className="hover:text-gray-900 flex items-center gap-1">
                            <ChevronLeft size={14} /> Back to Orders
                        </Link>
                    </div>
                    <div className="flex items-end gap-4">
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
                                                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0 border border-gray-200">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Change Order Status</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={statusInput}
                                    onChange={(e) => setStatusInput(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <button
                                className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50 h-[42px]"
                                onClick={handleStatusUpdate}
                                disabled={statusInput === order.status}
                            >
                                Update Status
                            </button>
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
                                <div className="font-medium text-lg">{order.user?.name || order.guestInfo?.name || 'Guest User'}</div>
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
                            <hr className="border-gray-100" />
                            <div>
                                <div className={styles.infoLabel}><MapPin size={14} className="inline mr-1" /> Shipping Address</div>
                                <div className="text-sm text-gray-600 leading-relaxed mt-2 p-3 bg-gray-50 rounded">
                                    {order.shippingAddress ? (
                                        <>
                                            <span className="font-medium text-gray-900">{order.shippingAddress.name}</span><br />
                                            {order.shippingAddress.street}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                                            {/* Country handling if needed */}
                                        </>
                                    ) : (
                                        <span className="italic text-gray-400">Address not provided</span>
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
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (0%)</span>
                                <span>$0.00</span>
                            </div>
                            <hr className="border-gray-100 my-2" />
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatPrice(order.totalAmount)}</span>
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
                                onClick={() => { if (confirm('Are you sure you want to cancel this order?')) setStatusInput('Cancelled'); handleStatusUpdate(); }}
                            >
                                <XCircle size={16} /> Cancel Order
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
