# Stage 1: The Builder
FROM golang:1.26-alpine AS builder

WORKDIR /app

# 1. Copy ONLY the dependency locks first
COPY go.mod go.sum ./

# 2. Download dependencies (Docker will heavily cache this layer unless go.mod changes)
RUN go mod download

# 3. Copy the rest of the source code
COPY . .

# 4. Compile the static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o sentinelsol-daemon ./cmd/sentinelsol

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