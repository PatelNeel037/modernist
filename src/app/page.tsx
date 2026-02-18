import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import AboutSection from '@/components/AboutSection';
import TestimonialSection from '@/components/TestimonialSection'; // Import your testimonial section
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-gray-900 bg-white">
      <Navbar />
      <Hero />
      <CategorySection />
      <FeaturedProductsSection />
      <AboutSection />
      {/* Testimonial Section is missing from imports but I created it. Need to include it. */}
      <TestimonialSection />

      {/* Newsletter Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-20 bg-[url('/noise.png')] opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Join the List</h2>
          <p className="text-gray-400 mb-8 text-lg">Sign up & get 15% off your first order.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-white transition-colors placeholder-gray-500" required />
            <button type="submit" className="bg-white text-gray-900 px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors uppercase tracking-wider text-sm">Subscribe</button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
