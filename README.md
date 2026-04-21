# SentinelSOL 🛡️

**Predictive SRE Observability Pipeline for Solana Validators**

*Built for the Colosseum Hackathon 2026*

---

## 🛑 The Problem: Silent Delinquency
Current Solana validator monitoring tools act as "Check Engine" lights that only illuminate when the engine is already on fire. Operators rely on absolute thresholds (e.g., node offline, port closed). By the time these alerts fire, the validator is already delinquent, missing votes, and actively losing revenue.

## 🟢 The Solution: Predictive Degradation Analysis
SentinelSOL is an out-of-band (OOB) observability pipeline that detects hardware and network exhaustion *before* it results in on-chain delinquency. 

Instead of waiting for the node to crash, our Golang extraction engine tracks the velocity of **Timely Vote Credits (TVC)** relative to the absolute **Slot Processing Height** in real-time. By utilizing PromQL mathematics, SentinelSOL establishes a rolling 1-hour performance baseline. If the "Vote Efficiency Ratio" drops by 20%, SentinelSOL proactively pages the operator via Telegram.

Catch the degradation. Save the revenue.

---

## 🏗️ Architecture Topology

SentinelSOL completely decouples the extraction, logic, and alerting layers to ensure enterprise-grade fault tolerance.

1. **The Network:** Local `solana-test-validator` emitting JSON-RPC data.
2. **The Extractor (Golang):** A highly concurrent daemon utilizing Goroutines to fetch Epoch Credits and Slot Height at the exact same millisecond to prevent time-drift.
3. **The Brain (Prometheus):** A time-series database executing mathematical evaluations against historical baselines.
4. **The Router (Alertmanager):** Handles alert deduplication, rate-limiting, and secure webhook delivery.
5. **The Action (Telegram Bot API):** Native mobile paging via SentinelBot.
6. **The Visualizer (Grafana):** Real-time UI dashboarding for node operators.

---

## 📂 Project Structure

Infrastructure-as-Code (IaC) design pattern.

```text
SentinelSOL/
├── cmd/
│   └── sentinelsol/
│       └── main.go             # The Concurrent Go Daemon
├── config/
│   ├── alertmanager.yml        # Webhook & Routing Logic
│   ├── alerts.rules.yml        # Predictive PromQL Mathematics
│   └── prometheus.yml          # Scrape Configs
├── Dockerfile                  # Multi-stage Go compilation
├── docker-compose.yml          # Full stack orchestrator
└── Makefile                    # Infrastructure abstraction commands