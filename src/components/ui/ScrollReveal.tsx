'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
    duration?: number;
    className?: string;
}

export default function ScrollReveal({ children, direction = 'up', delay = 0, duration = 0.6, className = '' }: ScrollRevealProps) {

    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'right' ? -40 : direction === 'left' ? 40 : 0,
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1] as const, // Cubic bezier for smooth easing
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }} // Triggers slightly before it enters the viewport
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
