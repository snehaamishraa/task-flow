import { Gauge, ShieldCheck, TrendingUp, Users } from "lucide-react";

import { CTA } from "@/components/common/CTA";
import { Container } from "@/components/common/Container";
import { Features } from "@/components/common/Features";
import { Hero } from "@/components/common/Hero";
import { HowItWorks } from "@/components/common/HowItWorks";
import { Pricing } from "@/components/common/Pricing";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Headline metrics. Rendered as a description list so each figure is announced
 * with the label it belongs to rather than as a loose number.
 */
const METRICS = [
  { id: "teams", value: "12,000+", label: "Teams onboarded" },
  { id: "tasks", value: "4.2M", label: "Tasks completed" },
  { id: "uptime", value: "99.98%", label: "Rolling 90-day uptime" },
  { id: "cycle", value: "32%", label: "Faster average cycle time" },
] as const;

const BENEFITS = [
  {
    id: "velocity",
    icon: TrendingUp,
    title: "Ship measurably faster",
    description:
      "Teams close their first sprint in TaskFlow with a third less time lost to status chasing.",
  },
  {
    id: "clarity",
    icon: Users,
    title: "One source of truth",
    description:
      "Boards, comments, and deadlines live together, so nobody reconstructs context from chat threads.",
  },
  {
    id: "trust",
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "SOC 2 Type II, encryption in transit and at rest, and role-based access on every plan.",
  },
] as const;

/**
 * Statistics and benefits.
 *
 * Defined here rather than in components/common/ because this restore is scoped
 * to app/page.tsx alone. Worth extracting to its own file later for parity with
 * the other sections.
 */
function Benefits() {
  return (
    <section
      id="benefits"
      aria-labelledby="benefits-title"
      className="scroll-mt-16 border-t border-border/50 py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Why TaskFlow"
          titleId="benefits-title"
          title="Built for teams that measure their throughput"
          description="The numbers behind the workspace — and what they mean for the way your team ships."
        />

        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 lg:mt-16 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <div
              key={metric.id}
              className="group flex flex-col items-center gap-2 bg-card/40 px-4 py-8 text-center transition-colors duration-300 hover:bg-card sm:px-6"
            >
              <dt className="order-2 text-xs leading-snug text-muted-foreground sm:text-sm">
                {metric.label}
              </dt>
              <dd className="order-1 font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums transition-colors duration-300 group-hover:text-brand sm:text-4xl">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.id}
                className="group rounded-2xl border border-border/60 bg-card/40 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand/40 hover:bg-card hover:shadow-xl hover:shadow-brand/10"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand transition-transform duration-300 ease-out group-hover:scale-110">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Gauge className="size-3.5 text-brand" aria-hidden="true" />
          Metrics reflect aggregated, anonymized workspace activity.
        </p>
      </Container>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        <Hero />
        <Features />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
