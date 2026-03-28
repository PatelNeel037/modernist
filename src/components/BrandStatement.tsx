'use client';

import ScrollReveal from './ui/ScrollReveal';

export default function BrandStatement() {
    return (
        <section className="py-24 md:py-40 bg-gray-50 text-center px-4 md:px-8 border-b border-gray-200">
            <div className="container mx-auto max-w-[1200px] flex flex-col items-center">
                <ScrollReveal direction="up" duration={1.2}>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 font-semibold">The Philosophy</p>
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-playfair font-medium leading-[1.2] text-black italic">
                        "Crafting pieces that outlive trends.<br className="hidden md:block" /> Simplicity is the ultimate sophistication."
                    </h2>
                    <div className="w-px h-16 bg-black mx-auto mt-12 md:mt-16 block" />
                </ScrollReveal>
            </div>
        </section>
    );
}
