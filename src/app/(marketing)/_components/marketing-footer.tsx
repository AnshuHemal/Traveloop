import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site";

const FOOTER_LINKS = [
  { label: "Features",    href: "#features" },
  { label: "How it works",href: "#how-it-works" },
  { label: "Pricing",     href: "#pricing" },
  { label: "Privacy",     href: "/privacy" },
  { label: "Terms",       href: "/terms" },
  { label: "Sign in",     href: "/login" },
  { label: "Get started", href: "/signup" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/20 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Logo size={24} />
            <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className="hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Built for travelers everywhere.
        </div>
      </div>
    </footer>
  );
}
