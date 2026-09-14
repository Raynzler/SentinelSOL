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
              Built by Hamza Shaikh - Site Reliability, DevOps and Cloud
              Infrastructure - with a second contributor. When analyzing the
              Solana ecosystem from a reliability perspective, a critical gap
              became apparent: existing validator observability is entirely
              reactive. SentinelSOL runs as a separate process from the
              validator, with a configurable RPC endpoint so it can be deployed
              on an isolated host. It polls the validator over Solana JSON-RPC
              for vote-credit accrual and slot progression, then applies
              3-sigma Z-score anomaly detection over a rolling one-hour
              baseline to surface degradation before on-chain delinquency.
              Winner, Superteam Germany / neosfer Solana Ideathon, Frankfurt
              2026; also submitted to the Colosseum Frontier hackathon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
