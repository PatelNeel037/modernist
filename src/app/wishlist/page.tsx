'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartCrack, ShoppingBag, X } from 'lucide-react';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

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
                        My Wishlist
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 text-content-body text-lg max-w-xl mx-auto"
                    >
                        {wishlist.length > 0
                            ? `You have ${wishlist.length} premium pieces saved.`
                            : "Curate your personal collection of modernist pieces."}
                    </motion.p>
                </div>
            </motion.div>

            {/* Wishlist Content */}
            <section className="flex-1 container mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {wishlist.length > 0 ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                        >
                            {wishlist.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 25,
                                        delay: index * 0.1
                                    }}
                                    layout
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-brand-primary/5 rounded-2xl scale-95 opacity-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 blur-xl -z-10"></div>
                                    <ProductCard product={{
                                        ...item,
                                        price: item.price
                                    }} />
                                    <motion.button
                                        whileHover={{ scale: 1.15, rotate: 90 }}
                                        whileTap={{ scale: 0.8 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(item.id);
                                        }}
                                        className="absolute top-4 right-4 bg-bg-main/80 backdrop-blur-md text-content-heading p-2 rounded-full shadow-lg border border-bg-accent/50 opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="flex flex-col items-center justify-center py-24 px-4 bg-bg-soft/30 rounded-3xl border border-dashed border-bg-accent relative overflow-hidden"
                        >
                            {/* Floating background blur */}
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] -z-10"
                            />

                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <HeartCrack className="w-20 h-20 text-brand-primary/40 mb-6 drop-shadow-xl" strokeWidth={1} />
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-content-heading mb-4 text-center">Your wishlist is empty</h2>
                            <p className="text-content-body text-lg mb-10 max-w-md text-center">
                                Discover premium fabrics and timeless silhouettes to build your perfect wardrobe.
                            </p>

                            <Link href="/">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-brand-dark text-bg-main px-8 py-4 rounded-xl font-bold tracking-wider hover:bg-brand-primary transition-colors shadow-[0_10px_40px_-10px_rgba(102,76,54,0.5)]"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    START EXPLORING
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <Footer />
        </main>
    );
}
