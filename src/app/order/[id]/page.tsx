'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Package, Truck, Home, XCircle, Clock } from 'lucide-react';
import { formatINR, formatPrice } from '@/lib/currency';

// Order Data
const mockOrder = {
    id: 'ORD-2024-8832',
    date: 'February 15, 2024',
    status: 'Processing', // Processing, Shipped, Delivered, Cancelled
    total: 134.00,
    subtotal: 134.00,
    shipping: 0,
    tax: 0,
    items: [
        {
            id: 1,
            name: 'Premium Linen Shirt',
            price: 89.00,
            quantity: 1,
            size: 'M',
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop'
        },
        {
            id: 101,
            name: 'Classic White Blouse',
            price: 45.00,
            quantity: 1,
            size: 'S',
            image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1974&auto=format&fit=crop'
        }
    ],
    shippingAddress: {
        name: 'John Doe',
        street: '123 Fashion Ave',
        city: 'New York',
        zip: '10001',
        country: 'USA'
    },
    trackingId: 'TRK-99887766'
};

export default function OrderDetailsPage() {
    // In a real app, you'd fetch order details based on ID from URL
    const [order, setOrder] = useState(mockOrder);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelOrder = () => {
        if (confirm('Are you sure you want to cancel this order? Refund will be initiated within 3-5 days.')) {
            setIsCancelling(true);
            // Simulate API call
            setTimeout(() => {
                setOrder(prev => ({ ...prev, status: 'Cancelled' }));
                setIsCancelling(false);
            }, 1000);
        }
    };

    const getStatusStepInt = (status: string) => {
        if (status === 'Processing') return 1;
        if (status === 'Shipped') return 2;
        if (status === 'Delivered') return 3;
        return 0;
    };

    const currentStep = getStatusStepInt(order.status);
    const isCancelled = order.status === 'Cancelled';

    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />

            <div className="pt-32 pb-16 container mx-auto px-6 max-w-5xl">

                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Shopping
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-playfair font-bold mb-2">Order #{order.id}</h1>
                        <p className="text-gray-500">Placed on {order.date}</p>
                    </div>
                    <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-medium ${isCancelled ? 'bg-red-50 text-red-600' :
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                            'bg-blue-50 text-blue-700'
                        }`}>
                        {order.status}
                    </div>
                </div>

                {/* Status Timeline */}
                {!isCancelled ? (
                    <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                        <div className="relative flex justify-between">
                            {/* Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-gray-900 -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                            ></div>

                            {/* Steps */}
                            <div className="relative z-10 bg-white px-2 text-center">
                                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 mb-2 ${currentStep >= 1 ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-300'
                                    }`}>
                                    <CheckCircle size={20} />
                                </div>
                                <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Placed</span>
                            </div>

                            <div className="relative z-10 bg-white px-2 text-center">
                                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 mb-2 ${currentStep >= 2 ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-300'
                                    }`}>
                                    <Truck size={20} />
                                </div>
                                <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</span>
                            </div>

                            <div className="relative z-10 bg-white px-2 text-center">
                                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 mb-2 ${currentStep >= 3 ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-300'
                                    }`}>
                                    <Home size={20} />
                                </div>
                                <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 border border-red-100 p-8 rounded-lg mb-8 text-center">
                        <XCircle className="mx-auto text-red-500 mb-4 h-12 w-12" />
                        <h3 className="text-xl font-bold text-red-700 mb-2">Order Cancelled</h3>
                        <p className="text-red-600">This order has been cancelled. A refund has been initiated.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Items Ordered</h2>
                            <div className="space-y-6">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex gap-6 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                        <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                                                </div>
                                                <span className="font-medium">{formatPrice(item.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary & Info */}
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-3 border-b border-gray-100 pb-6 mb-6 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatINR(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    {order.shipping === 0 ? <span className="text-green-600">Free</span> : <span>{formatINR(order.shipping)}</span>}
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Estimated Tax</span>
                                    <span>{formatINR(order.tax)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>{formatINR(order.total)}</span>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
                            <div className="text-sm text-gray-600 leading-relaxed mb-6">
                                <p className="font-medium text-gray-900 mb-1">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>

                            {!isCancelled && (
                                <>
                                    <div className="border-t border-gray-100 pt-4 mt-4">
                                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                            <Truck size={16} /> Delivery Info
                                        </h4>
                                        <p className="text-sm text-gray-600">Courier: Standard Shipping</p>
                                        <p className="text-sm text-gray-600">Tracking: {order.trackingId}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        {!isCancelled && order.status === 'Processing' && (
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={isCancelling}
                                    className="w-full py-3 border border-red-500 text-red-600 font-medium rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                                <p className="text-xs text-gray-400 mt-3">Only available before shipping.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
