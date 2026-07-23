"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/common/Container";
import { LinkButton } from "@/components/common/LinkButton";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/constants/landing";

const MOBILE_MENU_ID = "mobile-navigation";

const NAV_LINK_CLASSES =
  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Escape closes the mobile menu, matching native disclosure behaviour.
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <Container>
        <nav
          aria-label="Main"
          className="flex h-16 items-center justify-between gap-4"
        >
          <Logo />

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={NAV_LINK_CLASSES}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <LinkButton href="/login" variant="ghost" size="lg">
              Login
            </LinkButton>
            <LinkButton
              href="/signup"
              size="lg"
              className="shadow-lg shadow-brand/20 transition-all duration-200 hover:shadow-brand/35"
            >
              Get Started
            </LinkButton>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </nav>
      </Container>

      {isMenuOpen ? (
        <div
          id={MOBILE_MENU_ID}
          className="animate-in fade-in slide-in-from-top-2 border-t border-border/60 bg-background/95 backdrop-blur-xl duration-200 md:hidden"
        >
          <Container className="py-4">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-4">
              <LinkButton
                href="/login"
                variant="outline"
                size="lg"
                onClick={closeMenu}
              >
                Login
              </LinkButton>
              <LinkButton href="/signup" size="lg" onClick={closeMenu}>
                Get Started
              </LinkButton>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
