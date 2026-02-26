'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import { allProducts } from '@/data/products'; // Remove static
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
        <section id="new-arrivals" className="py-24 bg-bg-soft">
            <div className="container mx-auto px-6">
                <ScrollReveal direction="up">
                    <h2 className="text-3xl font-playfair font-bold mb-12 text-center relative tracking-wide text-content-heading">
                        <span className="bg-bg-soft px-4 relative z-10">Trending Now</span>
                        <span className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-primary/20 -z-0"></span>
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {featuredProducts.map((product, idx) => (
                        <ScrollReveal direction="up" delay={0.1 * idx} key={product.id}>
                            <ProductCard product={{
                                ...product,
                                price: typeof product.price === 'number' ? product.price.toFixed(2) : product.price,
                                image: product.images[0]
                            }} />
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal direction="up" delay={0.4} className="text-center mt-12">
                    <Link href="/shop" className="inline-block px-10 py-4 bg-brand-primary text-white font-semibold text-sm hover:bg-brand-dark transition-all rounded-full uppercase tracking-wider hover:shadow-xl shadow-lg transform hover:-translate-y-1">
                        View All Products
                    </Link>
                </ScrollReveal>
            </div>
        </section>
    );
}
