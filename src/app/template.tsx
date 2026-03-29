'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Only run the entry animation on the very first visit to the site
        const hasAnimated = sessionStorage.getItem('hasAnimated');
        if (!hasAnimated) {
            setShouldAnimate(true);
            sessionStorage.setItem('hasAnimated', 'true');
        }
    }, [pathname]);

    // Don't show confusing animations for admin paths (it breaks their UX forms)
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin || !isMounted || !shouldAnimate) {
        return <div className="w-full h-full">{children}</div>;
    }

    return (
        <div className="relative overflow-hidden w-full h-full">
            {/* The dramatic entrance wipe */}
            <motion.div
                className="fixed top-0 left-0 w-full bg-brand-dark z-[100] pointer-events-none flex items-center justify-center shadow-2xl"
                initial={{ height: '100vh', opacity: 1 }}
                animate={{ height: '0vh', opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
            >
                <motion.span
                    className="font-playfair font-bold text-white text-5xl md:text-7xl tracking-[0.2em] shadow-lg"
                    initial={{ opacity: 1, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                >
                    MODERNIST
                </motion.span>
            </motion.div>

            {/* The page content entry */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2
                }}
                className="w-full h-full origin-bottom will-change-transform"
            >
                {children}
            </motion.div>
        </div>
    );
}
