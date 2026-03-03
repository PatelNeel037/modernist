'use client';

import { Instagram } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

export default function InstagramSection() {
    const images = [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop', // Fashion model
        'https://images.unsplash.com/photo-1529139574466-a302c2751994?q=80&w=1000&auto=format&fit=crop', // Aesthetic detail
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop', // Shopping / Street
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop', // Minimalist outfit
    ];

    return (
        <section className="py-20 bg-bg-main">
            <div className="container mx-auto px-6">
                <ScrollReveal direction="up" className="flex flex-col items-center mb-12">
                    <Instagram className="w-8 h-8 text-brand-primary mb-4" />
                    <h2 className="text-2xl md:text-3xl font-playfair font-bold text-content-heading text-center">
                        Follow us on Instagram
                    </h2>
                    <a href="#" className="text-brand-primary font-medium mt-2 hover:underline">@modernist.official</a>
                </ScrollReveal>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <ScrollReveal direction="up" delay={0.1 * idx} key={idx} className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer">
                            <img
                                src={img}
                                alt={`Instagram post ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Instagram className="w-8 h-8 text-white" />
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
