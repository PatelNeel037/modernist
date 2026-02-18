'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, Clock, CheckCircle, Truck, RefreshCw } from 'lucide-react';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
}

interface Order {
    id: string;
    date: string;
    status: string;
    items: OrderItem[];
    total: number;
    shipping: any;
    userEmail: string;
}

export default function OrdersPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not logged in
        // Note: Auth check might be async or delayed, but let's check user existence
        // If strict protection needed, we'd do it better.
        // For now, we wait for mount.

        const fetchOrders = () => {
            if (!user) {
                // If mocked auth is slow, this might trigger prematurely.
                // But typically user from context is loaded or null.
                return;
            }

            try {
                const storedOrders = localStorage.getItem('modernist_orders');
                if (storedOrders) {
                    const allOrders: Order[] = JSON.parse(storedOrders);
                    // Filter by user email
                    const userOrders = allOrders.filter(o => o.userEmail === user.email);
                    // Sort by date desc
                    userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setOrders(userOrders);
                }
            } catch (e) {
                console.error("Failed to load orders", e);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        } else {
            // Maybe wait a bit or redirect
            // router.push('/login'); 
            setLoading(false);
        }

    }, [user, isAuthenticated, router]);

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

            <div className="container mx-auto px-6 pt-32 pb-12 flex-1">
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
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500">Order Placed</p>
                                            <p className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Total</p>
                                            <p className="font-medium text-gray-900">${order.total}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Ship To</p>
                                            <p className="font-medium text-gray-900 group relative cursor-help">
                                                {order.shipping?.name}
                                                {/* Tooltip for address could go here */}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            Order # {order.id}
                                        </div>
                                        {/* <Link href={`/orders/${order.id}`} className="text-sm text-blue-600 hover:underline">
                                            View Details
                                        </Link> */}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        {order.status === 'Processing' && <Clock className="w-5 h-5 text-yellow-500" />}
                                        {order.status === 'Delivered' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                        {order.status === 'Shipped' && <Truck className="w-5 h-5 text-blue-500" />}
                                        {order.status}
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                            - Estimated Delivery: {new Date(new Date(order.date).setDate(new Date(order.date).getDate() + 5)).toLocaleDateString()}
                                        </span>
                                    </h3>

                                    <div className="space-y-6">
                                        {order.items.map((item, idx) => (
                                            <div key={`${order.id}-${idx}`} className="flex gap-6 items-start">
                                                <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                                                    <p className="font-medium text-gray-900 mt-2">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <button className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-50">
                                                        Write a Review
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end gap-3">
                                    <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">Archive Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
