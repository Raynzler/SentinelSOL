import os
import time
import requests

PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://localhost:9090")
ALERT_WEBHOOK_URL = os.getenv("ALERT_WEBHOOK_URL")

HISTORY_WINDOW_SECONDS = 300
LAG_THRESHOLD_PERCENT = 1.5

def fetch_metric(query):
    try:
        response = requests.get(f"{PROMETHEUS_URL}/api/v1/query", params={'query': query})
        data = response.json()
        if data['status'] == 'success' and data['data']['result']:
            return float(data['data']['result'][0]['value'][1])
        return None
    except Exception as e:
        print(f"Error fetching metric: {e}")
        return None

def analyze_and_alert():
    baseline_query = f"avg_over_time(solana_slot_lag[{HISTORY_WINDOW_SECONDS}s])"
    current_query = "solana_slot_lag"

    baseline_lag = fetch_metric(baseline_query)
    current_lag = fetch_metric(current_query)

    if baseline_lag is None or current_lag is None:
        return

    if current_lag > (baseline_lag * LAG_THRESHOLD_PERCENT):
        payload = {
            "alert": "SentinelSOL Early Warning",
            "signal": "Slot Lag Velocity Spike",
            "current_lag": current_lag,
            "baseline": baseline_lag,
            "risk_level": "CRITICAL"
        }
        
        requests.post(ALERT_WEBHOOK_URL, json=payload)
        print(f"ALERT FIRED: {payload}")

if __name__ == "__main__":
    while True:
        analyze_and_alert()
        time.sleep(10)