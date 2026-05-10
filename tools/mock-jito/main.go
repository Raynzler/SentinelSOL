// Mock Jito metrics exporter for demo/video purposes only.
//
// Add this scrape job to your config/prometheus.yml:
//
//   - job_name: 'jito_mock'
//     static_configs:
//       - targets: ['host.docker.internal:8081']
//
package main

import (
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
	shredLatency = prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "jito_shred_receive_latency_ms",
		Help: "Simulated ShredStream receive latency in milliseconds",
	})

	bundlesAccepted = prometheus.NewCounter(prometheus.CounterOpts{
		Name: "jito_bundle_accepted_total",
		Help: "Simulated total bundles accepted by the Block Engine",
	})
)

func init() {
	prometheus.MustRegister(shredLatency)
	prometheus.MustRegister(bundlesAccepted)
}

func main() {
	go func() {
		for {
			v := 20.0 + rand.Float64()*130.0
			shredLatency.Set(v)
			time.Sleep(2 * time.Second)
		}
	}()

	go func() {
		for {
			time.Sleep(5 * time.Second)
			inc := 1 + rand.Intn(4)
			bundlesAccepted.Add(float64(inc))
		}
	}()

	mux := http.NewServeMux()
	mux.Handle("/metrics", promhttp.Handler())

	log.Println("[MOCK-JITO] Serving fake Jito metrics on :8081/metrics")
	if err := http.ListenAndServe(":8081", mux); err != nil {
		log.Fatalf("ERR: mock-jito server failed: %v", err)
	}
}
