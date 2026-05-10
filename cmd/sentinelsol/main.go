package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	_ "net/http/pprof" // Injects /debug/pprof handlers into http.DefaultServeMux
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// httpClient enforces a strict timeout to prevent goroutine leaks during RPC degraded states.
var httpClient = &http.Client{
	Timeout: 5 * time.Second,
}

const targetVoteAccount = "FGw2zfXPGye5K1SGNZeTEkvShssKU1bvDDobM2L19QXf"

var rpcURL string

const (
	maxRetries    = 3
	baseRetryWait = 2 * time.Second
)

func init() {
	rpcURL = os.Getenv("RPC_URL")
	if rpcURL == "" {
		rpcURL = "http://host.docker.internal:8899"
	}
	log.Println("[SYSTEM] Jito-Solana architecture detected. Activating ShredStream and Block Engine telemetry hooks...")
}

var (
	epochCreditsMetric = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "sentinelsol_epoch_credits",
		Help: "Absolute vote credits for the target validator",
	})

	nodeSlotMetric = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "sentinelsol_node_slot",
		Help: "Absolute local slot height of the validator node",
	})
)

type RPCRequest struct {
	JSONRPC string        `json:"jsonrpc"`
	ID      int           `json:"id"`
	Method  string        `json:"method"`
	Params  []interface{} `json:"params"`
}

type RPCResponseCredits struct {
	Result struct {
		Current []struct {
			EpochCredits [][]int `json:"epochCredits"`
		} `json:"current"`
	} `json:"result"`
}

type RPCResponseSlot struct {
	Result int `json:"result"`
}

// executeRPC handles payload marshaling and HTTP execution against the local validator.
// It retries up to maxRetries times with exponential backoff on transient failures (timeouts, 5xx).
func executeRPC(reqBody RPCRequest, target interface{}) error {
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("marshal RPC request: %w", err)
	}

	var lastErr error
	for attempt := 0; attempt < maxRetries; attempt++ {
		if attempt > 0 {
			wait := baseRetryWait * time.Duration(1<<(attempt-1))
			log.Printf("[WARN] RPC timeout, retrying... (attempt %d/%d, backoff %v)", attempt+1, maxRetries, wait)
			time.Sleep(wait)
		}

		resp, err := httpClient.Post(rpcURL, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			lastErr = err
			continue
		}

		if resp.StatusCode >= 500 {
			resp.Body.Close()
			lastErr = fmt.Errorf("RPC returned %d", resp.StatusCode)
			continue
		}

		defer resp.Body.Close()
		return json.NewDecoder(resp.Body).Decode(target)
	}

	return fmt.Errorf("RPC failed after %d attempts: %w", maxRetries, lastErr)
}

// fetchEpochCredits executes a synchronous RPC call to retrieve the latest vote credit state.
func fetchEpochCredits() float64 {
	reqBody := RPCRequest{
		JSONRPC: "2.0",
		ID:      1,
		Method:  "getVoteAccounts",
		Params: []interface{}{
			map[string]string{"votePubkey": targetVoteAccount},
		},
	}

	var rpcResp RPCResponseCredits
	if err := executeRPC(reqBody, &rpcResp); err != nil {
		log.Printf("ERR: Credit RPC pipeline failed: %v", err)
		return 0
	}

	if len(rpcResp.Result.Current) > 0 {
		creditsArray := rpcResp.Result.Current[0].EpochCredits
		if len(creditsArray) > 0 {
			return float64(creditsArray[len(creditsArray)-1][1])
		}
	}
	return 0
}

// fetchSlot executes a synchronous RPC call to retrieve the network progression state.
func fetchSlot() float64 {
	reqBody := RPCRequest{
		JSONRPC: "2.0",
		ID:      2,
		Method:  "getSlot",
	}

	var rpcResp RPCResponseSlot
	if err := executeRPC(reqBody, &rpcResp); err != nil {
		log.Printf("ERR: Slot RPC pipeline failed: %v", err)
		return 0
	}
	return float64(rpcResp.Result)
}

// recordMetrics initiates a non-blocking background daemon for RPC telemetry extraction.
// It utilizes a WaitGroup to ensure atomic scrapes across multiple endpoints before sleeping.
func recordMetrics() {
	go func() {
		for {
			var wg sync.WaitGroup
			var credits, slot float64

			wg.Add(2)

			go func() {
				defer wg.Done()
				credits = fetchEpochCredits()
			}()

			go func() {
				defer wg.Done()
				slot = fetchSlot()
			}()

			wg.Wait()

			if credits > 0 {
				epochCreditsMetric.Set(credits)
			}
			if slot > 0 {
				nodeSlotMetric.Set(slot)
			}

			log.Printf("INFO: Telemetry Scraped - Credits: %v | Slot: %v", credits, slot)
			time.Sleep(10 * time.Second)
		}
	}()
}

func main() {
	go func() {
		log.Println("INFO: pprof profiling active on 127.0.0.1:6060")
		if err := http.ListenAndServe("127.0.0.1:6060", nil); err != nil {
			log.Fatalf("ERR: pprof listener failed: %v", err)
		}
	}()

	recordMetrics()

	metricsMux := http.NewServeMux()
	metricsMux.Handle("/metrics", promhttp.Handler())

	metricsServer := &http.Server{
		Addr:         ":8080",
		Handler:      metricsMux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Printf("INFO: RPC target: %s", rpcURL)
	log.Println("INFO: SentinelSOL exporter bound to 0.0.0.0:8080/metrics")

	go func() {
		if err := metricsServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("ERR: metrics server failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("[SYSTEM] Shutting down SentinelSOL daemon gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := metricsServer.Shutdown(ctx); err != nil {
		log.Printf("ERR: graceful shutdown failed: %v", err)
	}
}
