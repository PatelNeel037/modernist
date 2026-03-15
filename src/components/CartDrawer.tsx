'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { formatPrice } from '@/lib/currency';

export default function CartDrawer() {
    const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

    const cartTotal = getCartTotal();
    const cartCount = getCartCount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 z-60 transition-all duration-300"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.8 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{
                            type: 'spring',
                            stiffness: 250,
                            damping: 30,
                            mass: 0.8
                        }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-bg-main/90 backdrop-blur-3xl z-70 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col border-l border-bg-accent/40 selection:bg-brand-secondary selection:text-brand-dark"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-bg-accent/40 bg-bg-soft/30 backdrop-blur-md relative z-20">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <ShoppingBag className="w-6 h-6 text-brand-dark drop-shadow-md" />
                                </motion.div>
                                <h2 className="text-2xl font-playfair font-bold text-content-heading tracking-tight">Your Cart</h2>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="bg-brand-primary text-bg-main text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.2, rotate: 90 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={closeCart}
                                className="p-2 hover:bg-bg-accent/50 rounded-full transition-colors text-content-body hover:text-red-500 bg-bg-main/50 shadow-sm border border-bg-accent/20"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 relative">
                            {cart.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="h-full flex flex-col items-center justify-center py-20 px-4 bg-bg-soft/20 rounded-3xl border border-dashed border-bg-accent relative overflow-hidden"
                                >
                                    {/* Floating background blur */}
                                    <motion.div
                                        animate={{
                                            rotate: [0, -360],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[80px] -z-10"
                                    />

                                    <motion.div
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <ShoppingBag className="w-20 h-20 text-brand-primary/40 mb-6 drop-shadow-xl" strokeWidth={1} />
                                    </motion.div>

                                    <h2 className="text-2xl font-playfair font-bold text-content-heading mb-2 text-center">Your bag is empty</h2>
                                    <p className="text-content-body text-sm mb-8 max-w-[250px] text-center">
                                        Explore our collections and add some premium pieces to your wardrobe.
                                    </p>

                                    <button onClick={closeCart} className="relative group overflow-hidden">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-brand-dark text-bg-main px-8 py-4 rounded-xl font-bold tracking-wider transition-colors shadow-[0_10px_30px_-10px_rgba(102,76,54,0.5)] z-10 relative"
                                        >
                                            START SHOPPING
                                        </motion.div>
                                        <div className="absolute inset-0 bg-brand-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    <AnimatePresence mode="popLayout">
                                        {cart.map((item, idx) => (
                                            <motion.div
                                                key={`${item.id}-${item.size}`}
                                                layout="position" // Position only layout calculations
                                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                                animate={{
                                                    opacity: 1, x: 0, scale: 1, rotateZ: 0, y: 0, filter: "blur(0px)",
                                                    transition: { delay: idx * 0.05 + 0.1, type: "spring", stiffness: 300, damping: 30 }
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.5,
                                                    y: 150, // Massive drop
                                                    rotateZ: 15, // Aggressive tilt
                                                    rotateX: 60, // Falls backwards
                                                    filter: "blur(15px)",
                                                    transition: {
                                                        duration: 0.4,
                                                        ease: "easeIn" // Gravity physics acceleration
                                                    }
                                                }}
                                                transition={{
                                                    layout: { type: "spring", stiffness: 450, damping: 35 } // Fast snap-up for items below
                                                }}
                                                style={{ originX: 0.5, originY: 1 }} // Fall rotates from bottom
                                                className="flex gap-4 p-3 rounded-2xl bg-bg-soft/40 border border-bg-accent/30 hover:border-brand-primary/30 hover:bg-bg-soft/80 transition-all duration-300 group shadow-sm hover:shadow-md"
                                            >
                                                {/* Image */}
                                                <div className="w-24 h-32 bg-bg-accent relative shrink-0 overflow-hidden rounded-xl">
                                                    <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/10 transition-colors z-10 duration-500"></div>
                                                    <img src={item.image || '/images/fallback-product.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700" onError={(e) => { e.currentTarget.src = '/images/fallback-product.png'; }} />
                                                </div>

                                                {/* Details */}
                                                <div className="flex flex-1 flex-col justify-between py-1">
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <Link href={`/product/${item.id}`} onClick={closeCart}>
                                                                <h3 className="font-bold text-sm text-content-heading group-hover:text-brand-primary transition-colors leading-tight pr-2">{item.name}</h3>
                                                            </Link>
                                                            <motion.button
                                                                whileHover={{ scale: 1.2, rotate: 15, color: '#ef4444' }}
                                                                whileTap={{ scale: 0.8 }}
                                                                onClick={() => removeFromCart(item.id, item.size)}
                                                                className="text-content-body/50 hover:text-red-500 transition-colors p-1.5 bg-bg-main rounded-full border border-bg-accent shadow-sm shrink-0"
                                                                title="Remove Item"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                        <p className="text-content-body text-xs mt-1 uppercase tracking-wider font-medium">Size: <span className="font-bold text-brand-dark">{item.size || 'OS'}</span></p>
                                                    </div>

                                                    <div className="flex items-end justify-between mt-3">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center border border-bg-accent bg-bg-main rounded-full overflow-hidden shadow-sm">
                                                            <motion.button
                                                                whileHover={{ backgroundColor: 'var(--color-bg-soft)' }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                                className="px-2 py-1.5 text-content-heading disabled:opacity-50"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </motion.button>
                                                            <span className="w-8 text-center text-xs font-bold text-brand-dark">
                                                                {item.quantity}
                                                            </span>
                                                            <motion.button
                                                                whileHover={{ backgroundColor: 'var(--color-bg-soft)' }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                                className="px-2 py-1.5 text-content-heading"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </motion.button>
                                                        </div>

                                                        <p className="font-bold text-base text-brand-dark">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer (Total & Checkout) */}
                        <AnimatePresence>
                            {cart.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 40 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="p-6 border-t border-bg-accent/50 bg-bg-soft/80 backdrop-blur-xl relative z-20"
                                >
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-content-body text-sm font-medium">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(cartTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-content-body text-sm font-medium">
                                            <span>Shipping</span>
                                            <span className="text-green-600 tracking-wide">COMPLIMENTARY</span>
                                        </div>
                                        <div className="border-t border-bg-accent/50 pt-4 flex justify-between font-bold text-brand-dark text-xl">
                                            <span>Total</span>
                                            <span>{formatPrice(cartTotal)}</span>
                                        </div>
                                    </div>

                                    <Link href="/checkout" onClick={closeCart}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full flex items-center justify-center gap-2 bg-brand-dark text-bg-main py-4 rounded-xl font-bold tracking-wider transition-colors shadow-[0_10px_30px_-10px_rgba(102,76,54,0.5)] hover:bg-brand-primary group relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                PROCEED TO CHECKOUT
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        </motion.button>
                                    </Link>

                                    <div className="mt-4">
                                        <Link href="/cart" onClick={closeCart} className="block text-center text-xs font-bold text-content-body hover:text-brand-primary transition-colors uppercase tracking-wider underline underline-offset-4 decoration-bg-accent hover:decoration-brand-primary">
                                            View Full Cart Page
                                        </Link>
                                    </div>

                                    <p className="text-center text-[10px] text-content-body/70 mt-5 flex items-center justify-center gap-1.5 uppercase font-medium tracking-widest">
                                        <LockIcon /> SECURE ENCRYPTED CHECKOUT
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

// Helper lock icon
function LockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    )
}
