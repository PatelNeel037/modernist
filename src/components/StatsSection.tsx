'use client';

import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';

interface Stat {
    number: string;
    label: string;
    description: string;
    icon?: string;
}

const stats: Stat[] = [
    {
        number: '50K+',
        label: 'Happy Customers',
        description: 'Trusted worldwide',
        icon: '👥'
    },
    {
        number: '1000+',
        label: 'Premium Products',
        description: 'Curated collections',
        icon: '🎨'
    },
    {
        number: '99%',
        label: 'Customer Satisfaction',
        description: 'Industry-leading rating',
        icon: '⭐'
    },
    {
        number: '24/7',
        label: 'Customer Support',
        description: 'Always here for you',
        icon: '💬'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.8 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 30
        }
    }
};

export default function StatsSection() {
    return (
        <section className="relative py-32 md:py-48 bg-linear-to-br from-[#F5F1E9] via-white to-[#F0EEEB] overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 -left-40 w-80 h-80 bg-[#6B4F4F]/5 rounded-full blur-3xl"
                    animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#6B4F4F]/5 rounded-full blur-3xl"
                    animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 max-w-350">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
                >
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="group relative flex flex-col items-center md:items-start text-center md:text-left"
                        >
                            {/* Decorative background */}
                            <motion.div
                                className="absolute -inset-10 rounded-3xl bg-linear-to-br from-white/40 to-white/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                                animate={{ scale: [0.95, 1.05, 0.95] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />

                            {/* Icon/Number Circle */}
                            <motion.div
                                className="relative mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-white/80 to-[#F5F1E9] border-2 border-[#6B4F4F]/20 shadow-xl group-hover:shadow-2xl transition-all duration-300"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            >
                                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#6B4F4F]/5 to-transparent" />
                                <div className="text-4xl font-playfair font-black text-transparent bg-clip-text bg-linear-to-br from-[#6B4F4F] to-[#3E2C2C] text-center relative z-10">
                                    {stat.number.includes('K') || stat.number.includes('+') || stat.number === '24/7' || stat.number.includes('%')
                                        ? stat.number
                                        : stat.number
                                    }
                                </div>
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className="relative z-10"
                            >
                                <h3 className="text-xl md:text-2xl lg:text-2xl font-playfair font-black text-[#3E2C2C] mb-2 tracking-tight group-hover:text-[#6B4F4F] transition-colors duration-300">
                                    {stat.label}
                                </h3>
                                <p className="text-[#5C4A3D]/70 text-sm md:text-base font-medium group-hover:text-[#5C4A3D] transition-colors duration-300">
                                    {stat.description}
                                </p>

                                {/* Bottom accent line */}
                                <motion.div
                                    className="mt-6 h-1 bg-linear-to-r from-[#6B4F4F]/60 via-[#6B4F4F]/30 to-transparent rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    transition={{ duration: 0.8, delay: 0.4 + (idx * 0.1) }}
                                    viewport={{ once: true }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Divider */}
                <motion.div
                    className="mt-24 h-px bg-linear-to-r from-transparent via-[#6B4F4F]/20 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                />
            </div>
        </section>
    );
}
