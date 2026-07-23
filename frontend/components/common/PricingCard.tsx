import { Check } from "lucide-react";

import { LinkButton } from "@/components/common/LinkButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PricingPlan } from "@/types/landing";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

export function PricingCard({ plan, className }: PricingCardProps) {
  const {
    id,
    name,
    tagline,
    price,
    priceSuffix,
    priceNote,
    badge,
    featuresLeadIn,
    features,
    cta,
    featured,
    comingSoon,
  } = plan;

  const BadgeIcon = badge.icon;
  const CtaIcon = cta.icon;
  const noteId = `${id}-cta-note`;
  const headingId = `${id}-plan-name`;

  return (
    <li
      className={cn(
        "group relative flex",
        // The featured plan breaks the grid line slightly on desktop.
        featured && "lg:-mt-3 lg:mb-3",
        className,
      )}
    >
      {featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-brand/10 blur-2xl transition-opacity duration-500 group-hover:bg-brand/15"
        />
      ) : null}

      {/* A 1px gradient frame gives the featured plan a brighter edge than a
       * flat border can, without introducing a second accent colour. */}
      <div
        className={cn(
          "relative flex w-full rounded-xl",
          featured &&
            "bg-gradient-to-b from-brand/60 via-brand/25 to-brand/5 p-px shadow-2xl shadow-brand/10",
        )}
      >
        <Card
          aria-labelledby={headingId}
          className={cn(
            "flex w-full flex-col transition-all duration-300 ease-out group-hover:-translate-y-1",
            featured
              ? "bg-card ring-0 group-hover:shadow-xl group-hover:shadow-brand/15"
              : "bg-card/40 ring-border/70 group-hover:bg-card group-hover:ring-brand/40 group-hover:shadow-xl group-hover:shadow-brand/10",
          )}
        >
          <CardHeader>
            <CardAction>
              <Badge variant={badge.variant}>
                <BadgeIcon aria-hidden="true" />
                {badge.label}
              </Badge>
            </CardAction>

            <CardTitle>
              <h3 id={headingId} className="text-lg font-semibold tracking-tight">
                {name}
              </h3>
            </CardTitle>

            <CardDescription className="max-w-[34ch] text-sm leading-relaxed">
              {tagline}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col">
            <p className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="font-mono text-4xl font-semibold tracking-tight text-foreground tabular-nums">
                {price}
              </span>
              <span className="text-sm text-muted-foreground">{priceSuffix}</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{priceNote}</p>

            {featuresLeadIn ? (
              <p className="mt-6 text-xs font-medium tracking-wide text-foreground uppercase">
                {featuresLeadIn}
              </p>
            ) : null}

            <ul
              className={cn(
                "space-y-3 border-t border-border/60 pt-6",
                featuresLeadIn ? "mt-3" : "mt-6",
              )}
            >
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                      featured
                        ? "bg-brand/20 text-brand"
                        : "bg-muted text-muted-foreground group-hover:bg-brand/15 group-hover:text-brand",
                    )}
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto flex-col items-stretch gap-3">
            {comingSoon || !cta.href ? (
              /* `focusableWhenDisabled` keeps the control in the tab order and
               * exposes aria-disabled, so keyboard users hear that Pro is not
               * purchasable instead of the CTA being silently skipped. */
              <Button
                disabled
                focusableWhenDisabled
                size="lg"
                variant="secondary"
                aria-describedby={noteId}
                /* Button's built-in dimming keys off the `:disabled` pseudo-
                 * class, which never matches here because `focusableWhenDisabled`
                 * emits aria-disabled instead of the native attribute. Style the
                 * `data-disabled` state explicitly so it reads as inert. */
                className="h-11 w-full text-sm data-disabled:cursor-not-allowed data-disabled:opacity-65 data-disabled:hover:bg-secondary data-disabled:active:translate-y-0!"
              >
                <CtaIcon aria-hidden="true" />
                {cta.label}
              </Button>
            ) : (
              /* The purchasable plan always carries the primary weight — Pro is
               * visually featured but inert, so Free owns the only real action. */
              <LinkButton
                href={cta.href}
                size="lg"
                aria-describedby={noteId}
                className="h-11 w-full text-sm shadow-lg shadow-brand/20 transition-all duration-300 hover:shadow-xl hover:shadow-brand/30"
              >
                {cta.label}
                <CtaIcon
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </LinkButton>
            )}

            <p id={noteId} className="text-center text-xs text-muted-foreground">
              {cta.note}
            </p>
          </CardFooter>
        </Card>
      </div>
    </li>
  );
}
