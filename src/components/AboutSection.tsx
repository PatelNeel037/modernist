import { Truck, RotateCcw, Lock, Award } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

export default function AboutSection() {
    const features = [
        { icon: <Truck size={28} className="text-blue-600/70" />, title: 'Complimentary Delivery', text: 'On all domestic orders over $150.' },
        { icon: <RotateCcw size={28} className="text-purple-600/70" />, title: 'Effortless Returns', text: '30-day money-back guarantee, no questions asked.' },
        { icon: <Lock size={28} className="text-emerald-600/70" />, title: 'Secure Checkout', text: 'Encrypted transactions for your peace of mind.' },
        { icon: <Award size={28} className="text-amber-600/70" />, title: 'Exceptional Quality', text: 'Crafted from the finest sustainable materials.' },
    ];

    return (
        <section id="about" className="py-24 md:py-48 bg-[#F0F2F5] relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1400px]">
                <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">

                    {/* Image Side - Soft 3D Frame */}
                    <div className="w-full lg:w-1/2 relative group">
                            <ScrollReveal direction="left" className="relative z-10 h-[500px] md:h-[750px] w-full rounded-[60px] md:rounded-[100px] overflow-hidden shadow-[30px_30px_60px_#d1d9e6,-30px_-30px_60px_#ffffff] border-8 border-white/40">
                            <img
                                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                                alt="Modernist Craftsmanship"
                                className="w-full h-full object-cover grayscale-20 transition-transform duration-[3s] group-hover:scale-110"
                            />
                            {/* Inner Shine Overlay */}
                            <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent pointer-events-none" />
                        </ScrollReveal>
                        
                        {/* Decorative Background Element */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <ScrollReveal direction="up">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-[2px] bg-blue-600/30 rounded-full" />
                                <span className="text-[10px] uppercase tracking-[0.5em] text-blue-600/60 font-black">Ethos & Excellence</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-playfair font-black text-gray-900 mb-10 leading-[1.1] tracking-tight">
                                Designed for <span className="text-blue-600/80 italic">Life.</span><br /> 
                                Made to <span className="opacity-50">Endure.</span>
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.1}>
                            <p className="text-gray-500 mb-20 text-lg tracking-wide leading-relaxed font-light max-w-xl">
                                We believe in fashion that doesn't compromise. Our collections are ethically crafted from sustainable, premium materials, ensuring every piece feels as remarkable as it looks. Discovery the intersection of comfort and luxury.
                            </p>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                            {features.map((feature, idx) => (
                                <ScrollReveal direction="up" delay={0.2 + (idx * 0.1)} key={idx}>
                                    <div className="group relative bg-[#F0F2F5] p-10 rounded-[60px] shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff] border border-white/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[40px_40px_80px_#d1d9e6,-40px_-40px_80px_#ffffff] h-full flex flex-col items-start overflow-hidden">
                                        {/* Neumorphic Inset Depth for icons */}
                                        <div className="mb-8 relative inline-flex">
                                            <div className="w-24 h-24 bg-[#F0F2F5] rounded-[32px] shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] border border-white/50 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                                                <div className="absolute inset-0 rounded-[32px] shadow-[inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-4px_-4px_8px_rgba(163,177,198,0.2)] pointer-events-none" />
                                                {feature.icon}
                                            </div>
                                        </div>
                                        
                                        <h4 className="font-playfair font-black text-gray-900 mb-3 leading-none uppercase text-[11px] tracking-[0.2em]">{feature.title}</h4>
                                        <p className="text-gray-500/80 text-sm leading-relaxed font-medium">{feature.text}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
