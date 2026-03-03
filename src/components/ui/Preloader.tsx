'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if we've already shown the preloader in this session
        const hasLoaded = sessionStorage.getItem('modernist_preloader_shown');

        // If we are in development mode, we might want to see it every time, but for UX let's stick to session.
        // Or we can just let it run. Let's make it run once per session to avoid annoying the user.
        if (hasLoaded) {
            setIsLoading(false);
            return;
        }

        // Lock scrolling while preloading
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem('modernist_preloader_shown', 'true');
            document.body.style.overflow = '';
        }, 2800);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
                    }}
                    className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-black text-white"
                >
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                            className="text-4xl md:text-6xl lg:text-8xl font-playfair font-black tracking-widest uppercase drop-shadow-2xl"
                        >
                            <span className="inline-block" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)', color: 'transparent' }}>
                                MODERNIST
                            </span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                        className="w-48 md:w-64 h-px bg-white/50 mt-8 origin-left"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
