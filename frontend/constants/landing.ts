import {
  ArrowRight,
  Blocks,
  CalendarClock,
  ChartColumnIncreasing,
  Check,
  Hourglass,
  Kanban,
  ListChecks,
  Rocket,
  UserPlus,
  Users,
  Workflow,
} from "lucide-react";

import {
  GitHubIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/common/SocialIcons";
import type {
  Feature,
  FooterColumn,
  NavLink,
  PricingPlan,
  SocialLink,
  Step,
} from "@/types/landing";

/** Primary navigation shown in the navbar and mirrored in the mobile menu. */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export const FEATURES: Feature[] = [
  {
    title: "Visual task boards",
    description:
      "Drag work across customizable boards with swimlanes, filters, and saved views the whole team shares.",
    icon: Kanban,
  },
  {
    title: "Automations that run themselves",
    description:
      "Route assignments, flip statuses, and fire reminders with rules you build once in a visual editor.",
    icon: Workflow,
  },
  {
    title: "Real-time collaboration",
    description:
      "Threaded comments, mentions, and live presence keep everyone aligned without another status meeting.",
    icon: Users,
  },
  {
    title: "Deadline intelligence",
    description:
      "Dependencies, capacity limits, and smart due dates surface risk long before a sprint slips.",
    icon: CalendarClock,
  },
  {
    title: "Progress analytics",
    description:
      "Burndown, cycle time, and velocity reports that turn raw activity into decisions you can defend.",
    icon: ChartColumnIncreasing,
  },
  {
    title: "150+ integrations",
    description:
      "Two-way sync with Slack, GitHub, Figma, and the rest of your stack, plus a typed REST and webhook API.",
    icon: Blocks,
  },
];

export const STEPS: Step[] = [
  {
    title: "Create your workspace",
    description:
      "Sign up in seconds, invite teammates, and import what you already have from Jira, Asana, or a CSV.",
    icon: UserPlus,
    highlights: ["Templates for product, design, and ops", "Role-based access from day one"],
  },
  {
    title: "Plan and assign",
    description:
      "Break work into tasks, set owners and due dates, then hand the repetitive parts to automations.",
    icon: ListChecks,
    highlights: ["Drag-and-drop sprint planning", "Rules for routing and reminders"],
  },
  {
    title: "Ship and track",
    description:
      "Watch progress update live and share dashboards that keep stakeholders out of your inbox.",
    icon: Rocket,
    highlights: ["Live dashboards and reports", "Automatic weekly digests"],
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Everything a small team needs to get organized and stay there.",
    price: "$0",
    priceSuffix: "/ month",
    priceNote: "Free forever. No card, no trial clock.",
    badge: { label: "Available now", icon: Check, variant: "outline" },
    features: [
      "Up to 5 teammates",
      "Unlimited tasks and projects",
      "3 boards with saved views",
      "Real-time comments and mentions",
      "Slack and GitHub integrations",
      "Community support",
    ],
    cta: {
      label: "Get started free",
      href: "/signup",
      note: "No credit card required",
      icon: ArrowRight,
    },
    featured: false,
    comingSoon: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Automation, analytics, and controls for teams that are scaling.",
    price: "$12",
    priceSuffix: "/ user / month",
    priceNote: "Indicative pricing — confirmed at launch.",
    badge: { label: "Coming soon", icon: Hourglass, variant: "default" },
    featuresLeadIn: "Everything in Free, plus",
    features: [
      "Unlimited teammates and boards",
      "Visual workflow automations",
      "Advanced analytics and burndown reports",
      "Deadline intelligence and workload balancing",
      "All 150+ integrations with two-way sync",
      "SSO, audit log, and priority support",
    ],
    cta: {
      label: "Coming soon",
      note: "In active development — not yet available.",
      icon: Hourglass,
    },
    featured: true,
    comingSoon: true,
  },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Customers", href: "/customers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Help center", href: "/help" },
      { label: "API reference", href: "/docs/api" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Security", href: "/legal/security" },
      { label: "Status", href: "/status" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "TaskFlow on GitHub", href: "https://github.com", icon: GitHubIcon },
  { label: "TaskFlow on X", href: "https://x.com", icon: XIcon },
  { label: "TaskFlow on LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
];
