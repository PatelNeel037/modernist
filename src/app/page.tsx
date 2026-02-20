import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import AboutSection from '@/components/AboutSection';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import BrandStatement from '@/components/BrandStatement';
import InstagramSection from '@/components/InstagramSection';

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-content-heading bg-bg-soft">
      <Navbar />
      <Hero />
      <BrandStatement />
      <CategorySection />
      <FeaturedProductsSection />
      <AboutSection />
      <TestimonialSection />
      <InstagramSection />

      {/* Newsletter Section */}
      <section className="py-24 bg-brand-secondary text-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-20 bg-[url('/noise.png')] opacity-10 mix-blend-multiply"></div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-brand-dark">Join the List</h2>
          <p className="text-brand-dark/80 mb-8 text-lg">Sign up & get 15% off your first order.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 px-6 py-3 rounded-full bg-white/40 border border-brand-dark/10 text-brand-dark placeholder-brand-dark/50 focus:outline-none focus:border-brand-dark transition-colors" required />
            <button type="submit" className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold hover:bg-brand-primary transition-colors uppercase tracking-wider text-sm shadow-md hover:shadow-lg">Subscribe</button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
