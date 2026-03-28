import { Truck, RotateCcw, Lock, Award } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

export default function AboutSection() {
    const features = [
        { icon: <Truck size={24} className="text-black mb-0" />, title: 'Complimentary Delivery', text: 'On all domestic orders over $150.' },
        { icon: <RotateCcw size={24} className="text-black mb-0" />, title: 'Effortless Returns', text: '30-day money-back guarantee, no questions asked.' },
        { icon: <Lock size={24} className="text-black mb-0" />, title: 'Secure Checkout', text: 'Encrypted transactions for your peace of mind.' },
        { icon: <Award size={24} className="text-black mb-0" />, title: 'Exceptional Quality', text: 'Crafted from the finest sustainable materials.' },
    ];

    return (
        <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden text-black">
            <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative h-[500px] md:h-[700px] overflow-hidden">
                        <ScrollReveal direction="left" className="h-full w-full">
                            <img
                                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                                alt="Modernist Craftsmanship"
                                className="w-full h-full object-cover grayscale-20 transition-transform duration-[2s] hover:scale-105"
                            />
                        </ScrollReveal>
                        <div className="absolute inset-0 border border-black/10 m-6 pointer-events-none hidden md:block" />
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 max-w-2xl">
                        <ScrollReveal direction="up">
                            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 block font-semibold">The Modernist Way</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-medium text-black mb-8 leading-[1.1] tracking-tight">
                                Designed for Life.<br /> Made to Endure.
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.1}>
                            <p className="text-gray-600 mb-16 text-lg tracking-wide leading-relaxed font-light">
                                We believe in fashion that doesn't compromise. Our collections are ethically crafted from sustainable, premium materials, ensuring every piece feels as remarkable as it looks. Discover the intersection of comfort and luxury.
                            </p>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {features.map((feature, idx) => (
                                <ScrollReveal direction="up" delay={0.2 + (idx * 0.1)} key={idx}>
                                    <div className="group flex flex-col items-start">
                                        <div className="mb-4 p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                                            {feature.icon}
                                        </div>
                                        <h4 className="font-semibold text-black tracking-widest text-xs uppercase mb-2">{feature.title}</h4>
                                        <p className="text-sm text-gray-500 font-light leading-relaxed">{feature.text}</p>
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
