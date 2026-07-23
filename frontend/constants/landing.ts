import {
  CircleCheckBig,
  Lightbulb,
  KeyRound,
  ListChecks,
  LogIn,
  Search,
  SignalHigh,
  SlidersHorizontal,
  SquarePen,
} from "lucide-react";

import { GitHubIcon } from "@/components/common/SocialIcons";
import type {
  Feature,
  FooterColumn,
  NavLink,
  PricingPlan,
  SocialLink,
  Step,
} from "@/types/landing";

/**
 * Everything in this file describes what the app actually does today.
 *
 * Nothing here is aspirational: if a capability is not built, it is not
 * listed, and every link points at a route that exists. Copy that promises
 * teams, integrations, or automations would be found out the moment somebody
 * signs up.
 */

/** Primary navigation shown in the navbar and mirrored in the mobile menu. */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export const FEATURES: Feature[] = [
  {
    title: "Create and edit tasks",
    description:
      "Give each task a title, description, priority, and due date. Change any of it later — nothing is locked in once saved.",
    icon: SquarePen,
  },
  {
    title: "Track status",
    description:
      "Move work through Pending, In Progress, and Completed. Overdue dates are flagged so nothing quietly slips past you.",
    icon: CircleCheckBig,
  },
  {
    title: "Set priorities",
    description:
      "Mark work Low, Medium, or High. Each level has its own colour and icon, so the urgent items stand out at a glance.",
    icon: SignalHigh,
  },
  {
    title: "Search as you type",
    description:
      "Search runs across titles and descriptions and updates while you type. Capitalisation doesn't matter.",
    icon: Search,
  },
  {
    title: "Filter the list",
    description:
      "Narrow by status, priority, or both. Combine filters with a search term to get to a specific task quickly.",
    icon: SlidersHorizontal,
  },
  {
    title: "See where things stand",
    description:
      "Your dashboard counts total, pending, in-progress, and completed tasks, and updates the moment anything changes.",
    icon: ListChecks,
  },
];

export const STEPS: Step[] = [
  {
    title: "Create your account",
    description:
      "Sign up with an email and password, or continue with Google. Either way takes under a minute.",
    icon: LogIn,
    highlights: ["Email and password", "Or one-click Google sign-in"],
  },
  {
    title: "Verify it's really you",
    description:
      "Email signups get a 6-digit code. Enter it and you're in — no unverified addresses get an account.",
    icon: KeyRound,
    highlights: ["Code expires in 10 minutes", "Google accounts skip this step"],
  },
  {
    title: "Start adding tasks",
    description:
      "Add your first task, set its priority and due date, then use search and filters as the list grows.",
    icon: ListChecks,
    highlights: ["Edit or delete anything, anytime", "Your tasks are yours alone"],
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Everything TaskFlow does today, at no cost.",
    price: "$0",
    priceSuffix: "/ month",
    priceNote: "Free, with no card and no trial period.",
    badge: { label: "Available now", icon: CircleCheckBig, variant: "outline" },
    features: [
      "Unlimited tasks",
      "Priority and status on every task",
      "Due dates with overdue warnings",
      "Search across titles and descriptions",
      "Status and priority filters",
      "Email or Google sign-in",
    ],
    cta: {
      label: "Get started free",
      href: "/signup",
      note: "No credit card required",
      icon: LogIn,
    },
    featured: false,
    comingSoon: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Ideas being explored for a paid tier. Nothing is built yet.",
    price: "TBD",
    priceSuffix: "",
    priceNote: "No price set — this plan does not exist yet.",
    badge: { label: "Not built yet", icon: Lightbulb, variant: "default" },
    featuresLeadIn: "Under consideration",
    features: [
      "Shared workspaces for more than one person",
      "Recurring tasks",
      "Reminders before a due date",
      "Attachments and comments",
      "Calendar and board views",
    ],
    cta: {
      label: "Not available",
      note: "Ideas only — no timeline, and none of it is built.",
      icon: Lightbulb,
    },
    featured: true,
    comingSoon: true,
  },
];

/**
 * Only routes that exist.
 *
 * The earlier version linked to /about, /careers, /blog, /docs and a set of
 * legal pages, none of which were ever built — every one of them 404'd.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign up", href: "/signup" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Project",
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/snehaamishraa/task-flow",
        external: true,
      },
    ],
  },
];

/**
 * Only the GitHub repository, because it is the only one that exists.
 *
 * The X and LinkedIn entries pointed at those sites' homepages rather than any
 * TaskFlow profile, which reads as a real presence that is not there.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "TaskFlow source on GitHub",
    href: "https://github.com/snehaamishraa/task-flow",
    icon: GitHubIcon,
  },
];
