import { ArrowRight, Check, CirclePlay } from "lucide-react";

import { Container } from "@/components/common/Container";
import { DashboardMockup } from "@/components/common/DashboardMockup";
import { LinkButton } from "@/components/common/LinkButton";

// Each of these is literally true. There is no trial clock to expire and
// nothing to cancel, because there is no paid plan to be on.
const TRUST_POINTS = [
  "Free to use",
  "No credit card required",
  "Verified email or Google sign-in",
];

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative scroll-mt-16 overflow-hidden"
    >
      {/* Decorative backdrop: grid + brand glow. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern mask-fade-b" />
        <div className="absolute inset-0 bg-radial-glow" />
      </div>

      <Container className="py-16 sm:py-24 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="mx-auto flex min-w-0 max-w-2xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
            <h1
              id="hero-title"
              className="text-balance text-4xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Manage Your Tasks{" "}
              <span className="bg-gradient-to-r from-brand-soft via-brand to-brand-soft bg-clip-text text-transparent">
                Without the Chaos
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              TaskFlow keeps your tasks, priorities, and deadlines on one
              screen. Add what you need to do, mark it Pending, In Progress, or
              Completed, and find any of it again in seconds.
            </p>

            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <LinkButton
                href="/signup"
                size="lg"
                className="group h-11 px-5 text-sm shadow-lg shadow-brand/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand/35"
              >
                Start for free
                <ArrowRight
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </LinkButton>

              <LinkButton
                href="#how-it-works"
                variant="outline"
                size="lg"
                className="group h-11 px-5 text-sm transition-colors duration-300 hover:border-brand/40"
              >
                <CirclePlay
                  className="text-muted-foreground transition-colors duration-300 group-hover:text-brand"
                  aria-hidden="true"
                />
                See how it works
              </LinkButton>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Check className="size-3.5 text-brand" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <DashboardMockup className="mx-auto w-full min-w-0 max-w-xl lg:max-w-none" />
        </div>
      </Container>
    </section>
  );
}
