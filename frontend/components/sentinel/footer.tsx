import { Shield } from "lucide-react";

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

        <p className="font-mono text-xs text-muted-foreground">
          Built for{" "}
          <span className="text-primary">Colosseum Hackathon 2026</span>
        </p>

        <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span>Validator-operated</span>
        </div>
      </div>
    </footer>
  );
}
