import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DifferentiatorSection } from "@/components/landing/differentiator-section";
import { SampleOutputSection } from "@/components/landing/sample-output-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TrustFooter } from "@/components/landing/trust-footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <HowItWorksSection />
        <DifferentiatorSection />
        <SampleOutputSection />
        <PricingSection />
      </main>
      <TrustFooter />
    </>
  );
}
