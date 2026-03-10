'use client';

import ScrollReveal from './ui/ScrollReveal';

export default function BrandStatement() {
    return (
        <section className="py-24 bg-bg-main text-center px-6">
            <div className="container mx-auto max-w-4xl">
                <ScrollReveal direction="up" duration={0.8}>
                    <h2 className="text-3xl md:text-5xl font-playfair leading-tight text-content-heading">
                        "a lodu neel"
                    </h2>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.3}>
                    <div className="w-24 h-1 bg-brand-primary mx-auto mt-12 rounded-full opacity-60"></div>
                </ScrollReveal>
            </div>
        </section>
    );
}
