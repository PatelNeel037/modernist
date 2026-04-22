'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ScrollReveal from './ui/ScrollReveal';
import { ArrowUpRight } from 'lucide-react';

interface Collection {
    title: string;
    description: string;
    image: string;
    href: string;
    color: string;
    bgColor: string;
}

const collections: Collection[] = [
    {
        title: "Summer Essentials",
        description: "lightweight & breathable",
        image: "https://images.unsplash.com/photo-1506629082632-18a25b76e1d4?q=80&w=2070&auto=format&fit=crop",
        href: "/shop/men",
        color: "from-[#8F4E34]/20 to-transparent",
        bgColor: "from-[#F4EEE5] to-[#E8D4BD]"
    },
    {
        title: "Minimalist Denim",
        description: "timeless & versatile",
        image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?q=80&w=2070&auto=format&fit=crop",
        href: "/shop/women",
        color: "from-[#7B6454]/20 to-transparent",
        bgColor: "from-[#F4EEE5] to-[#E8D4BD]"
    },
    {
        title: "Comfort First",
        description: "everyday luxury",
        image: "https://images.unsplash.com/photo-1556821552-5f9d2025ba46?q=80&w=2070&auto=format&fit=crop",
        href: "/shop",
        color: "from-[#8E7766]/20 to-transparent",
        bgColor: "from-[#F4EEE5] to-[#E8D4BD]"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 25
        }
    }
};

export default function CollectionPreviewSection() {
    return (
        <section className="relative py-32 md:py-48 bg-linear-to-b from-[#FBF5EE] via-[#F7F2EC] to-[#EADBC8] overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-[#8F4E34]/5 rounded-full blur-3xl"
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#8F4E34]/5 rounded-full blur-3xl"
                    animate={{ y: [0, -40, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 max-w-350">
                {/* Header */}
                <ScrollReveal direction="up" className="text-center mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white rounded-full shadow-lg border border-[#8F4E34]/10"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-[#8F4E34]"
                        />
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#8F4E34]/70">Featured Collections</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black text-[#1E1713] leading-tight mb-8 tracking-tight drop-shadow-sm">
                        Explore Our
                        <motion.span
                            className="block text-transparent bg-clip-text bg-linear-to-r from-[#8F4E34] to-[#1E1713] italic font-medium"
                            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            Collections
                        </motion.span>
                    </h2>
                </ScrollReveal>

                {/* Collections Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
                >
                    {collections.map((collection, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                        >
                            <Link href={collection.href}>
                                <motion.div
                                    whileHover={{ y: -16 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    className="group cursor-pointer"
                                >
                                    {/* Image Container */}
                                    <div className="relative overflow-hidden rounded-3xl md:rounded-[40px] mb-8 aspect-square shadow-2xl border border-white/40">
                                        {/* Image */}
                                        <motion.img
                                            src={collection.image}
                                            alt={collection.title}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.12 }}
                                            transition={{ duration: 0.7 }}
                                        />

                                        {/* Overlay with glassmorphism */}
                                        <motion.div
                                            className={`absolute inset-0 bg-linear-to-br ${collection.color} opacity-0 group-hover:opacity-50 transition-opacity duration-500 backdrop-blur-sm`}
                                        />

                                        {/* Explore Button */}
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            whileHover={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <motion.div
                                                className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/40"
                                                whileHover={{ rotate: 45 }}
                                                transition={{ type: 'spring', stiffness: 200 }}
                                            >
                                                <ArrowUpRight size={28} className="text-[#8F4E34]" />
                                            </motion.div>
                                        </motion.div>

                                        {/* Shine effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100"
                                            animate={{ x: [-100, 100] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    </div>

                                    {/* Info Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (idx * 0.1) }}
                                        className="relative"
                                    >
                                        {/* Accent bar */}
                                        <motion.div
                                            className="h-1 bg-linear-to-r from-[#8F4E34] to-[#8F4E34]/30 rounded-full mb-6"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '100%' }}
                                            transition={{ duration: 0.8 }}
                                        />

                                        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-[#1E1713] mb-3 tracking-tight group-hover:text-[#8F4E34] transition-colors duration-300">
                                            {collection.title}
                                        </h3>
                                        <p className="text-[#68584D] text-sm md:text-base font-medium tracking-widest uppercase group-hover:text-[#1E1713] transition-colors duration-300">
                                            {collection.description}
                                        </p>

                                        {/* Tag */}
                                        <motion.div
                                            className={`mt-6 inline-flex px-4 py-2 bg-linear-to-br ${collection.bgColor} rounded-full border border-[#8F4E34]/20 text-xs font-bold uppercase tracking-[0.2em] text-[#8F4E34]`}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            Shop Collection
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
