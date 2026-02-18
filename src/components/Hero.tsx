'use client';

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
            {/* Background Image / Placeholder */}
            <div className="absolute inset-0 bg-gray-100/50 mix-blend-multiply z-0" />
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Fashion"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-black/20 z-10" />

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight animate-fade-in-up">
                    Modern <br /><span className="text-gray-200">Everyday Wear</span>
                </h1>
                <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto text-gray-100 animate-fade-in-up delay-100">
                    Premium fabrics for modern lifestyle. Redefining your wardrobe with essentials that matter.
                </p>
                <div className="flex justify-center gap-4 animate-fade-in-up delay-200">
                    <a href="/shop/women" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full text-sm font-semibold transition-transform transform hover:scale-105 duration-300 shadow-lg">
                        SHOP WOMEN
                    </a>
                    <a href="/shop/men" className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300">
                        SHOP MEN
                    </a>
                </div>
            </div>
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
                <span className="text-white text-xs font-light tracking-widest">SCROLL</span>
            </div>
        </section>
    );
}
