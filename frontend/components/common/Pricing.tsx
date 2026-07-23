import { Container } from "@/components/common/Container";
import { PricingCard } from "@/components/common/PricingCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PRICING_PLANS } from "@/constants/landing";

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="scroll-mt-16 border-t border-border/50 py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          titleId="pricing-title"
          title="Start free. Upgrade when the team outgrows it."
          description="The Free plan is live today and stays free. Pro adds automation, analytics, and admin controls — it's in active development."
        />

        <ul className="mx-auto mt-14 grid max-w-5xl gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </ul>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Prices in USD. Pro pricing is indicative and will be confirmed before
          launch.
        </p>
      </Container>
    </section>
  );
}
