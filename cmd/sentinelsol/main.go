package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	_ "net/http/pprof" // Injects /debug/pprof handlers into http.DefaultServeMux
	"sync"
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
const rpcURL = "http://host.docker.internal:8899"

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
// It relies on the globally configured httpClient to prevent blocking indefinitely.
func executeRPC(reqBody RPCRequest, target interface{}) error {
	jsonData, _ := json.Marshal(reqBody)

	resp, err := httpClient.Post(rpcURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return json.NewDecoder(resp.Body).Decode(target)
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
	// 1. Isolate the diagnostic server strictly to the loopback interface.
	// This prevents memory profiles from leaking to the public internet while
	// still allowing local SRE debugging via http://127.0.0.1:6060/debug/pprof
	go func() {
		log.Println("SYS: Internal pprof profiling active on 127.0.0.1:6060")
		if err := http.ListenAndServe("127.0.0.1:6060", nil); err != nil {
			log.Fatalf("FATAL: pprof listener collapsed: %v", err)
		}
	}()

	// 2. Initialize asynchronous metric scraping daemon
	recordMetrics()

	// 3. Instantiate an isolated multiplexer for the metrics server.
	// This ensures the public 8080 port does not inherit the DefaultServeMux pprof endpoints.
	metricsMux := http.NewServeMux()
	metricsMux.Handle("/metrics", promhttp.Handler())

	// 4. Define explicit server boundaries to prevent slow-loris attacks and connection hangs.
	metricsServer := &http.Server{
		Addr:         ":8080",
		Handler:      metricsMux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Println("SYS: SentinelSOL Exporter bound to 0.0.0.0:8080/metrics")
	if err := metricsServer.ListenAndServe(); err != nil {
		log.Fatalf("FATAL: Metrics server collapsed: %v", err)
	}
}