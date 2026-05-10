import { Github, Linkedin, Shield, Twitter } from "lucide-react";
import Link from "next/link";

const profileLinks = [
  {
    href: "https://www.x.com/shamza31",
    label: "Twitter/X profile",
    Icon: Twitter,
  },
  {
    href: "https://www.linkedin.com/shamza31",
    label: "LinkedIn profile",
    Icon: Linkedin,
  },
  {
    href: "https://www.github.com/Raynzler",
    label: "GitHub profile",
    Icon: Github,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <span className="font-mono text-sm font-semibold text-foreground">
            SentinelSOL
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="font-mono text-xs text-muted-foreground">
            Built for{" "}
            <span className="text-primary">Colosseum Hackathon 2026</span>
          </p>
          <div className="flex items-center gap-1">
            {profileLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-card text-muted-foreground transition-colors hover:border-primary/70 hover:text-primary"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span>Validator-operated</span>
        </div>
      </div>
    </footer>
  );
}
