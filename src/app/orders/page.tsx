'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    RefreshCw,
    MapPin,
    CreditCard,
    Download,
    ChevronDown,
    ChevronUp,
    XCircle,
    ShoppingBag
} from 'lucide-react';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
}

interface ShippingInfo {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
}

interface Order {
    id: string; // "ORD-..."
    createdAt: string; // ISO string
    status: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: ShippingInfo;
    userEmail: string;
    paymentMethod?: string; // e.g. 'Stripe'
    transactionId?: string; // Mock
    trackingId?: string;
    carrier?: string;
    refundStatus?: string;
}

export default function OrdersPage() {
    const { user, isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return; // Wait for user

            try {
                // Determine query: prefer ID but fallback to email
                const query = user.id ? `userId=${user.id}` : `email=${user.email}`;
                const res = await fetch(`/api/orders/user?${query}`);

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    console.error("Failed to fetch user orders");
                }
            } catch (e) {
                console.error("Error loading orders", e);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        } else {
            // Give auth a moment or redirect
            // For now, loading state persists
            const timer = setTimeout(() => setLoading(false), 2000); // Falback
            return () => clearTimeout(timer);
        }
    }, [user, isAuthenticated]);

    // Handle Cancel Order
    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
            // Include userId or email so backend can authenticate as ownership
            const userId = user?.id || user?.email;
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Cancelled', userId: userId })
            });

            if (res.ok) {
                // Update local state
                setOrders(prev => prev.map(o =>
                    o.id === orderId ? { ...o, status: 'Cancelled' } : o
                ));
                alert("Order cancelled successfully.");
            } else {
                const errorData = await res.json();
                alert(`Failed to cancel order: ${errorData.message || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            alert("Error cancelling order.");
        }
    };

    // Handle Reorder
    const handleReorder = (order: Order) => {
        order.items.forEach(item => {
            // Adapt to CartItem interface
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1, // Add 1 of each or original qty? Let's do 1 for simplicity/safety
                size: item.size
            });
        });
        alert("Items added to cart!");
        router.push('/cart');
    };

    // Handle Download Invoice
    const handleDownloadInvoice = (orderId: string) => {
        alert(`Downloading invoice for ${orderId}... (Mock PDF)`);
    };

    // Toggle expand
    const toggleExpand = (id: string) => {
        setExpandedOrder(prev => prev === id ? null : id);
    };

    // Helper: Progress Bar Steps
    const getStatusStep = (status: string) => {
        switch (status) {
            case 'Pending': return 1;
            case 'Processing': return 2;
            case 'Shipped': return 3;
            case 'Delivered': return 4;
            default: return 0; // Cancelled
        }
    };

    if (!user && !loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center pt-20">
                    <h1 className="text-2xl font-playfair font-bold mb-4">Please Log In</h1>
                    <p className="text-gray-600 mb-8">You need to be logged in to view your orders.</p>
                    <Link href="/login" className="bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
                        Log In
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-32 pb-12 flex-1 max-w-5xl">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-8">My Orders</h1>

                {loading ? (
                    <div className="text-center py-12">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Package className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't placed any orders yet.</p>
                        <Link href="/" className="inline-block bg-gray-900 text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => {
                            const currentStep = getStatusStep(order.status);
                            const isCancelled = order.status === 'Cancelled';

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

                                    {/* Unexpanded Summary Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 mb-1">Order Placed</p>
                                                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">Total</p>
                                                    <p className="font-medium text-gray-900">${order.totalAmount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">Order ID</p>
                                                    <p className="font-medium text-gray-900 font-mono text-xs md:text-sm">{order.id}</p>
                                                </div>
                                                <div>
                                                    {/* Status Badge Small */}
                                                    <p className="text-gray-500 mb-1">Status</p>
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold 
                                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-50 text-blue-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                {/* Reorder Button */}
                                                {order.status === 'Delivered' && (
                                                    <button onClick={() => handleReorder(order)} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition flex items-center gap-2">
                                                        <ShoppingBag size={14} /> Buy Again
                                                    </button>
                                                )}

                                                {/* Track Order Button */}
                                                {order.status === 'Shipped' && (
                                                    <button
                                                        onClick={() => toggleExpand(order.id)}
                                                        className="px-4 py-2 border border-blue-200 text-blue-700 bg-blue-50 text-sm font-medium rounded hover:bg-blue-100 transition flex items-center gap-2"
                                                    >
                                                        <Truck size={14} /> Track Order
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => toggleExpand(order.id)}
                                                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded hover:bg-gray-50 transition flex items-center gap-2"
                                                >
                                                    {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                                                    {expandedOrder === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quick Item Preview (Horizontal Scroll) */}
                                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                                            {order.items.map((item, idx) => (
                                                <Link key={`${item.id}-${idx}`} href={`/product/${item.id}`} className="min-w-[60px] w-[60px] h-[80px] bg-gray-100 rounded border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity relative group">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e: any) => e.target.src = 'https://placehold.co/60x80?text=No+Img'}
                                                    />
                                                    {/* Tooltip on hover */}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Progress Bar (Only calculate if not cancelled) */}
                                        {!isCancelled && (
                                            <div className="relative w-full mt-4 mb-2 hidden sm:block">
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
                                                <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500"
                                                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>

                                                <div className="relative flex justify-between w-full">
                                                    {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                                        const stepNum = idx + 1;
                                                        const active = stepNum <= currentStep;
                                                        return (
                                                            <div key={step} className="flex flex-col items-center">
                                                                <div className={`w-4 h-4 rounded-full border-2 z-10 ${active ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}></div>
                                                                <span className={`text-xs mt-2 font-medium ${active ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {isCancelled && (
                                            <div className="p-3 bg-red-50 text-red-700 text-sm rounded mt-2 flex items-center gap-2">
                                                <XCircle size={16} /> This order has been cancelled.
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedOrder === order.id && (
                                        <div className="bg-gray-50 p-6 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                                                {/* Shipping Address */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                        <MapPin size={16} className="text-gray-500" /> Shipping Address
                                                    </h4>
                                                    <div className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded border border-gray-200">
                                                        {order.shippingAddress ? (
                                                            <>
                                                                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                                                                <p>{order.shippingAddress.street}</p>
                                                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                                                <p className="mt-1 text-gray-500">{order.shippingAddress.phone}</p>
                                                            </>
                                                        ) : (
                                                            <span className="italic">Address Unavailable</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Payment & Status Info */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                        <CreditCard size={16} className="text-gray-500" /> Payment & Status
                                                    </h4>
                                                    <div className="text-sm text-gray-600 bg-white p-4 rounded border border-gray-200 space-y-2">
                                                        <div className="flex justify-between">
                                                            <span>Method:</span>
                                                            <span className="font-medium text-gray-900">Card (Stripe)</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Payment:</span>
                                                            <span className="font-medium text-green-600 flex items-center gap-1">
                                                                <CheckCircle size={12} /> Paid
                                                            </span>
                                                        </div>

                                                        {/* Tracking Info */}
                                                        {(order.status === 'Shipped' || order.status === 'Delivered') && order.trackingId && (
                                                            <div className="pt-2 mt-2 border-t border-gray-100">
                                                                <p className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                                                                    <Truck size={12} /> Shipment Details
                                                                </p>
                                                                <p className="flex justify-between">
                                                                    <span>Courier:</span>
                                                                    <span className="font-medium">{order.carrier || 'Standard'}</span>
                                                                </p>
                                                                <p className="flex justify-between">
                                                                    <span>Tracking:</span>
                                                                    <span className="font-mono text-xs bg-gray-100 px-1 rounded">{order.trackingId}</span>
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Refund Info */}
                                                        {order.refundStatus && (
                                                            <div className="pt-2 mt-2 border-t border-gray-100">
                                                                <p className="font-semibold text-red-600 mb-1 flex items-center gap-1">
                                                                    <RefreshCw size={12} /> Refund Status
                                                                </p>
                                                                <p className="font-medium text-gray-900">{order.refundStatus}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions Panel */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                        <Package size={16} className="text-gray-500" /> Actions
                                                    </h4>
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => handleDownloadInvoice(order.id)}
                                                            className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition"
                                                        >
                                                            <Download size={14} /> Download Invoice
                                                        </button>

                                                        {/* Cancel Button Only for Pending/Processing */}
                                                        {['Pending', 'Processing'].includes(order.status) && (
                                                            <button
                                                                onClick={() => handleCancelOrder(order.id)}
                                                                className="w-full text-left px-4 py-2 bg-white border border-red-200 text-red-600 rounded text-sm hover:bg-red-50 flex items-center gap-2 transition"
                                                            >
                                                                <XCircle size={14} /> Cancel Order
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Products List */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-4">Items in Order</h4>
                                                <div className="space-y-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={`${order.id}-${idx}`} className="flex gap-4 md:gap-6 items-start bg-white p-4 rounded border border-gray-200">
                                                            <Link href={`/product/${item.id}`} className="w-20 h-24 bg-gray-100 rounded overflow-hidden shrink-0 hover:opacity-80 transition-opacity">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e: any) => e.target.src = 'https://placehold.co/100x120?text=No+Img'}
                                                                />
                                                            </Link>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h5 className="font-medium text-gray-900">
                                                                            <Link href={`/product/${item.id}`} className="hover:underline">
                                                                                {item.name}
                                                                            </Link>
                                                                        </h5>
                                                                        <p className="text-sm text-gray-500 mt-1">Size: {item.size || 'M'} | Qty: {item.quantity}</p>
                                                                    </div>
                                                                    <p className="font-medium text-gray-900">${Number(item.price).toFixed(2)}</p>
                                                                </div>

                                                                {/* Review Button Logic: Only if Delivered */}
                                                                {order.status === 'Delivered' && (
                                                                    <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-3 font-medium">
                                                                        Write a Review
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
