'use client';

import { motion } from 'framer-motion';
import Hero3D from './Hero3D';
import Magnetic from './ui/Magnetic';

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
            {/* Background Image / Placeholder */}
            <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

            <div className="absolute inset-0 z-0">
                <Hero3D />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto pointer-events-none">
                <h1 className="flex flex-col items-center justify-center font-serif leading-tight animate-fade-in-up">
                    <span className="text-2xl md:text-3xl font-light tracking-widest text-gray-200 uppercase mb-4 block">Modern</span>
                    <span className="text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-md">Everyday Wear</span>
                </h1>
                <p className="text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto text-gray-100 animate-fade-in-up delay-100 mt-6 leading-relaxed opacity-90">
                    Premium fabrics for modern lifestyle. Redefining your wardrobe with essentials that matter.
                </p>
                <div className="flex justify-center w-full">
                    <Magnetic>
                        <motion.a
                            href="/shop"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="inline-block bg-brand-primary text-bg-main hover:bg-brand-dark hover:text-white px-10 py-4 rounded-full text-base font-bold transition-colors shadow-xl border border-transparent hover:shadow-2xl tracking-wide uppercase pointer-events-auto cursor-pointer"
                        >
                            SHOP NOW
                        </motion.a>
                    </Magnetic>
                </div>
            </div>
            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
            >
                <span className="text-white text-xs font-light tracking-widest block mb-2 cursor-pointer">SCROLL</span>
                <div className="w-px h-12 bg-white/50 mx-auto" />
            </motion.div>
        </section>
    );
}
