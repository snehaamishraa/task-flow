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
              Nothing to configure
            </span>

            <h2
              id="cta-title"
              className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Start with your first task
            </h2>

            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Create an account, verify your email, and add something you need
              to get done. That is the whole setup.
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

              {/* Was "Talk to sales" pointing at /contact-sales, a route that
               * does not exist. There is no sales team and no paid plan. */}
              <LinkButton
                href="/login"
                variant="outline"
                size="lg"
                className="h-11 px-5 text-sm transition-colors duration-300 hover:border-brand/40"
              >
                I already have an account
              </LinkButton>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Free · No credit card required
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
