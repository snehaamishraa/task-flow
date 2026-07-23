# Build stage
FROM golang:1.26-alpine AS builder

WORKDIR /src

# Copy manifests first so `go mod download` is cached and only re-runs when
# dependencies actually change, not on every source edit.
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# CGO disabled so the binary is static and runs on a bare image with no libc.
# -ldflags "-s -w" drops the symbol table and DWARF data, roughly halving size.
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/server ./cmd

# Runtime stage
FROM alpine:3.20

# ca-certificates is required: without it the outbound HTTPS calls to Google's
# token endpoint and the Resend API fail with an unknown-authority error.
RUN apk add --no-cache ca-certificates tzdata

# Run as a non-root user rather than root, which is the default.
RUN adduser -D -u 10001 appuser
USER appuser

WORKDIR /app
COPY --from=builder /out/server /app/server

# Documentation only — the platform injects PORT and the server reads it.
EXPOSE 8080

CMD ["/app/server"]
