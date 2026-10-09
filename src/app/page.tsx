import { CtaSection } from "@/components/sections/CtaSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowWeWorkSection } from "@/components/sections/HowWeWorkSection";
import { MetricsSection } from "@/components/sections/MetricsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { TopLabelSection } from "@/components/sections/TopLabelSection";

export default function Home() {
  return (
    <>
      <main className="sections overflow-x-clip">
        <Header />
        <HeroSection />
        <MetricsSection />
        <ServicesSection />
        <ExpertiseSection />
        <HowWeWorkSection />
        <TestimonialSection />
        <CtaSection />
        <FaqSection />
        <TopLabelSection />
      </main>
      <Footer />
    </>
  );
}
