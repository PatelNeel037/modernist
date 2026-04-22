'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DB } from '@/services/db';

export default function CategorySection() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await DB.fetchCollections();
            if (data && data.length > 0) {
                setCategories(data);
            } else {
                // If nothing in DB, we can optionally use the defaults
                const defaultCategories = [
                    {
                        title: 'Men',
                        subtitle: 'Elevated essentials',
                        img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1740&auto=format&fit=crop',
                        href: '/shop/men',
                        className: 'md:col-span-2 md:row-span-2 h-[600px]'
                    },
                    {
                        title: 'Women',
                        subtitle: 'Modern silhouettes',
                        img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1778&auto=format&fit=crop',
                        href: '/shop/women',
                        className: 'md:col-span-1 md:row-span-1 h-[300px] md:h-auto'
                    },
                    {
                        title: 'Kids',
                        subtitle: 'Playful comfort',
                        img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1972&auto=format&fit=crop',
                        href: '/shop/kids',
                        className: 'md:col-span-1 md:row-span-1 h-[300px] md:h-auto'
                    },
                    {
                        title: 'Home Textile',
                        subtitle: 'Living refined',
                        img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2000&auto=format&fit=crop',
                        href: '/shop/home-textile',
                        className: 'md:col-span-2 h-[350px]'
                    },
                    {
                        title: 'Wholesale / B2B',
                        subtitle: 'Partner with us',
                        img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2000&auto=format&fit=crop',
                        href: '/shop/wholesale-b2b',
                        className: 'md:col-span-1 h-[350px]'
                    }
                ];
                setCategories(defaultCategories);
            }
            setIsLoading(false);
        };
        loadCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="py-24 bg-[#EADBC8] flex items-center justify-center min-h-100">
                <div className="w-8 h-8 border-2 border-[#8F4E34]/20 border-t-[#8F4E34] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section id="categories" className="py-24 px-6 md:px-12 max-w-350 mx-auto bg-[#EADBC8] rounded-[80px] my-16 border border-white/40">
            <ScrollReveal direction="up" className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10 px-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-0.75 bg-[#8F4E34]/40 rounded-full" />
                        <span className="text-[#8F4E34]/70 font-black uppercase tracking-[0.4em] text-[11px]">Curated Selections</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-playfair font-black text-[#1E1713] tracking-[-0.05em] leading-[0.9] drop-shadow-sm">
                        Discover <br />
                        <span className="text-[#8F4E34] italic font-serif opacity-95">Collections</span>
                    </h2>
                </div>
                <Link href="/shop" className="group relative px-10 py-5 bg-white shadow-[10px_10px_20px_rgba(107,79,79,0.1),-10px_-10px_20px_#ffffff] rounded-4xl flex items-center gap-5 text-sm font-black uppercase tracking-[0.3em] text-[#1E1713] hover:text-[#8F4E34] transition-all duration-300 hover:shadow-[inset_6px_6px_12px_rgba(107,79,79,0.1),inset_-6px_-6px_12px_#ffffff] hover:scale-[0.98]">
                    <span>View All</span>
                    <ArrowRight size={20} className="transform group-hover:translate-x-2 transition-transform" />
                </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 auto-rows-[300px]">
                {categories.map((cat, idx) => {
                    // Perfect Editorial Grid Pattern (Magazine Layout)
                    const gridConfig = [
                        "md:col-span-8 md:row-span-2 h-full", // Men (Feature)
                        "md:col-span-4 md:row-span-1 h-full", // Women (Sub-feature)
                        "md:col-span-4 md:row-span-1 h-full", // Kids (Sub-feature)
                        "md:col-span-7 md:row-span-1 h-full", // Home Textile
                        "md:col-span-5 md:row-span-1 h-full", // Wholesale
                    ];

                    const gridClass = gridConfig[idx] || "md:col-span-4 h-full";

                    return (
                        <ScrollReveal
                            direction="up"
                            delay={0.1 * idx}
                            key={idx}
                            className={gridClass}
                        >
                            <Link href={cat.href} className="group relative block w-full h-full rounded-[56px] bg-white shadow-[24px_24px_70px_rgba(107,79,79,0.1),-24px_-24px_70px_#ffffff] overflow-hidden transition-all duration-700 hover:shadow-[12px_12px_40px_rgba(107,79,79,0.15),-12px_-12px_40px_#ffffff] hover:-translate-y-4">
                                {/* Characteristically Clay: Deep Inner Gloam */}
                                <div className="absolute inset-0 rounded-[56px] shadow-[inset_12px_12px_24px_rgba(255,255,255,0.8),inset_-12px_-12px_24px_rgba(107,79,79,0.1)] pointer-events-none z-30" />

                                {/* Image Surface: Recessed Inset Effect */}
                                <div className="absolute inset-5 overflow-hidden rounded-[44px] bg-white/40 shadow-[inset_6px_6px_15px_rgba(0,0,0,0.15)]">
                                    <div className="w-full h-full transition-transform duration-[2.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110">
                                        <img
                                            src={cat.img}
                                            alt={cat.title}
                                            className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-1000"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://placehold.co/600x800/EEE/31343C?text=${cat.title}`;
                                            }}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-t from-gray-950/80 via-transparent to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-50 z-10" />
                                </div>

                                {/* Floating Master Content */}
                                <div className="absolute inset-0 p-14 flex flex-col justify-end z-40 text-white">
                                    <motion.div
                                        initial={false}
                                        className="transform transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) translate-y-4 group-hover:translate-y-0"
                                    >
                                        <span className="inline-block px-5 py-2 mb-6 text-[10px] font-black tracking-[0.35em] uppercase bg-white/10 backdrop-blur-2xl rounded-full border border-white/25 opacity-90 shadow-xl">
                                            {cat.subtitle}
                                        </span>
                                        <h3 className="text-4xl md:text-6xl font-playfair font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
                                            {cat.title}
                                        </h3>
                                    </motion.div>

                                    {/* Action Micro-interaction */}
                                    <div className="mt-12 flex items-center justify-between opacity-0 translate-y-6 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:opacity-100 group-hover:translate-y-0 delay-200">
                                        <div className="flex items-center gap-3 group/btn">
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] border-b-2 border-white/50 pb-1 group-hover/btn:border-white transition-all">Curated View</span>
                                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-3xl flex items-center justify-center border border-white/40 shadow-2xl group-hover/btn:bg-white group-hover/btn:text-[#8F4E34] group-hover/btn:scale-110 transition-all duration-500">
                                                <ArrowRight size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    );
                })}
            </div>
        </section>
    );
}
