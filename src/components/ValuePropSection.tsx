'use client';

import React from 'react';
import { Truck, RotateCcw, Lock, Award } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

const features = [
    {
        icon: <Truck size={32} strokeWidth={1.5} className="text-blue-600/70" />,
        title: 'Complimentary Delivery',
        text: 'On all domestic orders over $150.',
        accent: 'from-blue-400/20 to-indigo-500/0'
    },
    {
        icon: <RotateCcw size={32} strokeWidth={1.5} className="text-purple-600/70" />,
        title: 'Effortless Returns',
        text: '30-day money-back guarantee, no questions asked.',
        accent: 'from-purple-400/20 to-pink-500/0'
    },
    {
        icon: <Lock size={32} strokeWidth={1.5} className="text-emerald-600/70" />,
        title: 'Secure Checkout',
        text: 'Encrypted transactions for your peace of mind.',
        accent: 'from-emerald-400/20 to-teal-500/0'
    },
    {
        icon: <Award size={32} strokeWidth={1.5} className="text-amber-600/70" />,
        title: 'Exceptional Quality',
        text: 'Crafted from the finest sustainable materials.',
        accent: 'from-amber-400/20 to-orange-500/0'
    },
];

export default function ValuePropSection() {
    return (
        <section className="py-32 bg-[#F0F2F5] overflow-hidden whitespace-normal">
            <div className="container mx-auto px-6 max-w-[1400px]">
                <div className="text-center mb-20">
                    <ScrollReveal direction="up">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-blue-600/60 mb-6 block font-black">Our Promise</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-black text-gray-900 leading-tight mb-6">
                            Elevating the <span className="text-blue-600/80 italic">Standard</span>
                        </h2>
                        <div className="w-24 h-1 bg-blue-600/10 mx-auto rounded-full shadow-inner" />
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {features.map((feature, idx) => (
                        <ScrollReveal direction="up" delay={0.1 * idx} key={idx}>
                            <div className="group relative bg-[#F0F2F5] p-10 rounded-[60px] shadow-[25px_25px_50px_#d1d9e6,-25px_-25px_50px_#ffffff] border border-white/60 transition-all duration-700 hover:-translate-y-4 hover:shadow-[35px_35px_70px_#d1d9e6,-35px_-35px_70px_#ffffff] flex flex-col items-center text-center h-full">
                                {/* Puffy Inner Depth */}
                                <div className="absolute inset-0 rounded-[60px] shadow-[inset_15px_15px_30px_rgba(255,255,255,0.8),inset_-15px_-15px_30px_rgba(163,177,198,0.3)] pointer-events-none" />

                                {/* Icon Container (Neumorphic Squircle) */}
                                <div className="mb-10 relative">
                                    <div className="w-24 h-24 bg-[#F0F2F5] rounded-[40px] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border border-white/50 group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-500 relative z-10 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-[40px] shadow-[inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-4px_-4px_8px_rgba(163,177,198,0.2)] pointer-events-none" />
                                        {feature.icon}
                                    </div>
                                    {/* Floating Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10`} />
                                </div>

                                <h4 className="font-playfair font-black text-gray-900 text-base md:text-lg mb-4 uppercase tracking-[0.2em] leading-tight">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-500/70 text-sm md:text-base leading-relaxed font-medium max-w-[260px]">
                                    {feature.text}
                                </p>

                                {/* Tactile Interactive Element */}
                                <div className="mt-auto pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-8 h-1 bg-blue-600/20 rounded-full shadow-inner animate-pulse" />
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
