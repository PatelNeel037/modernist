'use client';

import { motion } from 'framer-motion';

export default function HomeBackdrop() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-linear-to-b from-[#F9F5F0] via-[#FBF5EE] to-[#F5EFE8]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            />

            <motion.div
                className="absolute inset-0 opacity-[0.12] mix-blend-multiply hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <img
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop"
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover object-center"
                />
            </motion.div>

            <div className="absolute inset-0 bg-linear-to-b from-white/40 via-white/75 to-[#FBF5EE]/98" />
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, transparent 45%, rgba(244, 239, 232, 0.18) 100%)',
                }}
            />

            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#8F4E34]/8 blur-3xl hidden md:block" />
            <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-[#D9C0A9]/40 blur-3xl hidden md:block" />
            <div className="absolute -bottom-28 left-1/3 h-112 w-md rounded-full bg-[#1E1713]/5 blur-3xl hidden md:block" />
        </div>
    );
}
