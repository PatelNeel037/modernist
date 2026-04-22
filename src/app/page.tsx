import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CTAHeroSection from '@/components/CTAHeroSection';
import BrandStatement from '@/components/BrandStatement';
import WhyModernistSection from '@/components/WhyModernistSection';
import StatsSection from '@/components/StatsSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import CollectionPreviewSection from '@/components/CollectionPreviewSection';
import JourneySection from '@/components/JourneySection';
import PremiumFeaturesSection from '@/components/PremiumFeaturesSection';
import AboutSection from '@/components/AboutSection';
import TestimonialSection from '@/components/TestimonialSection';
import InstagramSection from '@/components/InstagramSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import HomeBackdrop from '@/components/HomeBackdrop';

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden font-sans text-content-heading bg-bg-main">
      <HomeBackdrop />
      <Navbar />

      {/* Hero Section - Immersive Entry */}
      <Hero />

      {/* Quick Value Proposition */}
      <CTAHeroSection />

      {/* Brand Philosophy */}
      <BrandStatement />

      {/* Why Choose Modernist */}
      <WhyModernistSection />

      {/* Social Proof - Stats */}
      <StatsSection />

      {/* Main Category Navigation */}
      <CategorySection />

      {/* Featured/Trending Products */}
      <FeaturedProductsSection />

      {/* Collection Previews */}
      <CollectionPreviewSection />

      {/* Customer Journey Timeline */}
      <JourneySection />

      {/* Premium Features & Benefits */}
      <PremiumFeaturesSection />

      {/* About the Brand */}
      <AboutSection />

      {/* Customer Testimonials */}
      <TestimonialSection />

      {/* Instagram/Social */}
      <InstagramSection />

      {/* Newsletter Signup */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
