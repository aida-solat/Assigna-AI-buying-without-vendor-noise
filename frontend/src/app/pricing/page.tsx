import { Header } from "@/components/landing/header";
import { TrustFooter } from "@/components/landing/trust-footer";
import { PricingSection } from "@/components/landing/pricing-section";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PricingSection />
      </main>
      <TrustFooter />
    </>
  );
}
