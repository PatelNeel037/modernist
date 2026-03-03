'use client';

import { Star } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';

function TestimonialCard({ test, idx }: { test: any, idx: number }) {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const rotateX = useTransform(springY, [0, 1], ["5deg", "-5deg"]);
    const rotateY = useTransform(springX, [0, 1], ["-5deg", "5deg"]);

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
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="bg-bg-main p-8 rounded-lg shadow-sm border border-bg-accent h-full flex flex-col"
            >
                <div className="flex justify-center mb-4 text-emerald-500" style={{ transform: "translateZ(30px)" }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-content-body italic mb-6 flex-1" style={{ transform: "translateZ(20px)" }}>"{test.text}"</p>
                <h4 className="font-semibold text-content-heading" style={{ transform: "translateZ(40px)" }}>- {test.name}</h4>
            </motion.div>
        </ScrollReveal>
    );
}

export default function TestimonialSection() {
    const testimonials = [
        { name: 'Sarah M.', text: 'Great quality and fast delivery. Layout is clean and easy to navigate.' },
        { name: 'James D.', text: 'Absolutely love the linen shirts. Perfect for summer!' },
        { name: 'Emily R.', text: 'Customer service was amazing when I needed an exchange.' },
    ];

    return (
        <section className="py-24 bg-bg-soft border-t border-bg-accent">
            <div className="container mx-auto px-6 text-center">
                <ScrollReveal direction="up">
                    <h2 className="text-3xl font-playfair font-bold text-content-heading mb-12 relative inline-flex items-center gap-4">
                        <span className="h-px bg-bg-accent w-12" />
                        Happy Customers
                        <span className="h-px bg-bg-accent w-12" />
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
                    {testimonials.map((test, idx) => (
                        <TestimonialCard key={idx} test={test} idx={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
