'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
}

// Mock initial data
const initialCartItems: CartItem[] = [
    { id: 1, name: 'Premium Linen Shirt', price: 89.00, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop', quantity: 1, size: 'M' },
    { id: 101, name: 'Classic White Blouse', price: 45.00, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1974&auto=format&fit=crop', quantity: 2, size: 'S' },
];

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

    const subtotal = getCartTotal();
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="pt-32 pb-8 container mx-auto px-6">
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-8">Your Shopping Bag</h1>

                {cart.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Cart Items List */}
                        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                <span className="text-gray-500 text-sm font-medium">{cart.length} Items</span>
                                <button onClick={clearCart} className="text-gray-400 hover:text-red-500 text-sm underline transition-colors">Clear Cart</button>
                            </div>

                            <div className="space-y-8">
                                {cart.map((item, idx) => (
                                    <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-6 py-4 border-b border-gray-50 last:border-0">
                                        {/* Image */}
                                        <div className="w-24 h-32 bg-gray-100 relative shrink-0 overflow-hidden rounded">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">Size: {item.size || 'One Size'}</p>
                                                    <p className="font-medium text-gray-900 mt-2">${item.price.toFixed(2)}</p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id, item.size)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center border border-gray-200 rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100 text-gray-600"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100 text-gray-600"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 ml-auto">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96 shrink-0">
                            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-30">
                                <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

                                <div className="space-y-4 text-sm text-gray-600 border-b border-gray-100 pb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-bold text-gray-900 text-lg py-6">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <Link href="/checkout" className="block w-full bg-gray-900 text-white py-4 rounded font-medium hover:bg-gray-800 transition-colors mb-4 text-center">
                                    Proceed to Checkout
                                </Link>

                                <Link href="/" className="block text-center text-sm text-gray-500 hover:text-gray-900 underline">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-lg shadow-sm">
                        <div className="mb-6 inline-flex p-6 bg-gray-50 rounded-full">
                            <i className="fas fa-shopping-bag text-4xl text-gray-300"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/" className="inline-block bg-gray-900 text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
