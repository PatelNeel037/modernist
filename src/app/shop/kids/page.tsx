'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import { DB } from '@/services/db';
import { formatPrice } from '@/lib/currency';

export default function KidsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const subCategories = useMemo(() => {
        const types = new Set(products.map(p => p.type).filter(type => typeof type === 'string' && type.trim() !== ''));
        return ['All', ...Array.from(types)];
    }, [products]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await DB.fetchProducts();
            // Filter by main category 'Kids'
            const kidsData = data.filter((p: any) => p.category === 'Kids' && p.status !== 'deleted' && p.status !== 'hidden');
            setProducts(kidsData);
            setLoading(false);
        };
        load();
    }, []);

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.type === selectedCategory || p.category === selectedCategory || (p.tags && p.tags.includes(selectedCategory)));

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Header */}
            <div className="relative pt-40 pb-20 text-center overflow-hidden mb-12 flex items-center justify-center min-h-[45vh]">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=2000&auto=format&fit=crop" alt="Kids' Collection" className="w-full h-full object-cover scale-105" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="relative z-10 container mx-auto px-6 inline-block mt-10">
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6 drop-shadow-lg">Kids' Collection</h1>
                        <p className="text-gray-100 max-w-2xl mx-auto text-lg md:text-xl drop-shadow font-medium tracking-wide leading-relaxed">Comfort and style for the little ones. Durable meets adorable.</p>
                    </div>
                </div>
            </div>

            <section className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 sticky top-24 shrink-0 space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Price</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" /> Under {formatPrice(50)}
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" /> {formatPrice(50)} - {formatPrice(100)}
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" /> {formatPrice(100)}+
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Fabric</h3>
                            <div className="space-y-2">
                                {['Cotton', 'Polyester', 'Denim'].map(fabric => (
                                    <label key={fabric} className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900">
                                        <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" /> {fabric}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        {/* Mobile and Controls Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

                            {/* Mobile Filter Toggle */}
                            <button
                                className="lg:hidden w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            >
                                <Filter size={18} /> Filters
                            </button>

                            {/* Category Pills */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {subCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedCategory === cat
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Sort Select */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 hidden md:inline">Sort by:</span>
                                <div className="relative">
                                    <select className="appearance-none bg-transparent border border-gray-200 pl-4 pr-8 py-2 rounded text-sm focus:outline-none focus:border-gray-400 cursor-pointer">
                                        <option>Featured</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Newest</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters Dropdown */}
                        {mobileFiltersOpen && (
                            <div className="lg:hidden mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-semibold mb-2">Price</h4>
                                        <div className="space-y-2 text-sm">
                                            <label className="block"><input type="checkbox" /> Under {formatPrice(50)}</label>
                                            <label className="block"><input type="checkbox" /> {formatPrice(50)} - {formatPrice(100)}</label>
                                            <label className="block"><input type="checkbox" /> {formatPrice(100)}+</label>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Fabric</h4>
                                        <div className="space-y-2 text-sm">
                                            <label className="block"><input type="checkbox" /> Cotton</label>
                                            <label className="block"><input type="checkbox" /> Polyester</label>
                                            <label className="block"><input type="checkbox" /> Denim</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products Grid */}
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">Loading products...</div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={{
                                        ...product,
                                        image: product.images?.[0] || product.image,
                                        images: product.images,
                                        price: product.price
                                    }} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500">No products found in this category.</p>
                                <button onClick={() => setSelectedCategory('All')} className="mt-4 text-blue-600 underline">View all products</button>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
