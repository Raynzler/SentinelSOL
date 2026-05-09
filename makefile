.PHONY: up down restart logs clean

# Boots the entire telemetry pipeline in detached mode
up:
	docker-compose up --build -d

# Safely spins down the infrastructure and removes orphaned containers
down:
	docker-compose down -v --remove-orphans

# The SRE Clean Reboot (Fixes the P3 Audit Flag)
restart:
	$(MAKE) down
	$(MAKE) up

# Tails the logs for the Go extractor
logs:
	docker-compose logs -f extractor

# Deep cleans the Docker environment for this project
clean: down
	docker system prune -f --volumes