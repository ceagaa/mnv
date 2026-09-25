import { CtaSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/CtaSection";
import { ExpertiseSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/ExpertiseSection";
import { FaqSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/FaqSection";
import { Footer } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/Footer";
import { GallerySection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/GallerySection";
import { Header } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/Header";
import { HeroSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/HeroSection";
import { HowWeWorkSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/HowWeWorkSection";
import { MetricsSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/MetricsSection";
import { ServicesSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/ServicesSection";
import { TestimonialSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/TestimonialSection";
import { TopLabelSection } from "@/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/TopLabelSection";

export default function Home() {
  return (
    <div className="sections overflow-x-clip">
      <Header />
      <HeroSection />
      <ServicesSection />
      <MetricsSection />
      <HowWeWorkSection />
      <GallerySection />
      <TestimonialSection />
      <ExpertiseSection />
      <FaqSection />
      <CtaSection />
      <TopLabelSection />
      <Footer />
    </div>
  );
}
