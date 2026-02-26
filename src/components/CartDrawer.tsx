'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
    const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

    const cartTotal = getCartTotal();
    const cartCount = getCartCount();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-brand-dark" />
                                <h2 className="text-xl font-playfair font-bold text-brand-dark">Your Cart</h2>
                                <span className="bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                                >
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium text-lg">Your cart is empty.</p>
                                    <p className="text-gray-400 text-sm max-w-[250px]">Explore our collections and add some premium pieces to your wardrobe.</p>
                                    <button onClick={closeCart} className="mt-4 px-6 py-2 bg-brand-dark text-white rounded font-medium hover:bg-brand-primary transition-colors text-sm">
                                        Continue Shopping
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.ul
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: { staggerChildren: 0.1 }
                                        }
                                    }}
                                    className="space-y-6"
                                >
                                    <AnimatePresence initial={false}>
                                        {cart.map((item) => (
                                            <motion.li
                                                key={`${item.id}-${item.size}`}
                                                layout
                                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: -50, scale: 0.9, transition: { duration: 0.2 } }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                                className="flex gap-4 border border-gray-100 p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                {/* Image */}
                                                <div className="w-24 h-32 bg-gray-50 rounded overflow-hidden flex-shrink-0 border border-gray-50">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>

                                                {/* Details */}
                                                <div className="flex flex-1 flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight pr-4">{item.name}</h3>
                                                            <button
                                                                onClick={() => removeFromCart(item.id, item.size)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                                title="Remove Item"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-500 text-xs mt-1">Size: {item.size || 'N/A'}</p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center border border-gray-200 rounded">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                                className="p-1 px-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-medium text-gray-900">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                                className="p-1 px-2 hover:bg-gray-100 text-gray-600 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <p className="font-bold text-brand-dark">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </motion.ul>
                            )}
                        </div>

                        {/* Footer (Total & Checkout) */}
                        {cart.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="p-6 border-t border-gray-200 bg-gray-50/80"
                            >
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" onClick={closeCart} className="w-full flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand-primary text-white py-4 rounded-lg font-medium transition-all shadow-md hover:shadow-xl group">
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                                    <LockIcon /> Secure encrypted checkout
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
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
