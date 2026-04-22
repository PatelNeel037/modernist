'use client';

import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
    {
        number: '01',
        title: 'Discover',
        description: 'Explore our curated collections of premium essentials designed for the modern lifestyle.',
        icon: '🔍'
    },
    {
        number: '02',
        title: 'Choose',
        description: 'Select pieces that resonate with your style. Each item is crafted with intention.',
        icon: '✨'
    },
    {
        number: '03',
        title: 'Experience',
        description: 'Feel the premium quality and comfort. Timeless design meets everyday wear.',
        icon: '👕'
    },
    {
        number: '04',
        title: 'Inspire',
        description: 'Share your modernist moments with our community. Your style matters.',
        icon: '💫'
    }
];

export default function JourneySection() {
    return (
        <section className="relative py-32 md:py-48 bg-linear-to-br from-[#F5F1E9] via-white to-[#F5F1E9] overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/3 -right-40 w-96 h-96 bg-[#6B4F4F]/5 rounded-full blur-3xl"
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 max-w-350">
                {/* Header */}
                <ScrollReveal direction="up" className="text-center mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white rounded-full shadow-lg border border-[#6B4F4F]/10"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-[#6B4F4F]"
                        />
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#6B4F4F]/70">Your Journey</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black text-[#3E2C2C] leading-tight mb-8 tracking-tight">
                        Four Steps to
                        <motion.span
                            className="block text-transparent bg-clip-text bg-linear-to-r from-[#6B4F4F] to-[#3E2C2C]"
                            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            Timeless Style
                        </motion.span>
                    </h2>
                </ScrollReveal>

                {/* Steps Timeline */}
                <div className="relative">
                    {/* Connecting Line */}
                    <motion.div
                        className="hidden lg:block absolute top-32 left-1/2 -translate-x-1/2 w-1 h-3/4 bg-linear-to-b from-[#6B4F4F]/30 to-transparent"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 1.2 }}
                        style={{ originY: 0 }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
                        {steps.map((step, idx) => (
                            <ScrollReveal
                                key={idx}
                                direction={idx % 2 === 0 ? 'left' : 'right'}
                                delay={0.1 * idx}
                            >
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="group relative"
                                >
                                    {/* Step Card */}
                                    <div className="relative p-8 md:p-10 bg-white rounded-3xl border border-[#6B4F4F]/10 shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col overflow-hidden">
                                        {/* Hover background */}
                                        <motion.div
                                            className="absolute inset-0 bg-linear-to-br from-[#6B4F4F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        />

                                        {/* Step Number Circle */}
                                        <motion.div
                                            className="relative z-10 mb-6 inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#6B4F4F]/20 to-[#6B4F4F]/5 border border-[#6B4F4F]/30 group-hover:scale-110 transition-transform duration-300"
                                            whileHover={{ rotate: 10 }}
                                        >
                                            <span className="text-2xl font-playfair font-black text-[#6B4F4F]">{step.number}</span>
                                        </motion.div>

                                        {/* Icon */}
                                        <div className="relative z-10 text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                                            {step.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="relative z-10 text-2xl md:text-xl font-playfair font-bold text-[#3E2C2C] mb-4 tracking-tight group-hover:text-[#6B4F4F] transition-colors duration-300">
                                            {step.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="relative z-10 text-[#5C4A3D]/70 text-sm md:text-base leading-relaxed font-medium flex-1 group-hover:text-[#5C4A3D] transition-colors duration-300">
                                            {step.description}
                                        </p>

                                        {/* Bottom accent */}
                                        <motion.div
                                            className="relative z-10 mt-8 h-1 bg-linear-to-r from-[#6B4F4F]/40 to-transparent rounded-full"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '100%' }}
                                            transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1) }}
                                        />
                                    </div>

                                    {/* Dot on timeline */}
                                    <motion.div
                                        className="hidden lg:block absolute -top-32 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-[#6B4F4F] shadow-lg group-hover:scale-125 transition-transform duration-300"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2 + (idx * 0.2), repeat: Infinity }}
                                    />
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <ScrollReveal direction="up" delay={0.5} className="flex justify-center mt-24 md:mt-32">
                    <Link href="/shop" className="group relative inline-flex items-center">
                        <div className="absolute inset-0 bg-linear-to-r from-[#6B4F4F] to-[#3E2C2C] rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative px-12 py-5 bg-linear-to-r from-[#6B4F4F] to-[#3E2C2C] rounded-full text-white font-bold uppercase tracking-[0.3em] text-sm
                            shadow-2xl flex items-center gap-4 overflow-hidden"
                        >
                            <span>Start Your Journey</span>
                            <motion.div
                                className="w-5 h-5"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight size={20} />
                            </motion.div>
                        </div>
                    </Link>
                </ScrollReveal>
            </div>
        </section>
    );
}
