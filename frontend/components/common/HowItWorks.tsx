import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { StepCard } from "@/components/common/StepCard";
import { STEPS } from "@/constants/landing";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="relative scroll-mt-16 overflow-hidden border-t border-border/50 py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern mask-fade-edges opacity-60"
      />

      <Container>
        <SectionHeading
          eyebrow="How it works"
          titleId="how-it-works-title"
          title="Up and running in three steps"
          description="Sign up, confirm your email, and start adding tasks. There is nothing else to set up."
        />

        <div className="relative mt-14 lg:mt-16">
          {/* Timeline rule, aligned to the centre of each step badge. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-6 right-[16.6%] left-[16.6%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />

          <ol className="grid gap-10 sm:gap-12 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
