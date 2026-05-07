"use client";

import { Shield } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            SentinelSOL
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#solution"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Solution
          </Link>
          <Link
            href="#code"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Code
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/Raynzler/SentinelSOL"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-primary bg-primary px-3 py-1.5 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}
