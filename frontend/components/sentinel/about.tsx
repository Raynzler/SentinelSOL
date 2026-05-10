export function About() {
  return (
    <section id="about" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            About the Project
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground">
            Why this exists.
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="border-l-2 border-primary/40 pl-6">
            <p className="leading-relaxed text-muted-foreground">
              Built by Hamza - SRE & DevOps Engineer. When analyzing the Solana
              ecosystem from a reliability perspective, a critical gap became
              apparent: existing validator observability is entirely reactive.
              SentinelSOL was engineered as a proactive, out-of-band capable
              telemetry layer. By predicting hardware exhaustion and monitoring
              ShredStream latency, it protects operators from stake pruning and
              Jito MEV loss before failures occur. Built for the Colosseum
              Hackathon 2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
