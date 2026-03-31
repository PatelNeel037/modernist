'use client';

import ScrollReveal from './ui/ScrollReveal';

export default function BrandStatement() {
    return (
        <section className="py-32 md:py-56 bg-white overflow-hidden">
            <div className="container mx-auto max-w-[1400px] px-6">
                <ScrollReveal direction="up" duration={1.5}>
                    <div className="relative bg-[#F0F2F5] p-16 md:p-32 rounded-[80px] md:rounded-[120px] shadow-[30px_30px_80px_#d1d9e6,-30px_-30px_80px_#ffffff] border border-white/40 flex flex-col items-center">
                        {/* Tactile Inset "Glow" for 3D Volume */}
                        <div className="absolute inset-0 rounded-[80px] md:rounded-[120px] shadow-[inset_15px_15px_30px_rgba(255,255,255,0.8),inset_-15px_-15px_30px_rgba(163,177,198,0.4)] pointer-events-none" />
                        
                        {/* Philosophy Pill */}
                        <div className="mb-12 px-8 py-3 bg-[#F0F2F5] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] rounded-full inline-flex items-center gap-3 border border-white/50">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-blue-600/60 leading-none">The Philosophy</span>
                        </div>
                        
                        {/* Main Statement with Editorial Shadow */}
                        <h2 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-black leading-[1.1] text-gray-900 tracking-[-0.04em] drop-shadow-xl text-center max-w-5xl mx-auto">
                            "Crafting pieces that <span className="text-blue-600/80 italic font-serif">outlive</span> trends.<br className="hidden md:block" /> 
                            Simplicity is the <span className="opacity-60">ultimate</span> sophistication."
                        </h2>
                        
                        {/* Tactile Masonry Separator */}
                        <div className="mt-20 md:mt-24 space-y-4 flex flex-col items-center">
                            <div className="w-12 h-1.5 bg-blue-600/20 rounded-full shadow-inner" />
                            <div className="w-px h-24 bg-linear-to-b from-blue-500/40 to-transparent shadow-lg" />
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
