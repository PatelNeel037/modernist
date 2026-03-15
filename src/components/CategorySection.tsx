'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

export default function CategorySection() {
    const categories = [
        {
            title: 'Men',
            img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1740&auto=format&fit=crop',
            href: '/shop/men'
        },
        {
            title: 'Women',
            img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1778&auto=format&fit=crop',
            href: '/shop/women'
        },
        {
            title: 'Kids',
            img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1972&auto=format&fit=crop',
            href: '/shop/kids'
        },
        {
            title: 'Home Textile',
            img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2000&auto=format&fit=crop',
            href: '/shop/home-textile'
        },
        {
            title: 'Wholesale / B2B',
            img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2000&auto=format&fit=crop',
            href: '/shop/wholesale-b2b'
        }
    ];

    return (
        <section id="categories" className="py-24 px-6 container mx-auto">
            <ScrollReveal direction="up" className="mb-12">
                <div>
                    <span className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-2 block">Collections</span>
                    <h2 className="text-4xl font-playfair font-bold text-content-heading">Shop by Category</h2>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((cat, idx) => (
                    <ScrollReveal direction="up" delay={0.1 * idx} key={idx}>
                        <Link href={cat.href} className="group relative block h-[500px] overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={cat.img}
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/600x800/EEE/31343C?text=${cat.title}`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-8 text-white transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                                <div className="w-12 h-px bg-white/50 mb-4 group-hover:w-20 transition-all duration-500"></div>
                                <h3 className="text-4xl font-playfair font-bold mb-3 text-white! drop-shadow-md">{cat.title}</h3>
                                <div className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0 text-white">
                                    <span className="uppercase tracking-widest border-b border-transparent group-hover:border-white pb-1 transition-all">Explore Collection</span>
                                    <ArrowRight size={16} className="ml-3 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}
