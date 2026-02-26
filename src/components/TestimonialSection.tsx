import { Star } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

export default function TestimonialSection() {
    const testimonials = [
        { name: 'Sarah M.', text: 'Great quality and fast delivery. Layout is clean and easy to navigate.' },
        { name: 'James D.', text: 'Absolutely love the linen shirts. Perfect for summer!' },
        { name: 'Emily R.', text: 'Customer service was amazing when I needed an exchange.' },
    ];

    return (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-6 text-center">
                <ScrollReveal direction="up">
                    <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-12 relative inline-flex items-center gap-4">
                        <span className="h-px bg-gray-300 w-12" />
                        Happy Customers
                        <span className="h-px bg-gray-300 w-12" />
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((test, idx) => (
                        <ScrollReveal direction="up" delay={0.1 * idx} key={idx} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:scale-[1.02] transform transition-transform duration-300">
                            <div className="flex justify-center mb-4 text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-gray-600 italic mb-6">"{test.text}"</p>
                            <h4 className="font-semibold text-gray-900">- {test.name}</h4>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
