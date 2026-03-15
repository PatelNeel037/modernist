'use client';

import ScrollReveal from './ui/ScrollReveal';

export default function BrandStatement() {
    return (
        <section className="py-24 bg-bg-main text-center px-6">
            <div className="container mx-auto max-w-4xl">
                <ScrollReveal direction="up" duration={0.8}>
                    <div className="flex items-center justify-center gap-6 md:gap-12">
                        <div className="h-px bg-brand-primary/30 flex-1 hidden sm:block" />
                        <h2 className="text-3xl md:text-5xl font-playfair leading-tight text-content-heading italic">
                            "Redefining Modern Elegance"
                        </h2>
                        <div className="h-px bg-brand-primary/30 flex-1 hidden sm:block" />
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
