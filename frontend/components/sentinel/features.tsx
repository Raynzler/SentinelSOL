import { Cpu, Wifi, Terminal } from "lucide-react";

const features = [
  {
    icon: Cpu,
    metric: "8MB",
    label: "Peak Footprint",
    description:
      "Written in raw Go, idling at 2MB. No JVM, no interpreter, no runtime overhead stealing cycles from your validator.",
    tag: "go binary",
  },
  {
    icon: Wifi,
    metric: "$0",
    label: "Egress Fees",
    description:
      "Local RPC scraping means no cloud bandwidth charges. Your telemetry never leaves the machine unless you want it to.",
    tag: "local-first",
  },
  {
    icon: Terminal,
    metric: "1",
    label: "Deploy Command",
    description:
      "One docker-compose command deploys the Extractor, Prometheus, and Grafana. Fully wired, zero manual config.",
    tag: "docker-compose",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Built for operators
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground">
            Engineering-first by design.
          </h2>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-3">
          {features.map(({ icon: Icon, metric, label, description, tag }) => (
            <article
              key={label}
              className="group bg-background p-8 transition-colors hover:bg-card"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-card transition-colors group-hover:border-primary/40">
                  <Icon
                    className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
                  {tag}
                </span>
              </div>
              <div className="mb-1 font-mono text-3xl font-bold text-primary">
                {metric}
              </div>
              <div className="mb-3 text-sm font-semibold text-foreground">
                {label}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
