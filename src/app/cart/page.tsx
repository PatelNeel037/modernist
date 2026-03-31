'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/currency';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const subtotal = getCartTotal();
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    if (!mounted) {
        return (
            <main className="min-h-screen bg-bg-main flex flex-col pt-24 font-sans text-content-heading selection:bg-brand-secondary selection:text-brand-dark overflow-x-hidden">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-bg-accent border-t-brand-primary rounded-full animate-spin"></div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-bg-main flex flex-col pt-24 font-sans text-content-heading selection:bg-brand-secondary selection:text-brand-dark overflow-x-hidden">
            <Navbar />

            {/* Cinematic Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="py-16 text-center bg-bg-soft/50 border-b border-bg-accent/40 backdrop-blur-sm relative"
            >
                <div className="container mx-auto px-6 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                        className="text-5xl md:text-6xl font-playfair font-bold text-brand-dark tracking-tight"
                    >
                        Your Shopping Bag
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 text-content-body text-lg max-w-xl mx-auto"
                    >
                        {cart.length > 0
                            ? `You have ${cart.length} items ready to be yours.`
                            : "Your bag is waiting to be filled with extraordinary pieces."}
                    </motion.p>
                </div>
            </motion.div>

            <div className="flex-1 container mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {cart.length > 0 ? (
                        <motion.div
                            key="cart-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col lg:flex-row gap-12"
                        >
                            {/* Cart Items List */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-6 border-b border-bg-accent/40 pb-4">
                                    <span className="text-content-body text-sm font-medium uppercase tracking-wider">{cart.length} Items</span>
                                    <motion.button
                                        whileHover={{ scale: 1.05, color: '#ef4444' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearCart}
                                        className="text-content-body hover:text-red-500 text-sm font-medium transition-colors uppercase tracking-wider"
                                    >
                                        Clear Cart
                                    </motion.button>
                                </div>

                                <div className="space-y-6">
                                    <AnimatePresence mode="popLayout">
                                        {cart.map((item, idx) => (
                                            <motion.div
                                                layout="position" // Forces position-only layout calculations for smoother pops
                                                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                                                animate={{
                                                    opacity: 1, x: 0, scale: 1,
                                                    rotateZ: 0, rotateX: 0, y: 0, filter: "blur(0px)",
                                                    transition: { delay: idx * 0.1, type: "spring", stiffness: 300, damping: 30 }
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.4,
                                                    y: 200, // Massive drop
                                                    rotateZ: -20, // Aggressive tilt
                                                    rotateX: 80, // Falling backward
                                                    filter: "blur(20px)",
                                                    transition: {
                                                        duration: 0.5,
                                                        ease: "easeIn" // Accelerates down like real gravity
                                                    }
                                                }}
                                                transition={{
                                                    layout: { type: "spring", stiffness: 400, damping: 30 } // Ultra fast snap up for remaining items
                                                }}
                                                key={`${item.id}-${item.size}`}
                                                style={{ originX: 0.5, originY: 1 }} // Fall rotates from bottom center
                                                className="flex gap-6 p-4 rounded-2xl bg-bg-soft/40 border border-transparent hover:border-brand-primary/20 hover:bg-bg-soft/80 transition-all duration-300 group"
                                            >
                                                {/* Image */}
                                                <div className="w-28 h-36 bg-bg-accent relative shrink-0 overflow-hidden rounded-xl">
                                                    <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/10 transition-colors z-10 duration-500"></div>
                                                    <img src={item.image || '/images/fallback-product.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700" onError={(e) => { e.currentTarget.src = '/images/fallback-product.png'; }} />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-lg text-content-heading group-hover:text-brand-primary transition-colors">{item.name}</h3>
                                                            <p className="text-sm text-content-body mt-1 uppercase tracking-wider">Size: <span className="font-semibold text-brand-dark">{item.size || 'OS'}</span></p>
                                                            <p className="font-medium text-content-heading mt-2">{formatPrice(item.price)}</p>
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.15, rotate: 15, color: '#ef4444' }}
                                                            whileTap={{ scale: 0.8 }}
                                                            onClick={async () => {
                                                                // The removeFromCart immediately triggers the AnimatePresence exit
                                                                removeFromCart(item.id, item.size);
                                                            }}
                                                            className="text-content-body/50 hover:text-red-500 transition-colors p-2 bg-bg-main rounded-full border border-bg-accent shadow-sm"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>

                                                    <div className="flex items-end justify-between mt-4">
                                                        <div className="flex items-center border border-bg-accent bg-bg-main rounded-full overflow-hidden shadow-sm">
                                                            <motion.button
                                                                whileHover={{ backgroundColor: 'var(--color-bg-soft)' }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                                className="px-3 py-1.5 text-content-heading"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus size={14} />
                                                            </motion.button>
                                                            <span className="px-2 text-sm font-bold w-10 text-center text-brand-dark">{item.quantity}</span>
                                                            <motion.button
                                                                whileHover={{ backgroundColor: 'var(--color-bg-soft)' }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                                className="px-3 py-1.5 text-content-heading"
                                                            >
                                                                <Plus size={14} />
                                                            </motion.button>
                                                        </div>
                                                        <span className="text-lg font-bold text-brand-dark">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                                className="lg:w-[400px] shrink-0"
                            >
                                <div className="bg-bg-soft/50 p-8 rounded-3xl border border-bg-accent/50 shadow-xl sticky top-30 backdrop-blur-md">
                                    <h3 className="text-2xl font-playfair font-bold text-brand-dark mb-6">Order Summary</h3>

                                    <div className="space-y-4 text-base text-content-body border-b border-bg-accent/50 pb-6">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-content-heading">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className="text-green-600 font-medium tracking-wide">COMPLIMENTARY</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between font-bold text-brand-dark text-xl py-6">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>

                                    <Link href="/checkout" className="w-full">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-brand-dark text-bg-main py-4 rounded-xl font-bold tracking-wider hover:bg-brand-primary transition-colors mb-6 shadow-[0_10px_30px_-10px_rgba(102,76,54,0.5)] flex items-center justify-center gap-2 group"
                                        >
                                            PROCEED TO CHECKOUT
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </motion.button>
                                    </Link>

                                    <Link href="/" className="block text-center text-sm font-medium text-content-body hover:text-brand-primary transition-colors uppercase tracking-wider">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-cart"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="flex flex-col items-center justify-center py-24 px-4 bg-bg-soft/30 rounded-3xl border border-dashed border-bg-accent relative overflow-hidden"
                        >
                            {/* Floating background blur */}
                            <motion.div
                                animate={{
                                    rotate: [0, -360],
                                    scale: [1, 1.3, 1]
                                }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -z-10"
                            />

                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ShoppingBag className="w-24 h-24 text-brand-primary/30 mb-8 drop-shadow-2xl" strokeWidth={1} />
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-content-heading mb-4 text-center">Your bag is empty</h2>
                            <p className="text-content-body text-lg mb-10 max-w-md text-center">
                                Looks like you haven't added anything to your cart yet. Explore our latest arrivals.
                            </p>

                            <Link href="/">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-brand-dark text-bg-main px-8 py-4 rounded-xl font-bold tracking-wider hover:bg-brand-primary transition-colors shadow-[0_10px_40px_-10px_rgba(102,76,54,0.5)]"
                                >
                                    START SHOPPING
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}
    );
}
