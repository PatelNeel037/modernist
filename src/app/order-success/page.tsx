'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function OrderSuccessPage() {
    const { user } = useAuth();
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        // Generate a random order ID for display
        setOrderId(`ORD-${Math.floor(Math.random() * 1000000)}`);
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">

            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm max-w-lg w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>

                <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase{user ? `, ${user.name.split(' ')[0]}` : ''}.<br />
                    Your order <span className="font-mono font-medium text-gray-900">{orderId}</span> has been received.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium text-yellow-600">Processing</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span className="font-medium text-gray-900">3-5 Business Days</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link href="/orders" className="block w-full bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
                        View Order Status
                    </Link>
                    <Link href="/" className="block w-full bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>

        </main>
    );
}
