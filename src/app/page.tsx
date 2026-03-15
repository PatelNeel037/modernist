import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import AboutSection from '@/components/AboutSection';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import BrandStatement from '@/components/BrandStatement';
import InstagramSection from '@/components/InstagramSection';
import NewsletterSection from '@/components/NewsletterSection';
import ScrollReveal from '@/components/ui/ScrollReveal';

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
      <NewsletterSection />

      <Footer />
    </main>
  );
}
