'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-8 text-center bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-playfair font-bold text-gray-900">My Wishlist</h1>
                </div>
            </div>

            {/* Wishlist Content */}
            <section className="flex-1 container mx-auto px-6 py-12">
                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {wishlist.map(item => (
                            <div key={item.id} className="relative group">
                                {/* Pass item to ProductCard. Ensure types match. */}
                                <ProductCard product={{
                                    ...item,
                                    price: item.price.toString()
                                }} />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFromWishlist(item.id);
                                    }}

                                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <h2 className="text-2xl font-playfair font-semibold text-gray-400 mb-4">Your wishlist is currently empty.</h2>
                        <p className="text-gray-500 mb-8">Browse our collections to find something you love.</p>
                        <Link href="/" className="inline-block bg-gray-900 text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
