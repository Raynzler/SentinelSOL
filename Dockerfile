# Stage 1: The Builder
FROM golang:1.25-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# 1. Copy the entire source code FIRST to bypass the local Mac cache
COPY . .

# 2. Force the isolated container to scan your code and build the lockfile itself
RUN go mod tidy

# 3. Compile the Go application into a static binary
RUN go build -o sentinelsol-daemon ./cmd/sentinelsol/main.go

# Stage 2: The Production Image (Ultra lightweight)
FROM alpine:latest

WORKDIR /app

# Copy ONLY the compiled binary from the builder stage
COPY --from=builder /app/sentinelsol-daemon .

# Expose the Prometheus metrics port and the pprof diagnostic port
EXPOSE 8080
EXPOSE 6060

# Run the daemon
CMD ["./sentinelsol-daemon"]