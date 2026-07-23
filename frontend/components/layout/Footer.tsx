import Link from "next/link";

import { Container } from "@/components/common/Container";
import { Logo } from "@/components/common/Logo";
import { FOOTER_COLUMNS, SOCIAL_LINKS } from "@/constants/landing";

const FOOTER_LINK_CLASSES =
  "rounded-sm text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/20">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2.6fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A simple, free task manager. Add what you need to do, set a
              priority and a due date, and keep track of what is left.
            </p>

            <ul className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold text-foreground">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={FOOTER_LINK_CLASSES}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          {/* Was "TaskFlow, Inc." — there is no company. And the green dot read
           * "All systems operational", which implies status monitoring that
           * does not exist. */}
          <p className="text-xs text-muted-foreground">
            © {year} TaskFlow. A personal project by Sneha Mishra.
          </p>
        </div>
      </Container>
    </footer>
  );
}
