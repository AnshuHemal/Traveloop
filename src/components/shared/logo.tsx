import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  asLink?: boolean;
  className?: string;
  showText?: boolean;
}

export function Logo({
  size = 32,
  asLink = true,
  className,
  showText = true,
}: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5 select-none shrink-0", className)}>
      <LogoMark size={size} />
      {showText && (
        <span
          style={{ fontSize: size * 0.65, lineHeight: 1 }}
          className="font-bold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" aria-label={`${siteConfig.name} — go to homepage`}>
      {content}
    </Link>
  );
}

function LogoMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Globe circle */}
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
      {/* Latitude lines */}
      <ellipse cx="20" cy="20" rx="10" ry="18" stroke="currentColor" strokeWidth="2" className="text-primary" strokeDasharray="0" />
      {/* Horizontal equator */}
      <line x1="2" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary" />
      {/* Path / route line */}
      <path
        d="M8 28 Q14 14 20 20 Q26 26 32 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-primary"
      />
      {/* Destination pin */}
      <circle cx="32" cy="12" r="3" fill="currentColor" className="text-primary" />
    </svg>
  );
}
