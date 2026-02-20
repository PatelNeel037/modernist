'use client';

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
            {/* Background Image / Placeholder */}
            <div className="absolute inset-0 bg-gray-900/40 mix-blend-multiply z-10" />
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Fashion"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="flex flex-col items-center justify-center font-serif leading-tight animate-fade-in-up">
                    <span className="text-2xl md:text-3xl font-light tracking-widest text-gray-200 uppercase mb-4 block">Modern</span>
                    <span className="text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-md">Everyday Wear</span>
                </h1>
                <p className="text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto text-gray-100 animate-fade-in-up delay-100 mt-6 leading-relaxed opacity-90">
                    Premium fabrics for modern lifestyle. Redefining your wardrobe with essentials that matter.
                </p>
                <a href="/shop" className="bg-brand-primary text-white hover:bg-brand-dark px-10 py-4 rounded-full text-base font-bold transition-all transform hover:scale-105 duration-300 shadow-xl border border-transparent hover:shadow-2xl tracking-wide uppercase">
                    SHOP NOW
                </a>
            </div>
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
                <span className="text-white text-xs font-light tracking-widest">SCROLL</span>
            </div>
        </section>
    );
}
