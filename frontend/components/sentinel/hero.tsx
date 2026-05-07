import { Github, BookOpen, ImageIcon } from "lucide-react";
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

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded border border-primary bg-primary px-5 py-2.5 font-mono text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded border border-border bg-card px-5 py-2.5 font-mono text-sm font-medium text-foreground transition-colors hover:border-muted-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Read the Docs
          </Link>
        </div>
      </div>

      {/* Dashboard placeholder */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-5xl">
        <div className="rounded-lg border border-border bg-card p-1 shadow-2xl">
          {/* Fake window chrome */}
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              sentinel-dashboard — Grafana
            </span>
          </div>
          <div className="flex aspect-[16/9] flex-col items-center justify-center gap-4 rounded-b bg-[oklch(0.08_0_0)]">
            <div className="flex flex-col items-center gap-3 opacity-30">
              <ImageIcon className="h-10 w-10 text-primary" strokeWidth={1} />
              <span className="font-mono text-xs text-muted-foreground">
                Drop your Grafana screenshot here
              </span>
            </div>
            {/* Mock chart lines */}
            <svg
              className="absolute inset-0 h-full w-full opacity-10"
              viewBox="0 0 800 450"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                fill="none"
                stroke="oklch(0.55 0.11 40)"
                strokeWidth="1.5"
                points="0,300 80,280 160,260 200,220 240,240 300,180 360,160 420,140 480,120 520,160 580,100 640,80 720,60 800,40"
              />
              <polyline
                fill="none"
                stroke="oklch(0.60 0.06 40)"
                strokeWidth="1"
                points="0,380 100,360 200,350 300,340 380,320 440,300 520,280 600,300 700,260 800,240"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
