package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

const targetVoteAccount = "FGw2zfXPGye5K1SGNZeTEkvShssKU1bvDDobM2L19QXf"
const rpcURL = "http://localhost:8899"

var (
	epochCreditsMetric = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "sentinelsol_epoch_credits",
		Help: "Current total vote credits for the validator",
	})

	nodeSlotMetric = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "sentinelsol_node_slot",
		Help: "Highest slot processed by the validator",
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

// Executes HTTP POST and decodes JSON response into the provided target interface
func executeRPC(reqBody RPCRequest, target interface{}) error {
	jsonData, _ := json.Marshal(reqBody)
	resp, err := http.Post(rpcURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return json.NewDecoder(resp.Body).Decode(target)
}

// Retrieves current epoch credits for the target vote account
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
		log.Printf("Credit RPC failed: %v", err)
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

// Retrieves the absolute slot height processed by the node
func fetchSlot() float64 {
	reqBody := RPCRequest{
		JSONRPC: "2.0",
		ID:      2,
		Method:  "getSlot",
	}

	var rpcResp RPCResponseSlot
	if err := executeRPC(reqBody, &rpcResp); err != nil {
		log.Printf("Slot RPC failed: %v", err)
		return 0
	}
	return float64(rpcResp.Result)
}

// Initializes concurrent scraping using Goroutines and a WaitGroup to synchronize completion
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

			log.Printf("Metrics Scraped - Credits: %v | Slot: %v", credits, slot)
			time.Sleep(10 * time.Second)
		}
	}()
}

func main() {
	recordMetrics()
	log.Println("SentinelSOL Exporter active on :8080/metrics")
	http.Handle("/metrics", promhttp.Handler())
	http.ListenAndServe(":8080", nil)
}
