# --- Build Stage ---
FROM golang:1.25-alpine AS builder

# Install build dependencies for CGO (required for SQLite)
RUN apk add --no-cache gcc musl-dev

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
# CGO_ENABLED=1 is required because PocketBase uses SQLite
RUN CGO_ENABLED=1 GOOS=linux go build -o pocketbase .

# --- Run Stage ---
FROM alpine:latest

# Install CA certificates for HTTPS requests and tzdata for timezones
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /pb

# Copy the binary from the builder stage
COPY --from=builder /app/pocketbase /pb/pocketbase

# Expose the default PocketBase port
EXPOSE 8090

# Run PocketBase
# We bind to 0.0.0.0 so it's accessible outside the container
ENTRYPOINT ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
