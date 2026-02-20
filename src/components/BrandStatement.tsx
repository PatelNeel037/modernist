'use client';

export default function BrandStatement() {
    return (
        <section className="py-24 bg-white text-center px-6">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-playfair leading-tight text-content-heading">
                    "Crafted for modern individuals who value <br className="hidden md:block" />
                    <span className="italic text-brand-primary">style</span> and <span className="italic text-brand-primary">simplicity</span>."
                </h2>
                <div className="w-24 h-1 bg-brand-primary mx-auto mt-12 rounded-full opacity-60"></div>
            </div>
        </section>
    );
}
