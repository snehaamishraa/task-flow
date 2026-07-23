import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/** A single navigation or footer destination. */
export interface NavLink {
  label: string;
  href: string;
  /** Set for links that leave the current origin. */
  external?: boolean;
}

/** A product capability rendered by `FeatureCard`. */
export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

/** One entry of the "How it works" timeline. */
export interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
}

/** A titled group of links inside the footer. */
export interface FooterColumn {
  title: string;
  links: NavLink[];
}

/** A single subscription tier rendered by `PricingCard`. */
export interface PricingPlan {
  /** Stable key, also used to derive DOM ids for aria wiring. */
  id: string;
  name: string;
  tagline: string;
  /** Formatted amount, e.g. "$0" or "$12". */
  price: string;
  /** Unit shown next to the amount, e.g. "/ user / month". */
  priceSuffix: string;
  /** Small print under the price. */
  priceNote: string;
  badge: {
    label: string;
    icon: LucideIcon;
    variant: "default" | "outline";
  };
  /** Optional lead-in above the feature list, e.g. "Everything in Free, plus". */
  featuresLeadIn?: string;
  features: string[];
  cta: {
    label: string;
    /** Omitted when the plan is not yet purchasable. */
    href?: string;
    note: string;
    icon: LucideIcon;
  };
  /** Renders the plan as the highlighted card. At most one plan should set this. */
  featured: boolean;
  /** Marks the plan as not yet launched — its CTA renders inert. */
  comingSoon: boolean;
}

/** Any icon that can be sized with a `className` — Lucide icons included. */
export type IconComponent = ComponentType<{ className?: string }>;

/** A social destination rendered in the footer. */
export interface SocialLink {
  label: string;
  href: string;
  icon: IconComponent;
}
