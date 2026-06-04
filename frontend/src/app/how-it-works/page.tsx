import { Header } from "@/components/landing/header";
import { TrustFooter } from "@/components/landing/trust-footer";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DifferentiatorSection } from "@/components/landing/differentiator-section";

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="pt-12">
          <HowItWorksSection />
        </div>
        <DifferentiatorSection />
      </main>
      <TrustFooter />
    </>
  );
}
