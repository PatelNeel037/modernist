'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CategorySection() {
    const categories = [
        {
            title: 'Men',
            img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1740&auto=format&fit=crop',
            href: '/shop?category=Men'
        },
        {
            title: 'Women',
            img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1778&auto=format&fit=crop',
            href: '/shop?category=Women'
        },
        {
            title: 'Kids',
            img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1972&auto=format&fit=crop',
            href: '/shop?category=Kids'
        }
    ];

    return (
        <section id="categories" className="py-20 px-6 container mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-playfair font-bold text-gray-900 border-l-4 border-gray-900 pl-4">Shop by Category</h2>
                <div className="flex space-x-2">
                    <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
                    <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-100"><ArrowRight size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((cat, idx) => (
                    <Link href={cat.href} key={idx} className="group relative block overflow-hidden shadow-lg hover:shadow-xl transition-shadow rounded-lg">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-200 relative">
                            <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    // Placeholder if image fails
                                    e.currentTarget.src = `https://placehold.co/600x800/EEE/31343C?text=${cat.title}`;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity group-hover:opacity-75"></div>
                        </div>

                        <div className="absolute bottom-6 left-6 text-white transform transition-transform group-hover:translate-x-2">
                            <span className="uppercase tracking-widest text-xs font-semibold mb-2 block text-gray-200">New Collection</span>
                            <h3 className="text-3xl font-playfair font-bold">{cat.title}</h3>
                            <span className="inline-flex items-center mt-3 text-sm font-medium border-b border-transparent group-hover:border-white transition-all pb-0.5">
                                Explore <ArrowRight size={16} className="ml-2" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
