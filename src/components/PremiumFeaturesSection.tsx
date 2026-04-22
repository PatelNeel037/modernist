'use client';

import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import { CheckCircle2, Zap, Heart, Shield } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Instant Shipping',
        description: 'Fast delivery on all orders within 2-3 business days. No waiting around.',
        detail: 'Free shipping on orders over $100'
    },
    {
        icon: Shield,
        title: 'Secure Payments',
        description: 'Bank-level encryption protects your every transaction.',
        detail: 'Multiple payment options available'
    },
    {
        icon: Heart,
        title: 'Lifetime Quality',
        description: 'Premium materials built to last. Your investment in timeless style.',
        detail: '2-year durability guarantee'
    },
    {
        icon: CheckCircle2,
        title: 'Hassle-Free Returns',
        description: '30-day returns policy. No questions asked if you change your mind.',
        detail: 'Full refund within 5 business days'
    }
];

export default function PremiumFeaturesSection() {
    return (
        <section className="relative py-32 md:py-48 bg-linear-to-br from-[#F1E4D4] via-[#EAD7C1] to-[#DFC7AD] overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating orbs */}
                <motion.div
                    className="absolute top-1/4 -left-40 w-80 h-80 bg-[#8F4E34]/10 rounded-full blur-3xl"
                    animate={{ y: [0, 50, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-1/3 -right-40 w-96 h-96 bg-[#D9C0A9]/50 rounded-full blur-3xl"
                    animate={{ y: [0, -50, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(36,28,23,.08) 1px, transparent 1px), linear-gradient(rgba(36,28,23,.08) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="relative z-10 container mx-auto px-6 max-w-350">
                {/* Header */}
                <ScrollReveal direction="up" className="text-center mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/70 backdrop-blur-md rounded-full border border-[#8F4E34]/20 shadow-lg"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-[#8F4E34]"
                        />
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#8F4E34]">Premium Features</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black text-[#1E1713] leading-tight mb-8 tracking-tight drop-shadow-sm">
                        Why Shop With
                        <motion.span
                            className="block italic text-transparent bg-clip-text bg-linear-to-r from-[#8F4E34] via-[#B87857] to-[#8F4E34]"
                            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            Modernist
                        </motion.span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#68584D] max-w-2xl mx-auto font-medium">
                        We stand behind every product with premium service and support
                    </p>
                </ScrollReveal>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <ScrollReveal
                                key={idx}
                                direction="up"
                                delay={0.1 * idx}
                            >
                                <motion.div
                                    whileHover={{ y: -12 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="group relative h-full"
                                >
                                    {/* Card */}
                                    <div className="relative p-8 md:p-10 bg-white/70 backdrop-blur-md rounded-3xl border border-[#8F4E34]/15 shadow-xl overflow-hidden h-full flex flex-col hover:bg-white transition-all duration-300">
                                        {/* Shine effect on hover */}
                                        <motion.div
                                                className="absolute inset-0 bg-linear-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100"
                                            animate={{ x: [-100, 100] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {/* Icon */}
                                            <motion.div
                                                className="mb-6 inline-flex p-4 bg-[#F4EEE5] rounded-2xl border border-[#8F4E34]/20 group-hover:bg-[#E8D4BD] group-hover:scale-110 transition-all duration-300"
                                                whileHover={{ rotate: 8 }}
                                            >
                                                <Icon size={28} className="text-[#8F4E34]" strokeWidth={1.5} />
                                            </motion.div>

                                            {/* Title */}
                                            <h3 className="text-2xl md:text-xl font-playfair font-bold text-[#1E1713] mb-4 tracking-tight group-hover:text-[#8F4E34] transition-colors duration-300">
                                                {feature.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-[#68584D] text-sm md:text-base leading-relaxed font-medium group-hover:text-[#1E1713] transition-colors duration-300 flex-1">
                                                {feature.description}
                                            </p>

                                            {/* Detail Tag */}
                                            <motion.div
                                                className="mt-6 inline-block px-4 py-2 bg-[#F4EEE5] rounded-full border border-[#8F4E34]/20 text-xs font-bold uppercase tracking-[0.2em] text-[#8F4E34] group-hover:bg-[#E8D4BD] transition-all duration-300"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {feature.detail}
                                            </motion.div>

                                            {/* Bottom glow */}
                                            <motion.div
                                                className="mt-8 h-1 bg-linear-to-r from-[#8F4E34]/45 via-[#8F4E34]/25 to-transparent rounded-full"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '100%' }}
                                                transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1) }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </ScrollReveal>
                        );
                    })}
                </div>

                {/* Decorative divider */}
                <motion.div
                    className="mt-24 h-px bg-linear-to-r from-transparent via-[#8F4E34]/25 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1 }}
                />
            </div>
        </section>
    );
}
