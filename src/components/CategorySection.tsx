'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

import { useState, useEffect } from 'react';
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
            <div className="py-24 bg-bg-soft flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section id="categories" className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
            <ScrollReveal direction="up" className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-gray-500 font-semibold uppercase tracking-[0.2em] text-xs mb-3 block">Curated Selections</span>
                    <h2 className="text-5xl md:text-6xl font-playfair font-medium text-black tracking-tight">Discover Collections</h2>
                </div>
                <Link href="/shop" className="group flex items-center text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors">
                    <span className="border-b-2 border-black pb-1 group-hover:border-gray-600 transition-colors">View All</span>
                    <ArrowRight size={18} className="ml-3 transform group-hover:translate-x-2 transition-transform" />
                </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
                {categories.map((cat, idx) => (
                    <ScrollReveal
                        direction="up"
                        delay={0.1 * idx}
                        key={idx}
                        className={cat.className}
                    >
                        <Link href={cat.href} className="group relative block w-full h-full overflow-hidden bg-gray-100">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110">
                                    <img
                                        src={cat.img}
                                        alt={cat.title}
                                        className={`w-full h-full ${cat.imgClass || 'object-cover'} ${cat.imgPosition || 'object-center'}`}
                                        style={{ transform: `scale(${(cat.imgScale || 100) / 100})` }}
                                        onError={(e) => {
                                            e.currentTarget.src = `https://placehold.co/600x800/EEE/31343C?text=${cat.title}`;
                                        }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10 opacity-70 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                <div className="transform transition-transform duration-700 ease-out translate-y-4 group-hover:translate-y-0">
                                    <p className="text-xs uppercase tracking-[0.2em] mb-2 opacity-80 font-semibold">{cat.subtitle}</p>
                                    <h3 className="text-3xl md:text-4xl font-playfair font-medium text-white mb-0">{cat.title}</h3>
                                </div>

                                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 transform translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 border border-white/20">
                                    <ArrowRight size={20} className="text-white" />
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}
