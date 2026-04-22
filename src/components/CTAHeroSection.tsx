'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import Magnetic from './ui/Magnetic';

const floatingElements = [
    { delay: 0, x: -50, y: 50, size: 200 },
    { delay: 0.1, x: 150, y: -80, size: 150 },
    { delay: 0.2, x: 100, y: 100, size: 180 },
];

export default function CTAHeroSection() {
    return (
        <section className="relative py-24 md:py-40 bg-linear-to-br from-[#F8EFE4] via-[#F1E4D4] to-[#EFE5DB] overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {floatingElements.map((el, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-[#8F4E34]/8 blur-3xl"
                        style={{ width: el.size, height: el.size }}
                        animate={{
                            x: [el.x, el.x + 30, el.x],
                            y: [el.y, el.y - 40, el.y],
                        }}
                        transition={{
                            duration: 8 + el.delay,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        initial={{ opacity: 0.3 }}
                    />
                ))}

                {/* Grid background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(0deg, rgba(36,28,23,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(36,28,23,.08) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />

                {/* Gradient Orbs */}
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-[#8F4E34]/15 to-transparent rounded-full blur-3xl"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-[#D9C0A9]/50 to-transparent rounded-full blur-3xl"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* Premium Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2.5 mb-10 px-5 py-2.5 bg-white/70 backdrop-blur-xl rounded-full border border-[#8F4E34]/20 shadow-lg hover:bg-white transition-all duration-300"
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                            <Zap size={16} className="text-[#8F4E34]" fill="currentColor" />
                        </motion.div>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#8F4E34]">48-Hour Flash Sale</span>
                    </motion.div>

                    {/* Premium Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9 }}
                        className="mb-8"
                    >
                        <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-playfair font-black text-[#1E1713] mb-6 leading-[1.05] tracking-tighter drop-shadow-sm">
                            Elevate Your
                            <motion.span
                                className="block italic text-transparent bg-clip-text bg-linear-to-r from-[#8F4E34] via-[#B87857] to-[#8F4E34] mt-2"
                                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                style={{ backgroundSize: '200% 200%' }}
                            >
                                Everyday Style
                            </motion.span>
                        </h2>
                    </motion.div>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-[#68584D] mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Discover timeless pieces crafted from premium fabrics. Where modern design meets everyday luxury.
                    </motion.p>

                    {/* Animated underline */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-1 bg-linear-to-r from-transparent via-[#8F4E34]/40 to-transparent max-w-xs mx-auto mb-12"
                    />

                    {/* Premium CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Magnetic>
                            <Link href="/shop" className="group relative inline-flex items-center">
                                <div className="absolute inset-0 bg-linear-to-r from-[#8F4E34] to-[#B87857] rounded-full blur-lg opacity-30 group-hover:opacity-45 transition-opacity duration-300" />
                                <div className="relative px-12 py-5 bg-[#8F4E34] rounded-full text-[#FBF5EE] font-bold uppercase tracking-[0.3em] text-sm
                                    shadow-2xl 
                                    flex items-center gap-4 overflow-hidden group-hover:shadow-3xl transition-all duration-300"
                                >
                                    <span className="relative z-10">Shop Now</span>
                                    <motion.div
                                        className="w-5 h-5 relative z-10"
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight size={20} />
                                    </motion.div>

                                    {/* Shine effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent"
                                        animate={{ x: [-100, 100] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                            </Link>
                        </Magnetic>

                        <Link href="#categories" className="group relative inline-flex items-center gap-3 px-8 py-4 text-[#8F4E34] hover:text-[#1E1713] transition-colors">
                            <span className="font-bold uppercase tracking-[0.2em] text-sm drop-shadow-lg">Explore Categories</span>
                            <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                <ArrowRight size={18} />
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
