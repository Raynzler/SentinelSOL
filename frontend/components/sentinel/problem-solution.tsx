import { AlertTriangle, TrendingUp } from "lucide-react";

export function ProblemSolution() {
  return (
    <section id="solution" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Why SentinelSOL
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground">
            The old way costs you vote credits.
          </h2>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-2">
          {/* Left — The Problem */}
          <div className="bg-background p-10">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded border border-border bg-card">
              <AlertTriangle
                className="h-5 w-5 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              The Trap
            </div>
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              Reactive Monitoring is a Trap.
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              Relying on external third-party monitors means by the time an
              alert fires, you have already lost vote credits. Latency inherent
              to cloud-based polling puts your performance metrics behind
              reality by minutes, minutes that cost you.
            </p>
            <div className="mt-8 border-l-2 border-border pl-4">
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-foreground">Alert latency:</span> 60–300s
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                <span className="text-foreground">Vote credits lost:</span>{" "}
                unrecoverable
              </p>
            </div>
          </div>

          {/* Right — The Solution */}
          <div className="bg-background p-10">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded border border-border bg-card">
              <TrendingUp
                className="h-5 w-5 text-primary"
                strokeWidth={1.5}
              />
            </div>
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
              The Solution
            </div>
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              Predictive Z-Score Math.
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              SentinelSOL monitors absolute vote velocity locally, catching
              hardware exhaustion{" "}
              <span className="font-mono text-primary">
                3 standard deviations
              </span>{" "}
              before total failure. No polling lag. No external API round-trips.
              Just raw signal, processed on-node, in real time.
            </p>
            <div className="mt-8 border-l-2 border-primary/40 pl-4">
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-foreground">Detection window:</span>{" "}
                <span className="text-primary">&lt; 5s</span>
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                <span className="text-foreground">Degradation threshold:</span>{" "}
                <span className="text-primary">σ = 3.0</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
