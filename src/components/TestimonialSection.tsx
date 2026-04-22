'use client';

import { Star, Quote } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import { useState, useEffect } from 'react';
import { DB } from '@/services/db';

function TestimonialCard({ test, idx }: { test: any, idx: number }) {
    // ... existing TestimonialCard code ...
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const springConfig = { damping: 25, stiffness: 200, mass: 1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const rotateX = useTransform(springY, [0, 1], ["2deg", "-2deg"]);
    const rotateY = useTransform(springX, [0, 1], ["-2deg", "2deg"]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width);
        y.set((event.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <ScrollReveal direction="up" delay={0.1 * idx} className="h-full">
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ y: -10 }}
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="bg-[#F1E4D4] relative p-10 rounded-3xl shadow-xs hover:shadow-2xl border border-[#8F4E34]/30 transition-shadow duration-500 h-full flex flex-col group overflow-hidden"
            >
                {/* Decorative Quote Icon */}
                <div className="absolute top-4 right-6 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                    <Quote size={80} />
                </div>

                <div className="flex justify-center gap-1 mb-6 text-[#8F4E34] relative z-10" style={{ transform: "translateZ(30px)" }}>
                    {[...Array(test.rating || 5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                        >
                            <Star size={18} fill="currentColor" strokeWidth={0} />
                        </motion.div>
                    ))}
                </div>

                <p className="text-[#1E1713] italic text-lg leading-relaxed mb-8 flex-1 relative z-10" style={{ transform: "translateZ(20px)" }}>
                    "{test.text}"
                </p>

                <div className="flex items-center justify-center gap-3 relative z-10" style={{ transform: "translateZ(40px)" }}>
                    <div className="h-px bg-[#8F4E34]/20 w-4" />
                    <h4 className="font-bold text-[#1E1713] tracking-tight">
                        {test.name}
                    </h4>
                    <div className="h-px bg-[#8F4E34]/20 w-4" />
                </div>

                {/* Glassy reflection effect on hover */}
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
        </ScrollReveal>
    );
}

export default function TestimonialSection() {
    const defaultTestimonials = [
        { name: 'Sarah M.', text: 'Great quality and fast delivery. Layout is clean and easy to navigate.' },
        { name: 'James D.', text: 'Absolutely love the linen shirts. Perfect for summer!' },
        { name: 'Emily R.', text: 'Customer service was amazing when I needed an exchange.' },
    ];

    const [testimonials, setTestimonials] = useState<any[]>(defaultTestimonials);

    useEffect(() => {
        const loadTestimonials = async () => {
            const data = await DB.fetchTestimonials();
            if (data && data.length > 0) {
                setTestimonials(data);
            }
        };
        loadTestimonials();
    }, []);

    return (
        <section className="py-24 bg-linear-to-b from-[#EAD8C3] to-[#E0C9B0] border-t border-[#8F4E34]/20">
            <div className="container mx-auto px-6 text-center">
                <ScrollReveal direction="up">
                    <div className="flex items-center justify-center gap-8 mb-16">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="h-px bg-[#8F4E34]"
                        />
                        <h2 className="text-4xl font-playfair font-bold text-[#1E1713] tracking-tight">
                            Happy Customers
                        </h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="h-px bg-[#8F4E34]"
                        />
                    </div>
                </ScrollReveal>

                <div className="relative mt-20 overflow-hidden py-10">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(calc(-50% - 20px)); }
                        }
                        .marquee-container:hover .marquee-content {
                            animation-play-state: paused;
                        }
                    `}} />

                    {testimonials.length > 1 ? (
                        <div className="marquee-container overflow-hidden">
                            <div
                                className="marquee-content flex gap-10 w-max"
                                style={{
                                    animation: `marquee ${testimonials.length * 8}s linear infinite`
                                }}
                            >
                                {/* First set */}
                                {testimonials.map((test, idx) => (
                                    <div key={`orig-${test._id || idx}`} className="w-100 md:w-125 shrink-0">
                                        <TestimonialCard test={test} idx={idx} />
                                    </div>
                                ))}
                                {/* Second set for seamless loop */}
                                {testimonials.map((test, idx) => (
                                    <div key={`dup-${test._id || idx}`} className="w-100 md:w-125 shrink-0">
                                        <TestimonialCard test={test} idx={idx} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center px-6">
                            {testimonials.map((test, idx) => (
                                <div key={test._id || idx} className="w-full max-w-150">
                                    <TestimonialCard test={test} idx={idx} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Gradient Fades for a premium look */}
                    <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-linear-to-r from-bg-main via-bg-main/80 to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-linear-to-l from-bg-main via-bg-main/80 to-transparent z-20 pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
