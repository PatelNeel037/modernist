'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.99, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
                mass: 0.8
            }}
            className="w-full h-full origin-top"
        >
            {children}
        </motion.div>
    );
}
