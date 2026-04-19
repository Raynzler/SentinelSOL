# Stage 1: The Builder
FROM golang:1.22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy your Go module files and download dependencies
# (Assuming you ran 'go mod init' locally)
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of your source code
COPY . .

# Compile the Go application into a static binary
RUN go build -o sentinelsol-daemon ./cmd/sentinelsol/main.go

# Stage 2: The Production Image (Ultra lightweight)
FROM alpine:latest

WORKDIR /app

# Copy ONLY the compiled binary from the builder stage
COPY --from=builder /app/sentinelsol-daemon .

# Expose the Prometheus metrics port
EXPOSE 8080

# Run the daemon
CMD ["./sentinelsol-daemon"]