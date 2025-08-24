import Header from '../LandingPage/Header';
import HeroSection from '../LandingPage/Hero';
import FeaturesSection from '../LandingPage/Features';
import DemoSection from '../LandingPage/Demo';
import CTASection from '../LandingPage/CTA';
import Footer from '../LandingPage/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <CTASection />
      <Footer />
    </div>
  );
}