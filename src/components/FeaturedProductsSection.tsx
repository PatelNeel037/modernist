'use client';

import Link from 'next/link';
import { allProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function FeaturedProductsSection() {
    // Get trending/featured items. 
    // Logic: Look for 'new' or 'featured' or just take strict subset that matches previous mock
    const featuredProducts = allProducts.filter(p => p.status === 'new' || p.status === 'featured').slice(0, 4);

    return (
        <section id="new-arrivals" className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-playfair font-bold mb-12 text-center relative tracking-wide">
                    <span className="bg-white px-4 relative z-10">Trending Now</span>
                    <span className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -z-0"></span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={{
                            ...product,
                            price: product.price.toFixed(2),
                            image: product.images[0]
                        }} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/shop" className="inline-block px-8 py-3 border border-gray-900 text-gray-900 font-semibold text-sm hover:bg-gray-900 hover:text-white transition-colors uppercase tracking-wider">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}
