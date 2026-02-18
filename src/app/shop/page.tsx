'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { allProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

// Use data from centralized file
const products = allProducts;

function ShopContent() {
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeType, setActiveType] = useState('All');

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            // Capitalize first letter to match data
            const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveCategory(formattedCat);
        }
    }, [searchParams]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
            const typeMatch = activeType === 'All' || product.type === activeType;
            return categoryMatch && typeMatch;
        });
    }, [activeCategory, activeType]);

    // Get available types based on selected category
    const availableTypes = useMemo(() => {
        const types = new Set(['All']);
        products.forEach(p => {
            if (activeCategory === 'All' || p.category === activeCategory) {
                if (p.type) {
                    types.add(p.type);
                }
            }
        });
        return Array.from(types).sort();
    }, [activeCategory]);

    return (
        <>
            {/* Header */}
            <div className="pt-32 pb-16 text-center bg-gray-50">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Our Collections</h1>
                    <p className="text-gray-600 text-lg">Explore our carefully curated styles for every occasion.</p>
                </div>
            </div>

            <section className="py-20">
                <div className="container mx-auto px-6">

                    {/* Category Tabs */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex justify-center gap-4 overflow-x-auto pb-2 mb-4">
                            {['All', 'Men', 'Women', 'Kids'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setActiveType('All'); }}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Clear Filters (Conditional) */}
                        {(activeCategory !== 'All' || activeType !== 'All') && (
                            <button
                                onClick={() => { setActiveCategory('All'); setActiveType('All'); }}
                                className="text-sm text-gray-500 hover:text-black underline transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Type Pills */}
                    <div className="flex justify-center flex-wrap gap-2 mb-16">
                        {availableTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`px-4 py-1 rounded-full text-xs font-medium border transition-all ${activeType === type
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-400'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: product.price.toFixed(2),
                                        image: product.images[0],
                                        sale: product.sale
                                    }}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <p className="text-xl">No products found for this selection.</p>
                                <button
                                    onClick={() => { setActiveCategory('All'); setActiveType('All'); }}
                                    className="mt-4 text-black underline hover:no-underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />
            <Suspense fallback={<div className="text-center pt-32">Loading shop...</div>}>
                <ShopContent />
            </Suspense>
            <Footer />
        </main>
    );
}
