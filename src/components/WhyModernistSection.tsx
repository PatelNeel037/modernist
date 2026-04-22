'use client';

import { motion } from 'framer-motion';
import { Zap, Leaf, Users, Award } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const reasons = [
    {
        icon: Zap,
        title: 'Fast Fashion Alternative',
        description: 'Timeless designs that last seasons. Quality over quantity, built to be worn again and again.',
        color: 'from-[#8F4E34]/14 to-transparent',
        iconBg: 'from-[#F4EEE5] to-[#E8D4BD]'
    },
    {
        icon: Leaf,
        title: 'Sustainably Crafted',
        description: 'Ethically sourced materials and responsible manufacturing practices for a better future.',
        color: 'from-[#7C6656]/14 to-transparent',
        iconBg: 'from-[#F4EEE5] to-[#E8D4BD]'
    },
    {
        icon: Users,
        title: 'Community Driven',
        description: 'Join thousands of customers who believe in modernist values. Real stories, real style.',
        color: 'from-[#8E7664]/14 to-transparent',
        iconBg: 'from-[#F4EEE5] to-[#E8D4BD]'
    },
    {
        icon: Award,
        title: 'Premium Quality',
        description: 'Hand-selected fabrics and meticulous attention to detail in every stitch and seam.',
        color: 'from-[#5A4639]/14 to-transparent',
        iconBg: 'from-[#F4EEE5] to-[#E8D4BD]'
    }
];

export default function WhyModernistSection() {
    return (
        <section className="relative py-32 md:py-48 bg-linear-to-b from-[#FBF5EE] via-[#F8EFE4] to-[#F1E4D4] overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 right-10 w-72 h-72 bg-[#8F4E34]/10 rounded-full blur-3xl"
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 left-10 w-96 h-96 bg-[#D9C0A9]/50 rounded-full blur-3xl"
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
                        className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white rounded-full shadow-lg border border-[#6B4F4F]/10"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-[#6B4F4F]"
                        />
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#6B4F4F]/70">Why Modernist</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black text-[#3E2C2C] leading-tight mb-8 tracking-tight drop-shadow-sm">
                        More Than
                        <motion.span
                            className="block text-transparent bg-clip-text bg-linear-to-r from-[#6B4F4F] to-[#3E2C2C] italic font-medium"
                            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            Fashion
                        </motion.span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#5C4A3D] max-w-2xl mx-auto font-medium">
                        We're redefining how you think about your wardrobe
                    </p>
                </ScrollReveal>

                {/* Reasons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {reasons.map((reason, idx) => {
                        const Icon = reason.icon;
                        return (
                            <ScrollReveal
                                key={idx}
                                direction="up"
                                delay={0.1 * idx}
                            >
                                <motion.div
                                    whileHover={{ y: -12, rotateZ: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="group relative h-full"
                                >
                                    {/* Card background with glassmorphism */}
                                    <div className="absolute inset-0 bg-linear-to-br from-white/80 to-white/40 rounded-4xl backdrop-blur-md border border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Main card */}
                                    <div className="relative bg-linear-to-br from-white/50 to-white/30 p-10 rounded-4xl border border-white/60 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                                        {/* Hover gradient effect */}
                                        <motion.div
                                            className={`absolute inset-0 bg-linear-to-br ${reason.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                        />

                                        {/* Content container */}
                                        <div className="relative z-10">
                                            {/* Icon Container */}
                                            <motion.div
                                                className={`mb-8 inline-flex p-4 bg-linear-to-br ${reason.iconBg} rounded-3xl shadow-md border border-white/40 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                                                whileHover={{ rotate: 8 }}
                                            >
                                                <Icon size={28} className="text-[#6B4F4F]" strokeWidth={1.5} />
                                            </motion.div>

                                            {/* Title */}
                                            <h3 className="text-lg md:text-xl font-playfair font-bold text-[#3E2C2C] mb-4 tracking-tight group-hover:text-[#6B4F4F] transition-colors duration-300">
                                                {reason.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-[#5C4A3D]/80 text-sm md:text-base leading-relaxed font-medium group-hover:text-[#5C4A3D] transition-colors duration-300">
                                                {reason.description}
                                            </p>

                                            {/* Animated bottom accent */}
                                            <motion.div
                                                className="mt-6 h-1 bg-linear-to-r from-[#6B4F4F]/30 to-transparent rounded-full"
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
            </div>
        </section>
    );
}
