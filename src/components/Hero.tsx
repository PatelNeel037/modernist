'use client';

import { motion } from 'framer-motion';
import Magnetic from './ui/Magnetic';

import { useState, useEffect } from 'react';
import { DB } from '@/services/db';

export default function Hero() {
    const [heroData, setHeroData] = useState({
        tagline: 'The New Standard',
        mainTitle: 'ELEVATED',
        subTitle: 'Everyday Wear',
        description: 'Premium fabrics. Uncompromising design. Redefining your wardrobe with essentials built for the modern lifestyle.',
        bgImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
        buttonText: 'Explore Collection',
        buttonHref: '/shop'
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadHeroData = async () => {
            const data = await DB.fetchHomepage();
            if (data && data.hero) {
                setHeroData(data.hero);
            }
            setIsLoading(false);
        };
        loadHeroData();
    }, []);

    if (isLoading) {
        return <div className="h-screen bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>;
    }

    return (
        <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
            {/* Background Image with Parallax-like scale */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <img
                    src={heroData.bgImg}
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-70"
                />
            </motion.div>

            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/80 z-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 text-center text-white px-6 w-full max-w-5xl mx-auto pointer-events-none flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <span className="text-sm md:text-base font-semibold tracking-[0.3em] text-gray-300 uppercase mb-6 block border-b border-white/20 pb-4 inline-block px-8">
                        {heroData.tagline}
                    </span>
                </motion.div>

                <motion.h1
                    className="font-playfair leading-[1.1] mb-6 drop-shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                >
                    <span className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white block">
                        {heroData.mainTitle}
                    </span>
                    <span className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-gray-200 block italic mt-2">
                        {heroData.subTitle}
                    </span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto text-gray-200 leading-relaxed opacity-90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                >
                    {heroData.description}
                </motion.p>

                <motion.div
                    className="flex justify-center w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                >
                    <Magnetic>
                        <motion.a
                            href={heroData.buttonHref}
                            whileHover={{ scale: 1.08, rotate: 1.5 }}
                            whileTap={{ scale: 0.92, rotate: -0.5 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="group relative inline-flex items-center justify-center pointer-events-auto cursor-pointer"
                        >
                            {/* Clay Button Body */}
                            <div className="px-16 py-6 bg-[#F0F2F5] rounded-full text-black font-black text-xs uppercase tracking-[0.3em] transition-all duration-300
                                shadow-[15px_15px_30px_rgba(0,0,0,0.6),inset_8px_8px_16px_rgba(255,255,255,1),inset_-8px_-8px_16px_rgba(163,177,198,0.5)]
                                group-hover:shadow-[20px_20px_40px_rgba(0,0,0,0.8),inset_4px_4px_8px_rgba(255,255,255,1),inset_-4px_-4px_8px_rgba(163,177,198,0.4)]
                                flex items-center gap-4 border border-white/50"
                            >
                                <span className="drop-shadow-sm">{heroData.buttonText}</span>
                                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] group-hover:bg-white/20 transition-all">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-3">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </motion.a>
                    </Magnetic>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ opacity: { delay: 1.5, duration: 1 }, y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
            >
                <div className="w-px h-16 bg-linear-to-b from-white/80 to-transparent mx-auto origin-top" />
            </motion.div>
        </section>
    );
}
