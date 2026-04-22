'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DB } from '@/services/db';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from './ui/ScrollReveal';
import Magnetic from './ui/Magnetic';

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
        return <div className="py-24 text-center text-[#1E1713]">Loading trends...</div>;
    }

    return (
        <section id="new-arrivals" className="py-32 md:py-48 bg-[#EEDFCC] overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1600px]">
                <ScrollReveal direction="up" className="flex flex-col items-center mb-20 md:mb-32">
                    <div className="mb-6 px-6 py-2 bg-[#EEDFCC] shadow-[4px_4px_10px_rgba(106,82,68,0.15),-4px_-4px_10px_#ffffff] rounded-full inline-flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8F4E34]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#8F4E34]/60">The Editor's Edit</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black text-center text-[#1E1713] tracking-[-0.03em] drop-shadow-sm">
                        Trending Now
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
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

                <ScrollReveal direction="up" delay={0.4} className="flex justify-center mt-24 md:mt-32">
                    <Magnetic>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                            <Link href="/shop" className="group relative inline-flex items-center justify-center p-1 cursor-pointer">
                                {/* Button Body with 3D Depth */}
                                <div className="px-16 py-7 bg-[#8F4E34] rounded-full text-white font-black text-xs uppercase tracking-[0.4em] transition-all duration-500
                                    shadow-[20px_20px_40px_rgba(107,79,79,0.25),-10px_-10px_30px_rgba(255,255,255,0.8),inset_4px_4px_8px_rgba(255,255,255,0.2),inset_-4px_-4px_8px_rgba(0,0,0,0.2)]
                                    group-hover:shadow-[30px_30px_60px_rgba(107,79,79,0.3),-5px_-5px_20px_rgba(255,255,255,0.8),inset_2px_2px_4px_rgba(255,255,255,0.2)]
                                    flex items-center gap-6 border border-white/10 overflow-hidden"
                                >
                                    <span className="drop-shadow-sm group-hover:text-[#F1E4D4] transition-colors duration-300">View the full collection</span>

                                    <div className="w-10 h-10 rounded-full bg-white/20 shadow-md flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-[#8F4E34]">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current stroke-3">
                                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-[#8F4E34]/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </div>
                            </Link>
                        </motion.div>
                    </Magnetic>
                </ScrollReveal>
            </div>
        </section>
    );
}
