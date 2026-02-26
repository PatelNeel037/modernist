'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Check, User, MapPin, Truck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');

    const { cart, clearCart } = useCart();
    const { user, addAddress } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | 'new'>('new');
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
    const [iAmReady, setIAmReady] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIAmReady(true);
        if (mode === 'buy_now') {
            const item = sessionStorage.getItem('modernist_buy_now_item');
            if (item) {
                setCheckoutItems([JSON.parse(item)]);
            } else {
                setCheckoutItems(cart);
            }
        } else {
            setCheckoutItems(cart);
        }
    }, [mode, cart]);

    useEffect(() => {
        // Pre-fill email if logged in
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(prev => ({ ...prev, email: user.email, firstName: user.name.split(' ')[0] || '', lastName: user.name.split(' ')[1] || '' }));
            if (user.addresses && user.addresses.length > 0) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedAddressIndex(0);
            }
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API Processing Delay (Optional)
        setTimeout(async () => {
            // Save address if new and user is logged in
            if (user && selectedAddressIndex === 'new') {
                const newAddress = {
                    id: Date.now().toString(),
                    name: `${formData.firstName} ${formData.lastName}`,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    phone: formData.phone
                };
                addAddress(newAddress);
            }

            // Create Order Payload for API
            const orderPayload = {
                items: checkoutItems,
                totalAmount: checkoutItems.reduce((acc, item: any) => acc + (item.price * item.quantity), 0),
                shippingAddress: selectedAddressIndex === 'new' ? formData : user?.addresses?.[selectedAddressIndex as number],
                guestInfo: !user ? {
                    name: formData.firstName + ' ' + formData.lastName,
                    email: formData.email
                } : null,
                userId: user ? user.id : null
            };

            // Call Backend API
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });

                if (response.ok) {
                    const data = await response.json();

                    // Also save to localStorage for User "My Orders" page compatibility (Legacy support)
                    const localOrder = {
                        id: data.orderId || `ORD-${Date.now()}`,
                        date: new Date().toISOString(),
                        status: 'Pending',
                        items: checkoutItems,
                        total: orderPayload.totalAmount,
                        shipping: orderPayload.shippingAddress,
                        userEmail: user?.email || formData.email
                    };

                    const existingOrders = JSON.parse(localStorage.getItem('modernist_orders') || '[]');
                    localStorage.setItem('modernist_orders', JSON.stringify([localOrder, ...existingOrders]));
                } else {
                    const errorData = await response.json();
                    console.error("API Order Failed", errorData);
                    toast.error(`Order Failed: ${errorData.message || 'Unknown Error'} \nDetails: ${errorData.error}`);
                    setIsLoading(false); // Stop loading so they can retry
                    return; // Don't proceed to clear cart
                }
            } catch (e) {
                console.error("Failed to save order to API", e);
            }

            console.log("Order Placed:", orderPayload);

            if (mode === 'buy_now') {
                sessionStorage.removeItem('modernist_buy_now_item');
            } else {
                clearCart();
            }

            setIsLoading(false);
            router.push('/order-success');
        }, 2000);
    };

    const subtotal = checkoutItems.reduce((acc, item: any) => acc + (item.price * item.quantity), 0);
    const shippingCost = 0; // Free shipping
    const total = subtotal + shippingCost;

    if (iAmReady && checkoutItems.length === 0) {
        return (
            <div className="container mx-auto px-6 text-center pt-32">
                <h1 className="text-3xl font-playfair font-bold mb-4">Checkout</h1>
                <p className="text-gray-600 mb-8">Your bag is empty.</p>
                <Link href="/" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center bg-white pt-4 pb-2 sticky top-0 md:static z-10">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Forms */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. Contact Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-gray-400" /> Contact Information
                        </h2>
                        {!user && (
                            <p className="text-sm text-gray-500 mb-4">
                                Already have an account? <Link href="/login" className="text-gray-900 underline">Log in</Link> for faster checkout.
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* 2. Shipping Address */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-gray-400" /> Shipping Address
                        </h2>

                        {/* Saved Addresses Dropdown */}
                        {user && user.addresses && user.addresses.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select a Saved Address</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none bg-gray-50"
                                    value={selectedAddressIndex}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedAddressIndex(val === 'new' ? 'new' : parseInt(val));
                                    }}
                                >
                                    {user.addresses.map((addr, idx) => (
                                        <option key={idx} value={idx}>{addr.name} - {addr.street}, {addr.city}</option>
                                    ))}
                                    <option value="new">+ Add New Address</option>
                                </select>
                            </div>
                        )}

                        {/* New Address Form */}
                        {(selectedAddressIndex === 'new') ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Street Address"
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none md:col-span-2"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="zip"
                                        placeholder="ZIP Code"
                                        className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-900 outline-none"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 rounded border border-gray-100 text-sm text-gray-600">
                                <p className="font-semibold text-gray-900">{user?.addresses?.[selectedAddressIndex as number].name}</p>
                                <p>{user?.addresses?.[selectedAddressIndex as number].street}</p>
                                <p>{user?.addresses?.[selectedAddressIndex as number].city}, {user?.addresses?.[selectedAddressIndex as number].state} {user?.addresses?.[selectedAddressIndex as number].zip}</p>
                                <p className="mt-2 text-xs text-gray-500">Phone: {user?.addresses?.[selectedAddressIndex as number].phone}</p>
                            </div>
                        )}
                    </div>

                    {/* 3. Payment Method (Mock) */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 opacity-75 grayscale pointer-events-none relative">
                        <div className="absolute inset-0 z-10 bg-white/50"></div>
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 relative z-20">
                            <CreditCard className="w-5 h-5 text-gray-400" /> Payment
                        </h2>
                        <p className="text-sm text-gray-500 mb-4 relative z-20">Payment integration is simulated for this demo.</p>
                        <div className="flex items-center gap-4 relative z-20">
                            <div className="h-10 w-16 bg-gray-200 rounded"></div>
                            <div className="h-10 w-16 bg-gray-200 rounded"></div>
                            <div className="h-10 w-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6">
                            {checkoutItems.map((item: any, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex gap-4 py-2 border-b border-gray-50 last:border-0">
                                    <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                        <p className="text-sm font-semibold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{shippingCost === 0 ? 'Free' : `$${Number(shippingCost).toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                            className="w-full mt-6 bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>Processing...</>
                            ) : (
                                <>Confirm Order <Check className="w-4 h-4" /></>
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <Truck className="w-3 h-3" /> Free Shipping & Returns
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Suspense fallback={<div className="text-center pt-32">Loading checkout...</div>}>
                <CheckoutContent />
            </Suspense>
        </main>
    );
}
