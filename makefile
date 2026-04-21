.PHONY: up down logs restart

# The SentinelSOL MVP 1-Click Deploy
up:
	docker-compose up -d --build

# Graceful degradation of the cluster
down:
	docker-compose down

# Tail the pipeline logs in real-time
logs:
	docker-compose logs -f

# Hard restart the entire cluster
restart: 
	down up