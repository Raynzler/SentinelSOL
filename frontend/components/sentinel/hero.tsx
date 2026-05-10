import Image from "next/image";
import { Github, BookOpen } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32">


      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded border border-border bg-card px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-mono text-xs text-muted-foreground">
            Colosseum Hackathon 2026
          </span>
        </div>

        <h1 className="mb-5 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Zero-footprint, predictive{" "}
          <span className="text-primary">observability</span> for Solana
          validators.
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
          An 8MB sidecar that detects node degradation before it impacts your
          epoch returns. Zero external API fees, zero bloat.
        </p>

        <div className="mt-12 bg-red-900/10 border border-red-500/20 rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-red-400 mb-2">
            The Motivation: The SFDP Validator Prune
          </h3>
          <p className="text-slate-300 leading-relaxed">
            The Solana Foundation Delegation Program is actively pruning underperforming nodes. Bad performance now equals immediate removal and loss of delegated stake. SentinelSOL was engineered to give operators a predictive edge—catching hardware degradation and network exhaustion before it results in on-chain delinquency and stake-stripping.
          </p>
          <div className="mt-4 flex gap-4 text-sm font-semibold">
            <a href="https://blockworks.com/news/solana-foundation-pruning-validators-delegation" target="_blank" className="text-red-400 hover:text-red-300 transition-colors">Read the Blockworks Report ↗</a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="https://github.com/Raynzler/SentinelSOL"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded border border-primary bg-primary px-5 py-2.5 font-mono text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </Link>
          <Link
            href="https://github.com/Raynzler/SentinelSOL#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded border border-border bg-card px-5 py-2.5 font-mono text-sm font-medium text-foreground transition-colors hover:border-muted-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Read the Docs
          </Link>
        </div>
      </div>

      {/* Dashboard placeholder */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-5xl">
        <div className="overflow-hidden rounded-lg border border-border/80 bg-card/80 p-1 shadow-2xl shadow-black/40 ring-1 ring-white/5">
          {/* Fake window chrome */}
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              sentinel-dashboard — Grafana
            </span>
          </div>
          <div className="relative overflow-hidden rounded-b bg-[oklch(0.08_0_0)]">
            <Image
              src="/dashboard.jpg"
              alt="SentinelSOL Grafana dashboard showing validator observability metrics"
              width={2292}
              height={1076}
              priority
              sizes="(min-width: 1024px) 1024px, calc(100vw - 48px)"
              className="h-auto w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
