import { ArrowRight, Sparkles } from "lucide-react";

import { Container } from "@/components/common/Container";
import { LinkButton } from "@/components/common/LinkButton";

export function CTA() {
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-28">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-card/40 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />
            <div className="absolute inset-0 bg-panel-glow" />
          </div>

          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Set up in under 5 minutes
            </span>

            <h2
              id="cta-title"
              className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Give your team one place to get things done
            </h2>

            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Join 12,000+ teams who traded scattered tools and status meetings
              for a workspace that keeps itself up to date.
            </p>

            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <LinkButton
                href="/signup"
                size="lg"
                className="group h-11 px-5 text-sm shadow-lg shadow-brand/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand/35"
              >
                Get Started
                <ArrowRight
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </LinkButton>

              <LinkButton
                href="/contact-sales"
                variant="outline"
                size="lg"
                className="h-11 px-5 text-sm transition-colors duration-300 hover:border-brand/40"
              >
                Talk to sales
              </LinkButton>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Free 14-day trial · No credit card required · SOC 2 Type II
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
