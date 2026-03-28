'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DB } from '@/services/db';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from './ui/ScrollReveal';

export default function FeaturedProductsSection() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await DB.fetchProducts();
            setProducts(data);
            setLoading(false);
        };
        load();
    }, []);

    // Filter logic: match previous logic or just take first few
    const featuredProducts = products.filter(p => p.status === 'new' || p.status === 'featured' || p.tags?.includes('new')).slice(0, 4);

    if (loading) {
        return <div className="py-24 text-center">Loading trends...</div>;
    }

    return (
        <section id="new-arrivals" className="py-24 md:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
                <ScrollReveal direction="up" className="flex flex-col items-center mb-16 md:mb-20">
                    <span className="text-gray-500 font-semibold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 block">The Editor's Edit</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-medium text-center text-black tracking-tight">
                        Trending Now
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {featuredProducts.map((product, idx) => (
                        <ScrollReveal direction="up" delay={0.1 * idx} key={product.id}>
                            <ProductCard product={{
                                ...product,
                                price: product.price,
                                image: product.images?.[0] || product.image,
                                images: product.images
                            }} />
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal direction="up" delay={0.4} className="flex justify-center mt-16 md:mt-24">
                    <Link href="/shop" className="group inline-flex items-center justify-center border border-black text-black px-12 py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all hover:bg-black hover:text-white">
                        <span>View the full collection</span>
                    </Link>
                </ScrollReveal>
            </div>
        </section>
    );
}
