import { Truck, RotateCcw, Lock, Award } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

export default function AboutSection() {
    const features = [
        { icon: <Truck size={32} className="text-brand-primary mx-auto mb-4" />, title: 'Free Shipping', text: 'On all orders nicely over $50' },
        { icon: <RotateCcw size={32} className="text-brand-primary mx-auto mb-4" />, title: 'Easy Returns', text: '30 days money back guarantee' },
        { icon: <Lock size={32} className="text-brand-primary mx-auto mb-4" />, title: 'Secure Payment', text: 'Checkout with SSL encryption' },
        { icon: <Award size={32} className="text-brand-primary mx-auto mb-4" />, title: 'Premium Quality', text: 'Certified top materials' },
    ];

    return (
        <section id="about" className="py-24 bg-bg-main relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-bg-soft to-bg-main -z-10" />
            <div className="container mx-auto px-6 text-center max-w-4xl">
                <ScrollReveal direction="up">
                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-content-heading mb-6">
                        Designed for Comfort. <br /> Made to Last.
                    </h2>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.1}>
                    <p className="text-content-body mb-16 text-lg max-w-2xl mx-auto leading-relaxed">
                        We believe fashion should be effortless. Our collections are crafted from sustainable, premium materials that feel as good as they look.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <ScrollReveal direction="up" delay={0.1 + (idx * 0.1)} key={idx}>
                            <div className="p-6 bg-bg-main rounded-xl shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border border-bg-accent/50 h-full">
                                {feature.icon}
                                <h4 className="font-semibold text-content-heading mb-2">{feature.title}</h4>
                                <p className="text-sm text-content-body">{feature.text}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
