.PHONY: up down logs restart

# The Colosseum MVP 1-Click Deploy
up:
	docker-compose up -d --build

# Graceful Teardown
down:
	docker-compose down

# Tail the pipeline logs in real-time
logs:
	docker-compose logs -f

# Hard restart the entire cluster
restart: down up