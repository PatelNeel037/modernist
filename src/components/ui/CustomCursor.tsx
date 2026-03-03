'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);

    // Using motion values for high-performance direct DOM manipulation
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Add spring physics to the cursor
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Track mouse position globally
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16); // Center offset
            cursorY.set(e.clientY - 16);
        };

        // Detect if hovering over clickable elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a')
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Also hide the default cursor system-wide
    useEffect(() => {
        document.body.style.cursor = 'none';

        // Return original if unmounted
        return () => {
            document.body.style.cursor = 'auto';
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-9999 mix-blend-difference hidden md:block"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                border: isHovered ? '2px solid transparent' : '2px solid white',
                backgroundColor: isHovered ? 'white' : 'transparent',
            }}
            animate={{
                scale: isHovered ? 2.5 : 1,
                opacity: 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
    );
}
