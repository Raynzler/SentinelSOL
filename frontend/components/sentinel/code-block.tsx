"use client";

import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";

const codeLines = [
  { tokens: [{ text: "package", type: "keyword" }, { text: " main", type: "plain" }] },
  { tokens: [] },
  { tokens: [{ text: "import", type: "keyword" }, { text: " (", type: "plain" }] },
  { tokens: [{ text: '\t"net/http"', type: "string" }] },
  { tokens: [{ text: '\t"time"', type: "string" }] },
  { tokens: [{ text: ")", type: "plain" }] },
  { tokens: [] },
  {
    tokens: [
      { text: "// httpClient is shared across all RPC polling goroutines.", type: "comment" },
    ],
  },
  {
    tokens: [
      { text: "// A single instance with a hard timeout prevents goroutine leaks", type: "comment" },
    ],
  },
  {
    tokens: [
      { text: "// under degraded network conditions.", type: "comment" },
    ],
  },
  {
    tokens: [
      { text: "var", type: "keyword" },
      { text: " httpClient = &http.Client{", type: "plain" },
    ],
  },
  {
    tokens: [
      { text: "\tTimeout: ", type: "plain" },
      { text: "5", type: "number" },
      { text: " * time.Second,", type: "plain" },
    ],
  },
  { tokens: [{ text: "}", type: "plain" }] },
];

const snippet = `package main

import (
\t"net/http"
\t"time"
)

var httpClient = &http.Client{
\tTimeout: 5 * time.Second,
}`;

function Token({ text, type }: { text: string; type: string }) {
  const colorMap: Record<string, string> = {
    keyword: "text-primary",
    string: "text-amber-400",
    comment: "text-muted-foreground italic",
    number: "text-sky-400",
    plain: "text-foreground",
  };
  return <span className={colorMap[type] ?? "text-foreground"}>{text}</span>;
}

export function CodeBlock() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="code" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left copy */}
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              Source-verifiable
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground">
              Real Go. No abstractions hiding the work.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The extractor polls your local RPC endpoint on a tight ticker,
              computes a rolling z-score over vote-velocity deltas, and pushes
              metrics to a local Prometheus exporter — all in a single
              self-contained binary you can audit line-by-line.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="font-mono text-xs text-muted-foreground">
                  go 1.25.3 · linux/amd64
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="font-mono text-xs text-muted-foreground">
                MIT License
              </span>
            </div>
          </div>

          {/* Right code panel */}
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-border bg-[oklch(0.11_0_0)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted" />
                <span className="h-2 w-2 rounded-full bg-muted" />
                <span className="h-2 w-2 rounded-full bg-muted" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  extractor/main.go
                </span>
              </div>
              <button
                onClick={handleCopy}
                aria-label="Copy code snippet"
                className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-5 text-sm leading-7">
              <code className="font-mono text-sm">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="mr-5 w-5 shrink-0 select-none text-right font-mono text-xs text-muted-foreground/40">
                      {i + 1}
                    </span>
                    <span>
                      {line.tokens.map((t, j) => (
                        <Token key={j} text={t.text} type={t.type} />
                      ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
