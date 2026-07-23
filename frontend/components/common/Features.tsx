import { Container } from "@/components/common/Container";
import { FeatureCard } from "@/components/common/FeatureCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FEATURES } from "@/constants/landing";

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-16 border-t border-border/50 py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Features"
          titleId="features-title"
          title="Everything your team needs, nothing it doesn't"
          description="Six focused capabilities that replace the spreadsheet, the sticky notes, and the weekly status call."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
