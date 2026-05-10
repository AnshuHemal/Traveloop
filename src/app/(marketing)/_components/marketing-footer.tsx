import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/20 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Logo size={24} />
            <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors font-medium text-primary">Get started</Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Built with ❤️ for travelers everywhere.
        </div>
      </div>
    </footer>
  );
}
