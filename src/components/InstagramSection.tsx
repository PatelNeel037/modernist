'use client';

import { Instagram } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';
import { useState, useEffect } from 'react';
import { DB } from '@/services/db';

export default function InstagramSection() {
    const [images, setImages] = useState<any[]>([]);
    
    const defaultImages = [
        { imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop', link: '#' },
        { imageUrl: 'https://images.unsplash.com/photo-1529139574466-a302c2751994?q=80&w=1000&auto=format&fit=crop', link: '#' },
        { imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop', link: '#' },
        { imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop', link: '#' },
    ];

    useEffect(() => {
        const loadPosts = async () => {
            const data = await DB.fetchInstagramPosts();
            if (data && data.length > 0) {
                setImages(data);
            } else {
                setImages(defaultImages);
            }
        };
        loadPosts();
    }, []);

    return (
        <section className="py-20 bg-[#E8D6C0] relative">
            <div className="container mx-auto px-6">
                <ScrollReveal direction="up" className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border border-[#8F4E34]/10 transition-transform hover:rotate-12 duration-500">
                        <Instagram className="w-8 h-8 text-[#8F4E34]" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-playfair font-black text-[#1E1713] text-center tracking-tight mb-4">
                        Follow our Journey
                    </h2>
                    <a href="https://instagram.com/modernist.official" target="_blank" rel="noopener noreferrer" className="text-[#8F4E34] font-black text-lg tracking-[0.3em] uppercase flex items-center gap-2 hover:opacity-70 transition-all group">
                        @MODERNIST.OFFICIAL
                        <div className="h-px bg-[#8F4E34] w-0 group-hover:w-8 transition-all duration-500" />
                    </a>
                </ScrollReveal>
 
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {images.map((post, idx) => (
                        <ScrollReveal direction="up" delay={0.1 * idx} key={post._id || idx} className="group relative aspect-square overflow-hidden rounded-[2.5rem] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <a href={post.link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                <img
                                    src={post.imageUrl}
                                    alt={`Instagram post ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#1E1713]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="bg-white/90 p-4 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                                        <Instagram className="w-6 h-6 text-[#1E1713]" />
                                    </div>
                                </div>
                            </a>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
            
            {/* Background Decorative Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-[20vw] font-playfair font-black text-[#8F4E34]/5 pointer-events-none select-none">
                MODERNIST
            </div>
        </section>
    );
}
